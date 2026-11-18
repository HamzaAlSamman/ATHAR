// محرّك الفحص: يجلب الصفحة مرة واحدة ثم يستخرج منها فحوصات الأداء والأمان والسيو.
// الفحص سلبي بالكامل: نقرأ فقط ما يعلنه الموقع للعموم (HTML، ترويسات، شهادة، DNS).
import { resolveMx, resolveTxt } from "dns/promises";
import { parseTarget, requestFollow, requestOnce, type RawResponse } from "./net";
import {
  AuditError,
  type AuditCategory,
  type AuditReport,
  type Finding,
  type FindingStatus,
  type Grade,
} from "./types";

const MAIN_TIMEOUT_MS = 12_000;
const PROBE_TIMEOUT_MS = 6_000;
const MAX_HTML_BYTES = 2_000_000;
const MAX_PROBE_BYTES = 200_000;

// ---------- أدوات تحليل HTML ----------

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"));
  if (!m) return null;
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

function hasBoolAttr(tag: string, name: string): boolean {
  return new RegExp(`\\s${name}(\\s|=|>|/)`, "i").test(tag);
}

function tags(html: string, name: string): string[] {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

interface ParsedPage {
  title: string | null;
  meta: Map<string, string>;
  canonical: string | null;
  lang: string | null;
  h1Count: number;
  images: string[];
  headBlockingScripts: number;
  externalScripts: number;
  stylesheets: number;
  hasStructuredData: boolean;
  mixedContent: number;
}

function parsePage(rawHtml: string): ParsedPage {
  // التعليقات قد تحوي وسوماً معطّلة تشوّش العدّ.
  const html = rawHtml.replace(/<!--[\s\S]*?-->/g, "");
  const headEnd = html.search(/<\/head\s*>/i);
  const head = headEnd === -1 ? html : html.slice(0, headEnd);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).replace(/\s+/g, " ").trim() : null;

  const meta = new Map<string, string>();
  for (const tag of tags(html, "meta")) {
    const key = (attr(tag, "name") ?? attr(tag, "property") ?? attr(tag, "http-equiv"))?.toLowerCase();
    const content = attr(tag, "content");
    if (key && content !== null && !meta.has(key)) meta.set(key, decodeEntities(content));
  }

  let canonical: string | null = null;
  let stylesheets = 0;
  for (const tag of tags(html, "link")) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) canonical = attr(tag, "href");
    if (rel.includes("stylesheet")) stylesheets++;
  }

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const isExternal = (tag: string) => Boolean(attr(tag, "src"));
  // سكربت خارجي عادي في <head> يوقف رسم الصفحة حتى يُحمَّل ويُنفَّذ.
  const isBlocking = (tag: string) =>
    isExternal(tag) &&
    !hasBoolAttr(tag, "async") &&
    !hasBoolAttr(tag, "defer") &&
    (attr(tag, "type") ?? "").toLowerCase() !== "module";

  const mixedContent = (
    html.match(/<(?:script|img|iframe|video|audio|source|embed)\b[^>]*\ssrc\s*=\s*["']?http:\/\//gi) ?? []
  ).length + tags(html, "link").filter((t) => /stylesheet/i.test(attr(t, "rel") ?? "") && /^http:\/\//i.test(attr(t, "href") ?? "")).length;

  return {
    title: title || null,
    meta,
    canonical,
    lang: attr(htmlTag, "lang"),
    h1Count: (html.match(/<h1[\s>]/gi) ?? []).length,
    images: tags(html, "img"),
    headBlockingScripts: tags(head, "script").filter(isBlocking).length,
    externalScripts: tags(html, "script").filter(isExternal).length,
    stylesheets,
    hasStructuredData: /<script\b[^>]*type\s*=\s*["']?application\/ld\+json/i.test(html),
    mixedContent,
  };
}

// ---------- فحوصات مساعدة على الشبكة ----------

async function probe(url: string, follow = 3): Promise<RawResponse | null> {
  try {
    const { response } = await requestFollow(parseTarget(url), {
      timeoutMs: PROBE_TIMEOUT_MS,
      maxBytes: MAX_PROBE_BYTES,
      maxRedirects: follow,
    });
    return response;
  } catch {
    return null;
  }
}

/** هل نسخة http:// تحوّل إلى https؟ null إن كان المنفذ 80 مغلقاً أصلاً. */
async function httpUpgrades(host: string): Promise<boolean | null> {
  try {
    const res = await requestOnce(parseTarget(`http://${host}/`), {
      timeoutMs: PROBE_TIMEOUT_MS,
      maxBytes: 1_000,
    });
    const location = String(res.headers.location ?? "");
    if (res.status >= 300 && res.status < 400) return /^https:\/\//i.test(location);
    return false;
  } catch {
    return null;
  }
}

/** هل robots.txt يمنع كل الزواحف من كل الموقع؟ (User-agent: * ثم Disallow: /) */
function robotsBlocksEverything(body: string): boolean {
  let appliesToAll = false;
  let inAgentBlock = false;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const field = line.slice(0, sep).trim().toLowerCase();
    const value = line.slice(sep + 1).trim();
    if (field === "user-agent") {
      // أسطر user-agent المتتالية تشكّل مجموعة واحدة.
      if (!inAgentBlock) appliesToAll = false;
      if (value === "*") appliesToAll = true;
      inAgentBlock = true;
    } else {
      inAgentBlock = false;
      if (field === "disallow" && value === "/" && appliesToAll) return true;
    }
  }
  return false;
}

/** النطاقات المرشّحة لسجلات البريد: من الاسم الكامل حتى النطاق المسجَّل. */
function mailDomains(host: string): string[] {
  const labels = host.replace(/^www\./, "").split(".");
  const out: string[] = [];
  const genericSecondLevel = new Set(["com", "co", "net", "org", "gov", "edu", "ac", "sch", "med"]);
  for (let i = 0; i <= labels.length - 2; i++) {
    const rest = labels.slice(i);
    // "com.sa" أو "co.uk" لاحقة عامة وليست نطاقاً مملوكاً.
    if (rest.length === 2 && rest[1].length === 2 && genericSecondLevel.has(rest[0])) break;
    out.push(rest.join("."));
  }
  return out;
}

async function txtRecords(name: string): Promise<string[]> {
  try {
    return (await resolveTxt(name)).map((parts) => parts.join(""));
  } catch {
    return [];
  }
}

interface MailSecurity {
  hasMail: boolean;
  spf: boolean;
  dmarcPolicy: "none" | "quarantine" | "reject" | null;
}

async function checkMail(host: string): Promise<MailSecurity> {
  const domains = mailDomains(host);
  let hasMail = false;
  let spf = false;
  let dmarcPolicy: MailSecurity["dmarcPolicy"] = null;

  for (const domain of domains) {
    const [mx, txt, dmarc] = await Promise.all([
      resolveMx(domain).catch(() => []),
      txtRecords(domain),
      txtRecords(`_dmarc.${domain}`),
    ]);
    if (mx.some((r) => r.exchange && r.exchange !== ".")) hasMail = true;
    if (txt.some((r) => /^v=spf1\b/i.test(r))) spf = true;
    const record = dmarc.find((r) => /^v=DMARC1\b/i.test(r));
    if (record && !dmarcPolicy) {
      const p = record.match(/\bp\s*=\s*(none|quarantine|reject)/i)?.[1]?.toLowerCase();
      dmarcPolicy = (p as MailSecurity["dmarcPolicy"]) ?? "none";
    }
  }
  return { hasMail, spf, dmarcPolicy };
}

async function lighthousePerformance(target: string): Promise<number | null> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) return null;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(25_000), cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const score = data?.lighthouseResult?.categories?.performance?.score;
    return typeof score === "number" ? Math.round(score * 100) : null;
  } catch {
    return null;
  }
}

