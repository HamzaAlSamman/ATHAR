import { NextResponse } from "next/server";
import { addLead, type Lead } from "@/lib/store";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  details?: string;
  source?: string;
  lang?: string;
}

// إرسال بريد عبر Resend إن توفّر المفتاح، وإلا نتجاهل بهدوء (الطلب محفوظ محلياً على أي حال).
async function sendEmail(lead: Lead): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from = process.env.RESEND_FROM || "Athar <onboarding@resend.dev>";
  const html = `
    <h2>طلب جديد من موقع أثر</h2>
    <ul>
      <li><b>الاسم:</b> ${lead.name}</li>
      <li><b>البريد:</b> ${lead.email || "-"}</li>
      <li><b>الجوال:</b> ${lead.phone}</li>
      <li><b>نوع المشروع:</b> ${lead.projectType}</li>
      <li><b>المصدر:</b> ${lead.source}</li>
    </ul>
    <p><b>التفاصيل:</b><br/>${(lead.details || "-").replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [siteConfig.contactEmail],
        reply_to: lead.email || undefined,
        subject: `طلب جديد: ${lead.name} — ${lead.projectType}`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone,
    email: (body.email || "").trim(),
    projectType: (body.projectType || "web").trim(),
    details: (body.details || "").trim(),
    source: (body.source || "contact-form").trim(),
    lang: body.lang === "en" ? "en" : "ar",
    createdAt: new Date().toISOString(),
  };

  let stored = true;
  try {
    await addLead(lead);
  } catch (err) {
    // على بيئات الملفات للقراءة فقط، نكتفي بالتسجيل حتى لا يفشل الطلب على المستخدم.
    stored = false;
    console.error("[contact] failed to persist lead:", err);
  }

  const emailed = await sendEmail(lead);

  if (!stored && !emailed) {
    console.warn("[contact] lead received but neither stored nor emailed:", lead);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
