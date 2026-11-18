// مخزن مفتاح/قيمة مشترك عبر Upstash Redis (REST)، بدون مكتبة إضافية.
// على Vercel: أضف تكامل Upstash من Marketplace فتُضبط KV_REST_API_URL و KV_REST_API_TOKEN تلقائياً.
// بدون هذه المتغيرات يعمل الموقع بذاكرة الخادم (مناسب للتطوير المحلي فقط).
import "server-only";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvEnabled = Boolean(url && token);

type RedisValue = string | number | null | RedisValue[];

/** ينفّذ أمر Redis واحداً. يرمي خطأ إن لم يكن المخزن مضبوطاً أو فشل الطلب. */
export async function redis<T = RedisValue>(...command: (string | number)[]): Promise<T> {
  if (!kvEnabled) throw new Error("kv_not_configured");
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`kv_http_${res.status}`);
  const data = (await res.json()) as { result?: T; error?: string };
  if (data.error) throw new Error(`kv_error: ${data.error}`);
  return data.result as T;
}