// ---------- الدرجات ----------

const STATUS_FACTOR: Record<FindingStatus, number> = { pass: 1, warn: 0.5, fail: 0 };

function categoryScore(findings: Finding[], category: AuditCategory): number {
  const items = findings.filter((f) => f.category === category);
  const total = items.reduce((sum, f) => sum + f.weight, 0);
  if (total === 0) return 0;
  const earned = items.reduce((sum, f) => sum + f.weight * STATUS_FACTOR[f.status], 0);
  return Math.round((earned / total) * 100);
}

function gradeFor(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

/** أصغر عتبة تتجاوزها القيمة تحدد الحالة: (قيمة، حدّ النجاح، حدّ التحذير). */
function byThreshold(value: number, passMax: number, warnMax: number): FindingStatus {
  if (value <= passMax) return "pass";
  if (value <= warnMax) return "warn";
  return "fail";
}

// ---------- الفحص ----------

export async function runAudit(input: string): Promise<AuditReport> {
  const raw = input.trim();
  if (!raw || raw.length > 2000) throw new AuditError("invalid_url");
  const hadScheme = /^https?:\/\//i.test(raw);
  const mainOpts = { timeoutMs: MAIN_TIMEOUT_MS, maxBytes: MAX_HTML_BYTES, maxRedirects: 5 };

  let main;
  try {
    main = await requestFollow(parseTarget(hadScheme ? raw : `https://${raw}`), mainOpts);
  } catch (err) {
    // رابط بلا بروتوكول وموقع لا يدعم HTTPS: نجرّب HTTP ونبلّغ عن ذلك في التقرير.
    const retryable = err instanceof AuditError && err.code === "unreachable";
    if (hadScheme || !retryable) throw err;
    main = await requestFollow(parseTarget(`http://${raw}`), mainOpts);
  }

  const { response: res, hops } = main;
  // 401/403/429/503 على الصفحة الرئيسية تعني غالباً أن الموقع حجب الزائر الآلي.
  if ([401, 403, 429, 503].includes(res.status)) throw new AuditError("blocked_by_site");

  const finalUrl = new URL(res.url);
  const host = finalUrl.hostname;
  const origin = finalUrl.origin;
  const isHttps = finalUrl.protocol === "https:";
  const page = parsePage(res.body);
  const header = (name: string) => {
    const v = res.headers[name];
    return Array.isArray(v) ? v.join(", ") : v ?? null;
  };

  const [upgrades, robots, sitemapProbe, mail, lighthouse] = await Promise.all([
    isHttps ? httpUpgrades(host) : Promise.resolve(false),
    probe(`${origin}/robots.txt`),
    probe(`${origin}/sitemap.xml`),
    checkMail(host),
    lighthousePerformance(res.url),
  ]);

  const findings: Finding[] = [];
  const add = (
    id: string,
    category: AuditCategory,
    status: FindingStatus,
    weight: number,
    data?: Finding["data"]
  ) => findings.push({ id, category, status, weight, data });

  // ===== الأداء =====
  const htmlKB = Math.round(res.decodedBytes / 1024);
  const compressed = Boolean(header("content-encoding"));
  add("perf_ttfb", "performance", byThreshold(res.ttfbMs, 800, 1800), 3, { ms: res.ttfbMs });
  add("perf_html_size", "performance", byThreshold(htmlKB, 150, 500), 2, { kb: htmlKB });
  if (res.decodedBytes > 1024) {
    add("perf_compression", "performance", compressed ? "pass" : "fail", 2);
  }
  add("perf_redirects", "performance", byThreshold(hops.length, 1, 2), 1, { count: hops.length });
  add("perf_blocking_scripts", "performance", byThreshold(page.headBlockingScripts, 0, 3), 2, {
    count: page.headBlockingScripts,
  });
  add("perf_scripts_count", "performance", byThreshold(page.externalScripts, 15, 30), 1, {
    count: page.externalScripts,
  });
  add("perf_css_count", "performance", byThreshold(page.stylesheets, 5, 10), 1, { count: page.stylesheets });

  const imgCount = page.images.length;
  if (imgCount > 4) {
    const lazy = page.images.filter((t) => /lazy/i.test(attr(t, "loading") ?? "")).length;
    add("perf_img_lazy", "performance", lazy > 0 ? "pass" : "warn", 1, { count: imgCount });
  }
  if (imgCount >= 3) {
    const unsized = page.images.filter((t) => !attr(t, "width") || !attr(t, "height")).length;
    add("perf_img_dimensions", "performance", unsized / imgCount > 0.5 ? "warn" : "pass", 1, {
      count: unsized,
    });
  }
  if (lighthouse !== null) {
    add("perf_lighthouse", "performance", lighthouse >= 90 ? "pass" : lighthouse >= 50 ? "warn" : "fail", 4, {
      score: lighthouse,
    });
  }

  // ===== الأمان =====
  add("sec_https", "security", isHttps ? "pass" : "fail", 4);

  let certDaysLeft: number | null = null;
  if (res.tls) {
    const expires = res.tls.validTo ? Date.parse(res.tls.validTo) : NaN;
    if (!Number.isNaN(expires)) certDaysLeft = Math.floor((expires - Date.now()) / 86_400_000);
    const valid = res.tls.authorized && (certDaysLeft === null || certDaysLeft >= 0);
    const status: FindingStatus = !valid ? "fail" : certDaysLeft !== null && certDaysLeft <= 30 ? "warn" : "pass";
    // شهادة سليمة لكنها تقترب من الانتهاء لها نص مختلف عن الشهادة المعطوبة.
    add(status === "warn" ? "sec_cert_expiring" : "sec_cert", "security", status, 3, { days: certDaysLeft ?? 0 });
  }
  if (isHttps && upgrades !== null) {
    add("sec_http_redirect", "security", upgrades ? "pass" : "fail", 2);
  }

  if (isHttps) {
    const hsts = header("strict-transport-security");
    const maxAge = Number(hsts?.match(/max-age\s*=\s*"?(\d+)/i)?.[1] ?? 0);
    add("sec_hsts", "security", !hsts ? "fail" : maxAge >= 15_552_000 ? "pass" : "warn", 2);
  }

  const csp = header("content-security-policy");
  add("sec_csp", "security", csp ? "pass" : "warn", 2);
  add("sec_xcto", "security", /nosniff/i.test(header("x-content-type-options") ?? "") ? "pass" : "fail", 1);
  const framed = Boolean(header("x-frame-options")) || /frame-ancestors/i.test(csp ?? "");
  add("sec_clickjacking", "security", framed ? "pass" : "fail", 2);
  add("sec_referrer", "security", header("referrer-policy") ? "pass" : "warn", 1);
  add("sec_permissions", "security", header("permissions-policy") ? "pass" : "warn", 1);

  if (res.setCookies.length > 0) {
    const noSecure = res.setCookies.filter((c) => !/;\s*secure/i.test(c)).length;
    const noHttpOnly = res.setCookies.filter((c) => !/;\s*httponly/i.test(c)).length;
    const noSameSite = res.setCookies.filter((c) => !/;\s*samesite/i.test(c)).length;
    const status: FindingStatus = isHttps && noSecure > 0 ? "fail" : noHttpOnly + noSameSite > 0 ? "warn" : "pass";
    add("sec_cookies", "security", status, 2, {
      total: res.setCookies.length,
      weak: Math.max(noSecure, noHttpOnly, noSameSite),
    });
  }

  const server = header("server");
  const poweredBy = header("x-powered-by");
  const leaks = [/\d/.test(server ?? "") ? server : null, poweredBy].filter(Boolean).join(" · ");
  add("sec_disclosure", "security", leaks ? "warn" : "pass", 1, { value: leaks });

  if (isHttps) {
    add("sec_mixed", "security", page.mixedContent > 0 ? "fail" : "pass", 2, { count: page.mixedContent });
  }
  if (mail.hasMail) {
    add("sec_spf", "security", mail.spf ? "pass" : "fail", 1);
    const dmarc: FindingStatus =
      mail.dmarcPolicy === null ? "fail" : mail.dmarcPolicy === "none" ? "warn" : "pass";
    add("sec_dmarc", "security", dmarc, 2);
  }

  // ===== السيو والجوال =====
  add("seo_status", "seo", res.status >= 200 && res.status < 300 ? "pass" : "fail", 4, { status: res.status });

  const titleLen = page.title ? [...page.title].length : 0;
  add("seo_title", "seo", !page.title ? "fail" : titleLen < 10 || titleLen > 65 ? "warn" : "pass", 3, {
    length: titleLen,
  });

  const description = page.meta.get("description")?.trim() ?? "";
  const descLen = [...description].length;
  add("seo_description", "seo", !description ? "fail" : descLen < 50 || descLen > 170 ? "warn" : "pass", 2, {
    length: descLen,
  });

  add("seo_h1", "seo", page.h1Count === 0 ? "fail" : page.h1Count > 1 ? "warn" : "pass", 2, {
    count: page.h1Count,
  });
  add("seo_viewport", "seo", page.meta.has("viewport") ? "pass" : "fail", 3);
  add("seo_lang", "seo", page.lang ? "pass" : "warn", 1);
  add("seo_canonical", "seo", page.canonical ? "pass" : "warn", 1);

  const ogTitle = page.meta.has("og:title");
  const ogImage = page.meta.has("og:image");
  add("seo_og", "seo", ogTitle && ogImage ? "pass" : ogTitle || ogImage ? "warn" : "fail", 2);

  const robotsMeta = `${page.meta.get("robots") ?? ""} ${header("x-robots-tag") ?? ""}`;
  add("seo_noindex", "seo", /noindex/i.test(robotsMeta) ? "fail" : "pass", 4);

  const robotsOk = robots !== null && robots.status === 200 && !/<html/i.test(robots.body);
  const blocksAll = robotsOk && robotsBlocksEverything(robots.body);
  add("seo_robots_txt", "seo", blocksAll ? "fail" : robotsOk ? "pass" : "warn", 1);

  const sitemapListed = robotsOk && /^\s*sitemap:\s*\S+/im.test(robots.body);
  const sitemapFound = sitemapProbe !== null && sitemapProbe.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapProbe.body);
  add("seo_sitemap", "seo", sitemapListed || sitemapFound ? "pass" : "warn", 1);
  add("seo_structured", "seo", page.hasStructuredData ? "pass" : "warn", 1);

  if (imgCount > 0) {
    const missingAlt = page.images.filter((t) => attr(t, "alt") === null).length;
    const ratio = 1 - missingAlt / imgCount;
    add("seo_img_alt", "seo", ratio >= 0.9 ? "pass" : ratio >= 0.5 ? "warn" : "fail", 1, { count: missingAlt });
  }

  const scores = {
    performance: categoryScore(findings, "performance"),
    security: categoryScore(findings, "security"),
    seo: categoryScore(findings, "seo"),
  };
  // مشكلة قاطعة (شهادة معطوبة، بلا تشفير، صفحة مخفية عن غوغل أو تعيد خطأ) تجعل باقي
  // النقاط بلا قيمة عملية، فلا يصح أن ترفع الفحوصات الثانوية درجة الفئة فوق الرسوب.
  const failed = (id: string) => findings.some((f) => f.id === id && f.status === "fail");
  if (failed("sec_https") || failed("sec_cert")) scores.security = Math.min(scores.security, 40);
  if (failed("seo_noindex") || failed("seo_status")) scores.seo = Math.min(scores.seo, 40);

  const overall = Math.round(scores.performance * 0.35 + scores.security * 0.35 + scores.seo * 0.3);
  // والدرجة العامة لا تتجاوز D ما دامت المشكلة القاطعة قائمة.
  const blocking = ["sec_https", "sec_cert", "seo_noindex", "seo_status"].some(failed);
  const grade: Grade = blocking && overall >= 65 ? "D" : gradeFor(overall);

  return {
    ok: true,
    url: res.url,
    host,
    scannedAt: new Date().toISOString(),
    scores: { ...scores, overall },
    grade,
    facts: {
      status: res.status,
      ttfbMs: res.ttfbMs,
      htmlKB,
      transferKB: Math.round(res.transferBytes / 1024),
      compressed,
      https: isHttps,
      redirects: hops.length,
      certDaysLeft,
      certIssuer: res.tls?.issuer ?? null,
      tlsProtocol: res.tls?.protocol ?? null,
      server: server ?? null,
    },
    findings,
    lighthouse: lighthouse === null ? null : { performance: lighthouse },
  };
}
