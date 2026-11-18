import { NextResponse } from "next/server";
import { addLead, type Lead } from "@/lib/store";
import { siteConfig } from "@/lib/config";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const LIMITS = { name: 120, email: 160, phone: 30, projectType: 40, details: 2000, source: 60 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// كل قيمة من الزائر تُهرَّب قبل وضعها في HTML البريد: تمنع حقن روابط أو وسوم في بريدك.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM || "Athar <onboarding@resend.dev>";
  const row = (label: string, value: string) => `<li><b>${label}:</b> ${escapeHtml(value || "-")}</li>`;
  const html = `
    <h2>طلب جديد من موقع أثر</h2>
    <ul>
      ${row("الاسم", lead.name)}
      ${row("الجوال", lead.phone)}
      ${row("البريد", lead.email)}
      ${row("الطلب", lead.projectType)}
      ${row("المصدر", lead.source)}
      ${row("اللغة", lead.lang)}
    </ul>
    <p><b>التفاصيل:</b><br/>${escapeHtml(lead.details || "-").replace(/\n/g, "<br/>")}</p>
  `;
  const validReplyTo = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(lead.email) ? lead.email : undefined;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [siteConfig.contactEmail],
        reply_to: validReplyTo,
        subject: `طلب جديد: ${lead.name.replace(/[\r\n]+/g, " ")} — ${lead.projectType}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[contact] resend failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("[contact] resend exception", err);
    return false;
  }
}

export async function POST(request: Request) {
  const limit = await rateLimit("contact", clientIp(request), 5, 10 * 60);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // حقل الفخ ممتلئ = بوت. نرد بنجاح شكلي حتى لا يعرف أنه كُشف.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  const name = clean(body.name, LIMITS.name);
  const phone = clean(body.phone, LIMITS.phone);
  if (!name || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone,
    email: clean(body.email, LIMITS.email),
    projectType: clean(body.projectType, LIMITS.projectType) || "web",
    details: clean(body.details, LIMITS.details),
    source: clean(body.source, LIMITS.source) || "contact-form",
    lang: body.lang === "en" ? "en" : "ar",
    createdAt: new Date().toISOString(),
  };

  let stored = true;
  try {
    await addLead(lead);
  } catch (err) {
    stored = false;
    console.error("[contact] failed to persist lead:", err);
  }
  const emailed = await sendEmail(lead);

  // إن فشل الحفظ والبريد معاً فالطلب ضائع: نخبر الزائر ليستعمل واتساب بدل أن نوهمه بالنجاح.
  if (!stored && !emailed) {
    console.error("[contact] lead lost (not stored, not emailed):", lead.id);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, id: lead.id });
}
