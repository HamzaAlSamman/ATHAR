import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// فحص أداء حقيقي عبر Google PageSpeed Insights. يتطلب PAGESPEED_API_KEY.
// يعيد 4 مقاييس (0-100): الأداء، السيو، أفضل الممارسات، إتاحة الوصول.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let target = (searchParams.get("url") || "").trim();
  if (!target) {
    return NextResponse.json({ ok: false, error: "missing_url" }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    // لا مفتاح متاح — نُعلم العميل ليستخدم وضع المحاكاة.
    return NextResponse.json({ ok: false, error: "no_api_key", simulated: true }, { status: 503 });
  }

  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("strategy", "mobile");
  for (const c of ["performance", "seo", "best-practices", "accessibility"]) {
    endpoint.searchParams.append("category", c);
  }

  try {
    const res = await fetch(endpoint.toString(), { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "psi_failed", simulated: true }, { status: 502 });
    }
    const data = await res.json();
    const cats = data?.lighthouseResult?.categories || {};
    const score = (key: string) =>
      typeof cats[key]?.score === "number" ? Math.round(cats[key].score * 100) : null;

    return NextResponse.json({
      ok: true,
      url: target,
      scores: {
        performance: score("performance"),
        seo: score("seo"),
        bestPractices: score("best-practices"),
        accessibility: score("accessibility"),
      },
    });
  } catch (err) {
    console.error("[pagespeed] error:", err);
    return NextResponse.json({ ok: false, error: "exception", simulated: true }, { status: 500 });
  }
}
