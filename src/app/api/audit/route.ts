import { NextResponse } from "next/server";
import { lookup } from "dns/promises";

export const dynamic = "force-dynamic";

// فحص أداء حقيقي بدون أي API: نجلب الصفحة من الخادم ونقيس مؤشرات فعلية.
// إن توفّر مفتاح Google PageSpeed نستخدمه لنتيجة Lighthouse كاملة، وإلا نعتمد الفحص الخفيف.

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

// حماية من SSRF: نمنع العناوين المحلية والشبكات الخاصة.
function isPrivateIp(ip: string): boolean {
  if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) return true;
  const m = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const [a, b] = [parseInt(m[1]), parseInt(m[2])];
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true; // link-local / metadata
  return false;
}

async function liteAudit(target: string) {
  const u = new URL(target);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("bad_protocol");
  }
  if (u.hostname === "localhost") throw new Error("blocked_host");
  const resolved = await lookup(u.hostname);
  if (isPrivateIp(resolved.address)) throw new Error("blocked_host");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  const start = Date.now();
  const res = await fetch(target, {
    signal: controller.signal,
    redirect: "follow",
    headers: { "User-Agent": "AtharLab/1.0 (+performance audit)" },
  });
  const ttfb = Date.now() - start; // زمن وصول الترويسات (تقريب واقعي لـ TTFB)
  const html = (await res.text()).slice(0, 2_000_000); // حد أقصى للقراءة
  clearTimeout(timer);

  const h = res.headers;
  const sizeKB = Math.round((Buffer.byteLength(html, "utf-8") / 1024));
  const compressed = /gzip|br|deflate|zstd/i.test(h.get("content-encoding") || "");
  const https = u.protocol === "https:";

  // ترويسات الأمان الفعلية
  const secHeaders = [
    "strict-transport-security",
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
  ];
  const secCount = secHeaders.filter((k) => h.has(k)).length;

  // تحليل HTML بسيط
  const has = (re: RegExp) => re.test(html);
  const hasTitle = has(/<title[^>]*>\s*\S/i);
  const hasDesc = has(/<meta[^>]+name=["']description["'][^>]*content=["']\s*\S/i);
  const hasViewport = has(/<meta[^>]+name=["']viewport["']/i);
  const hasLang = has(/<html[^>]+lang=/i);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const imgWithAlt = imgTags.filter((t) => /\balt=/.test(t)).length;
  const altRatio = imgTags.length === 0 ? 1 : imgWithAlt / imgTags.length;
  const scriptCount = (html.match(/<script\b/gi) || []).length;

  // اشتقاق المؤشرات (0-100) من قياسات حقيقية
  const perfTtfb = clamp(100 - ttfb / 20); // 200ms→90، 1000ms→50
  const perfSize = clamp(100 - sizeKB / 30); // 300KB→90، 1500KB→50
  const performance = clamp(perfTtfb * 0.6 + perfSize * 0.4 - (compressed ? 0 : 15));
  const seo = clamp((Number(hasTitle) + Number(hasDesc) + Number(hasLang) + Number(h1Count > 0)) * 25);
  const ux = clamp((hasViewport ? 50 : 0) + altRatio * 50);
  const bestPractices = clamp((https ? 40 : 0) + (secCount / secHeaders.length) * 40 + (compressed ? 20 : 0));

  return {
    method: "lite" as const,
    scores: { performance, seo, accessibility: ux, bestPractices },
    details: {
      ttfbMs: ttfb,
      sizeKB,
      compressed,
      https,
      securityHeaders: secCount,
      hasTitle,
      hasDescription: hasDesc,
      hasViewport,
      hasLang,
      h1Count,
      images: imgTags.length,
      imagesWithAlt: imgWithAlt,
      scripts: scriptCount,
      status: res.status,
    },
  };
}

async function psiAudit(target: string, apiKey: string) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("strategy", "mobile");
  for (const c of ["performance", "seo", "best-practices", "accessibility"]) {
    endpoint.searchParams.append("category", c);
  }
  const res = await fetch(endpoint.toString(), { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("psi_failed");
  const data = await res.json();
  const cats = data?.lighthouseResult?.categories || {};
  const score = (key: string) =>
    typeof cats[key]?.score === "number" ? Math.round(cats[key].score * 100) : 0;
  return {
    method: "lighthouse" as const,
    scores: {
      performance: score("performance"),
      seo: score("seo"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
    },
    details: null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let target = (searchParams.get("url") || "").trim();
  if (!target) {
    return NextResponse.json({ ok: false, error: "missing_url" }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    const result = apiKey ? await psiAudit(target, apiKey) : await liteAudit(target);
    return NextResponse.json({ ok: true, url: target, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "error";
    const status = msg === "blocked_host" || msg === "bad_protocol" ? 400 : 502;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
