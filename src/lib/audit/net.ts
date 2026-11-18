// طبقة شبكة آمنة لمحرّك الفحص.
// كل طلب يمرّ من هنا: نتحقق من العنوان قبل الاتصال ونثبّت الـ IP الذي تحققنا منه،
// حتى لا يُستعمل الفحص للوصول إلى شبكات داخلية (SSRF) ولو عبر تحويل أو تبديل DNS.
import http from "http";
import https from "https";
import net from "net";
import zlib from "zlib";
import { lookup } from "dns/promises";
import type { TLSSocket } from "tls";
import type { Readable } from "stream";
import { AuditError } from "./types";

const USER_AGENT = "Mozilla/5.0 (compatible; AtharLab/1.0; website audit)";

function isBlockedIPv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return true;
  const [a, b, c] = parts;
  if (a === 0 || a === 10 || a === 127) return true; // هذا الجهاز / خاص / loopback
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 169 && b === 254) return true; // link-local وعناوين metadata السحابية
  if (a === 172 && b >= 16 && b <= 31) return true; // خاص
  if (a === 192 && b === 168) return true; // خاص
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return true; // محجوز / توثيق
  if (a === 198 && (b === 18 || b === 19)) return true; // اختبار أداء
  if (a === 198 && b === 51 && c === 100) return true; // توثيق
  if (a === 203 && b === 0 && c === 113) return true; // توثيق
  if (a >= 224) return true; // multicast ومحجوز
  return false;
}

/** هل العنوان داخلي أو محجوز ولا يجوز فحصه؟ */
export function isBlockedAddress(ip: string): boolean {
  const family = net.isIP(ip);
  if (family === 4) return isBlockedIPv4(ip);
  if (family !== 6) return true;

  const v6 = ip.toLowerCase();
  if (v6 === "::" || v6 === "::1") return true;
  // IPv4 مضمّن داخل IPv6: نفحص الـ IPv4 نفسه، والصيغة الست عشرية نرفضها احتياطاً.
  const mapped = v6.match(/^::ffff:(.+)$/);
  if (mapped) return net.isIP(mapped[1]) === 4 ? isBlockedIPv4(mapped[1]) : true;
  if (v6.startsWith("64:ff9b:")) return true; // NAT64
  if (/^f[cd]/.test(v6)) return true; // fc00::/7 خاص
  if (/^fe[89ab]/.test(v6)) return true; // fe80::/10 link-local
  if (v6.startsWith("ff")) return true; // multicast
  if (v6.startsWith("2001:db8:")) return true; // توثيق
  return false;
}

/** يتحقق من الرابط ويعيده مُطبَّعاً، أو يرمي AuditError. */
export function parseTarget(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new AuditError("invalid_url");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new AuditError("invalid_url");
  if (u.username || u.password) throw new AuditError("invalid_url");
  // المنافذ القياسية فقط: الفحص ليس ماسح منافذ.
  if (u.port && u.port !== "80" && u.port !== "443") throw new AuditError("blocked_host");

  const host = u.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host) throw new AuditError("invalid_url");
  if (net.isIP(host)) {
    if (isBlockedAddress(host)) throw new AuditError("blocked_host");
  } else {
    if (!host.includes(".")) throw new AuditError("blocked_host");
    if (/(^|\.)(localhost|local|internal|lan|home|corp|intranet)$/.test(host)) {
      throw new AuditError("blocked_host");
    }
  }
  u.hash = "";
  return u;
}

interface Pinned {
  address: string;
  family: 4 | 6;
}

/** يحلّ اسم النطاق ويرفضه إن كان أي عنوان من عناوينه داخلياً. */
async function resolvePinned(hostname: string): Promise<Pinned | null> {
  const host = hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host)) return null; // عنوان صريح: تحققنا منه في parseTarget
  let records: { address: string; family: number }[];
  try {
    records = await lookup(host, { all: true });
  } catch {
    throw new AuditError("dns_failed");
  }
  if (records.length === 0) throw new AuditError("dns_failed");
  if (records.some((r) => isBlockedAddress(r.address))) throw new AuditError("blocked_host");
  const pick = records.find((r) => r.family === 4) ?? records[0];
  return { address: pick.address, family: pick.family === 6 ? 6 : 4 };
}

export interface TlsInfo {
  authorized: boolean;
  error: string | null;
  validTo: string | null;
  issuer: string | null;
  protocol: string | null;
}

export interface RawResponse {
  url: string;
  status: number;
  headers: http.IncomingHttpHeaders;
  setCookies: string[];
  body: string;
  /** حجم الجسم كما نُقل على الشبكة (قبل فك الضغط). */
  transferBytes: number;
  /** حجم الجسم بعد فك الضغط. */
  decodedBytes: number;
  truncated: boolean;
  ttfbMs: number;
  tls: TlsInfo | null;
}

interface RequestOptions {
  timeoutMs: number;
  maxBytes: number;
}

function decoderFor(encoding: string): NodeJS.ReadWriteStream | null {
  switch (encoding.trim().toLowerCase()) {
    case "gzip":
    case "x-gzip":
      return zlib.createGunzip();
    case "deflate":
      return zlib.createInflate();
    case "br":
      return zlib.createBrotliDecompress();
    default:
      return null;
  }
}

