import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit/run";
import { AuditError, type AuditErrorCode, type AuditFailure, type AuditReport } from "@/lib/audit/types";
import { kvEnabled, redis } from "@/lib/kv";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 45;

const SCANS_PER_WINDOW = 8;
const WINDOW_SEC = 10 * 60;
const CACHE_SEC = 10 * 60;
const MAX_MEMORY_ENTRIES = 500;

// نتيجة الفحص تُخزَّن مؤقتاً: فتح رابط تقرير مشارَك لا يعيد الفحص ولا يحسب من حدّ الزائر.
const memoryCache = new Map<string, { at: number; report: AuditReport }>();

async function readCache(key: string): Promise<AuditReport | null> {
  if (kvEnabled) {
    try {
      const raw = await redis<string | null>("GET", `audit:${key}`);
      return raw ? (JSON.parse(raw) as AuditReport) : null;
    } catch (err) {
      console.error("[audit] cache read failed", err);
    }
  }
  const hit = memoryCache.get(key);
  return hit && Date.now() - hit.at < CACHE_SEC * 1000 ? hit.report : null;
}

async function writeCache(key: string, report: AuditReport): Promise<void> {
  if (kvEnabled) {
    try {
      await redis("SET", `audit:${key}`, JSON.stringify(report), "EX", CACHE_SEC);
      await redis("INCR", "stats:audits");
      return;
    } catch (err) {
      console.error("[audit] cache write failed", err);
    }
  }
  if (memoryCache.size >= MAX_MEMORY_ENTRIES) memoryCache.clear();
  memoryCache.set(key, { at: Date.now(), report });
}

const STATUS_BY_ERROR: Record<AuditErrorCode, number> = {
  invalid_url: 400,
  blocked_host: 400,
  dns_failed: 422,
  unreachable: 502,
  timeout: 504,
  blocked_by_site: 502,
  rate_limited: 429,
  server_error: 500,
};

function failure(error: AuditErrorCode) {
  return NextResponse.json<AuditFailure>({ ok: false, error }, { status: STATUS_BY_ERROR[error] });
}

export async function GET(request: Request) {
  const target = (new URL(request.url).searchParams.get("url") ?? "").trim();
  if (!target || target.length > 2000) return failure("invalid_url");

  const cacheKey = target.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const cached = await readCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  // في التطوير المحلي كل الطلبات من عنوان واحد، فالحدّ يعطّل التجربة بلا فائدة.
  if (process.env.NODE_ENV === "production") {
    const limit = await rateLimit("audit", clientIp(request), SCANS_PER_WINDOW, WINDOW_SEC);
    if (!limit.ok) return failure("rate_limited");
  }

  try {
    const report = await runAudit(target);
    await writeCache(cacheKey, report);
    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof AuditError) return failure(err.code);
    console.error("[audit] unexpected failure", err);
    return failure("server_error");
  }
}
