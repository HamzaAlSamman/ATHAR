import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { carePlan, fixPackages } from "@/content/packages";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// الأسعار تُقرأ من مصدرها الوحيد حتى لا يقترح المساعد أرقاماً قديمة.
const priceList = (lang: "ar" | "en") =>
  [...fixPackages, carePlan]
    .map((p) => `${p.title[lang]}: ${p.price}$${p.monthly ? (lang === "ar" ? " شهرياً" : "/month") : ""}`)
    .join("، ");

const SYSTEM_AR = () => `أنت "مساعد أثر"، مستشار ودود لوكالة "أثر" لتطوير المواقع والمتاجر.
الخدمة الأساسية: فحص مجاني للموقع على /ar/tech-lab يعطي درجة من A إلى F، ثم إصلاح بسعر ثابت.
باقات الإصلاح: ${priceList("ar")}.
باقات البناء: موقع تعريفي 1-3 صفحات (150$)، احترافي حتى 10 صفحات مع ثنائية اللغة والسيو والدفع (700$)، أنظمة خاصة (تسعير مخصص).
إن كان لدى الزائر موقع فوجّهه أولاً للفحص المجاني. كن موجزاً (2-3 جمل). لا تعد بنتائج أو مواعيد غير المذكورة هنا.`;

const SYSTEM_EN = () => `You are "ATHR Assistant", a friendly consultant for ATHR, a web and e-commerce agency.
Core offer: a free website audit at /en/tech-lab that grades a site A to F, then fixes at a fixed price.
Fix packages: ${priceList("en")}.
Build packages: starter site 1-3 pages ($150), professional up to 10 pages with bilingual, SEO and payments ($700), custom systems (quoted).
If the visitor has a site, point them to the free audit first. Be concise (2-3 sentences). Do not promise results or timelines not stated here.`;

const MAX_MESSAGES = 10;
const MAX_CHARS = 1200;

export async function POST(request: Request) {
  // كل رسالة تكلّف مالاً عند مزود الذكاء الاصطناعي: حدّ لكل زائر يمنع استنزاف الرصيد.
  const limit = await rateLimit("chat", clientIp(request), 20, 60 * 60);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "ar";
  const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m): m is ChatMessage =>
        Boolean(m) &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string" &&
        (m as ChatMessage).content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  // واجهة Anthropic تشترط أن تبدأ المحادثة برسالة من المستخدم.
  while (messages.length > 0 && messages[0].role !== "user") messages.shift();
  if (messages.length === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const reply =
      lang === "ar"
        ? "المساعد الذكي غير مفعّل حالياً. جرّب الفحص المجاني لموقعك، أو أرسل طلبك عبر نموذج التواصل ونرد خلال يوم عمل."
        : "The AI assistant isn't enabled yet. Try the free audit for your site, or send your request through the contact form and we reply within one business day.";
    return NextResponse.json({ ok: true, reply, fallback: true });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
        max_tokens: 400,
        system: lang === "ar" ? SYSTEM_AR() : SYSTEM_EN(),
        messages,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    if (!res.ok) {
      console.error("[chat] anthropic error:", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "upstream_error" }, { status: 502 });
    }

    const data = await res.json();
    const reply =
      data?.content?.map((b: { text?: string }) => b.text || "").join("").trim() ||
      (lang === "ar" ? "عذراً، لم أفهم. هل يمكنك التوضيح؟" : "Sorry, could you clarify?");
    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("[chat] exception:", err);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 500 });
  }
}
