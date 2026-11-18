// جلسة لوحة التحكم: الكوكي يحمل رمزاً موقّعاً (HMAC) بتاريخ انتهاء، وليس كلمة المرور نفسها.
import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "athar_admin";
export const SESSION_SECONDS = 60 * 60 * 8;

function secret(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  // تغيير كلمة المرور يُبطل كل الجلسات القائمة تلقائياً.
  return process.env.ADMIN_SESSION_SECRET || `athar-admin:${password}`;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** مقارنة كلمة المرور بزمن ثابت حتى لا يكشف التوقيت عدد الأحرف الصحيحة. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const key = "athar-password-compare";
  return safeEqual(sign(input, key), sign(expected, key));
}

export function createSessionToken(): string | null {
  const key = secret();
  if (!key) return null;
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires, key)}`;
}

export async function isAdmin(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, sign(expires, key));
}
