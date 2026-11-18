// حدّ طلبات بنافذة زمنية ثابتة. يستعمل Redis المشترك إن وُجد (ضروري على serverless حيث
// لكل نسخة ذاكرتها الخاصة)، وإلا ذاكرة الخادم.
import "server-only";
import { kvEnabled, redis } from "./kv";

const memory = new Map<string, { count: number; resetAt: number }>();
const MAX_MEMORY_KEYS = 5000;

export interface LimitResult {
  ok: boolean;
  remaining: number;
}

/**
 * @param bucket اسم الحدّ (مثل "audit") حتى لا تتشارك الأدوات العدّاد نفسه.
 * @param id معرّف الزائر (عادة عنوان IP).
 */
export async function rateLimit(bucket: string, id: string, limit: number, windowSec: number): Promise<LimitResult> {
  const key = `rl:${bucket}:${id}`;

  if (kvEnabled) {
    try {
      const count = await redis<number>("INCR", key);
      if (count === 1) await redis("EXPIRE", key, windowSec);
      return { ok: count <= limit, remaining: Math.max(0, limit - count) };
    } catch (err) {
      // تعطّل المخزن لا يجب أن يوقف الموقع: نكمل بالذاكرة.
      console.error("[rate-limit] kv failed, using memory", err);
    }
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    if (memory.size >= MAX_MEMORY_KEYS) memory.clear();
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { ok: true, remaining: limit - 1 };
  }
  entry.count++;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

/** عنوان الزائر كما تمرّره منصة الاستضافة. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