/** طلب GET واحد بدون متابعة تحويلات. */
export async function requestOnce(target: URL, opts: RequestOptions): Promise<RawResponse> {
  const pinned = await resolvePinned(target.hostname);
  const isHttps = target.protocol === "https:";
  const hostname = target.hostname.replace(/^\[|\]$/g, "");

  return new Promise<RawResponse>((resolve, reject) => {
    let settled = false;
    const startedAt = performance.now();

    const fail = (err: AuditError) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      req.destroy();
      reject(err);
    };

    const requestOptions: https.RequestOptions = {
      protocol: target.protocol,
      hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: "GET",
      agent: false,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "ar,en;q=0.8",
      },
    };
    if (isHttps) {
      // لا نرفض الشهادات المعطوبة: نريد أن نبلّغ عنها في التقرير بدل أن يفشل الفحص.
      requestOptions.rejectUnauthorized = false;
      if (!net.isIP(hostname)) requestOptions.servername = hostname;
    }
    if (pinned) {
      // تثبيت العنوان الذي تحققنا منه: يمنع تبديل DNS بين الفحص والاتصال.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- توقيع lookup في Node يتغيّر حسب options.all
      requestOptions.lookup = ((_host: string, options: any, cb: any) => {
        if (options && options.all) cb(null, [{ address: pinned.address, family: pinned.family }]);
        else cb(null, pinned.address, pinned.family);
      }) as unknown as net.LookupFunction;
    }

    const req = (isHttps ? https : http).request(requestOptions, (res) => {
      const ttfbMs = Math.round(performance.now() - startedAt);

      let tls: TlsInfo | null = null;
      if (isHttps) {
        const socket = res.socket as TLSSocket;
        const cert = socket.getPeerCertificate();
        const hasCert = cert && Object.keys(cert).length > 0;
        const issuerOrg = hasCert ? cert.issuer?.O ?? cert.issuer?.CN : null;
        tls = {
          authorized: socket.authorized,
          error: socket.authorized ? null : String(socket.authorizationError ?? "unknown"),
          validTo: hasCert ? cert.valid_to : null,
          issuer: Array.isArray(issuerOrg) ? issuerOrg[0] : issuerOrg ?? null,
          protocol: socket.getProtocol(),
        };
      }

      let transferBytes = 0;
      let decodedBytes = 0;
      let truncated = false;
      const chunks: Buffer[] = [];

      res.on("data", (chunk: Buffer) => {
        transferBytes += chunk.length;
      });

      const encoding = String(res.headers["content-encoding"] ?? "");
      const decoder = encoding ? decoderFor(encoding) : null;
      const stream: Readable = decoder ? (res.pipe(decoder) as unknown as Readable) : res;

      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const setCookie = res.headers["set-cookie"];
        resolve({
          url: target.toString(),
          status: res.statusCode ?? 0,
          headers: res.headers,
          setCookies: Array.isArray(setCookie) ? setCookie : [],
          body: Buffer.concat(chunks).toString("utf-8"),
          transferBytes,
          decodedBytes,
          truncated,
          ttfbMs,
          tls,
        });
      };

      stream.on("data", (chunk: Buffer) => {
        if (truncated) return;
        decodedBytes += chunk.length;
        if (decodedBytes > opts.maxBytes) {
          truncated = true;
          chunks.push(chunk.subarray(0, Math.max(0, chunk.length - (decodedBytes - opts.maxBytes))));
          res.destroy();
          finish();
          return;
        }
        chunks.push(chunk);
      });
      stream.on("end", finish);
      // جسم مقطوع أو ضغط تالف: نكتفي بما وصل، فالترويسات نفسها مفيدة للتقرير.
      stream.on("error", finish);
      res.on("error", finish);
      res.on("close", () => {
        // اتصال انقطع قبل اكتمال الرد: لن يصل "end" من مفكّك الضغط.
        if (!res.complete) finish();
      });
    });

    const timer = setTimeout(() => fail(new AuditError("timeout")), opts.timeoutMs);

    req.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOTFOUND" || err.code === "EAI_AGAIN") fail(new AuditError("dns_failed"));
      else fail(new AuditError("unreachable"));
    });
    req.end();
  });
}

export interface FollowResult {
  response: RawResponse;
  /** سلسلة التحويلات التي سبقت الرد النهائي. */
  hops: { url: string; status: number }[];
}

/** GET مع متابعة التحويلات يدوياً: كل قفزة تمرّ بنفس التحقق من العنوان. */
export async function requestFollow(
  start: URL,
  opts: RequestOptions & { maxRedirects: number }
): Promise<FollowResult> {
  const hops: { url: string; status: number }[] = [];
  let current = start;
  for (;;) {
    const response = await requestOnce(current, opts);
    const location = response.headers.location;
    const isRedirect = response.status >= 300 && response.status < 400 && typeof location === "string";
    if (!isRedirect) return { response, hops };
    if (hops.length >= opts.maxRedirects) throw new AuditError("unreachable");
    hops.push({ url: current.toString(), status: response.status });
    let next: URL;
    try {
      next = new URL(location, current);
    } catch {
      throw new AuditError("unreachable");
    }
    current = parseTarget(next.toString());
  }
}
