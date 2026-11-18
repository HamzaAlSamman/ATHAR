import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, SESSION_SECONDS, createSessionToken, passwordMatches } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  // 5 محاولات كل 15 دقيقة لكل عنوان: يوقف تخمين كلمة المرور.
  const limit = await rateLimit("admin-login", clientIp(request), 5, 15 * 60);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  if (!passwordMatches(password)) {
    return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
