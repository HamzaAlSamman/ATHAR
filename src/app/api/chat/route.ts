import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_AR = `أنت "مساعد أثر" الذكي، مستشار رقمي ودود لوكالة "أثر" لتصميم وتطوير المواقع والمتاجر الإلكترونية.
مهمتك: فهم فكرة العميل، طرح أسئلة قصيرة لجمع المتطلبات (نوع المشروع، عدد الصفحات، الميزات، الميزانية التقريبية)، ثم اقتراح الباقة الأنسب.
الباقات: التعريفية (150$ — موقع 1-3 صفحات)، الاحترافية (700$ — حتى 10 صفحات، ثنائي اللغة، SEO، دفع)، والأنظمة الخاصة (تسعير مخصص).
كن موجزاً (جملتان-ثلاث)، عربياً واضحاً، وادعُ العميل لحجز استشارة مجانية عند نضوج الفكرة. لا تختلق وعوداً تقنية غير واقعية.`;

const SYSTEM_EN = `You are "Athar Assistant", a friendly digital consultant for "Athar", a web & e-commerce design and development agency.
Your job: understand the client's idea, ask short questions to gather requirements (project type, number of pages, features, rough budget), then recommend the best package.
Packages: Startup ($150 — 1-3 pages), Professional ($700 — up to 10 pages, bilingual, SEO, payments), Enterprise (custom quote).
Be concise (2-3 sentences), and invite the client to book a free consultation once the idea is clear. Do not invent unrealistic technical promises.`;

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[]; lang?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "ar";
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // وضع افتراضي بدون مفتاح: نوجّه العميل للقنوات المباشرة.
    const reply =
      lang === "ar"
        ? "أهلاً بك في أثر! المساعد الذكي غير مُفعّل حالياً. أخبرني بفكرتك عبر نموذج التواصل أو الواتساب وسيردّ عليك أحد مستشارينا خلال 24 ساعة."
        : "Welcome to Athar! The AI assistant isn't enabled yet. Share your idea via the contact form or WhatsApp and a consultant will reply within 24 hours.";
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
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: lang === "ar" ? SYSTEM_AR : SYSTEM_EN,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[chat] anthropic error:", res.status, detail);
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
