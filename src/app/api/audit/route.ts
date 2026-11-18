import { NextResponse } from "next/server";
import { runAudit } from "@/lib/audit/run";
import { AuditError, type AuditErrorCode, type AuditFailure, type AuditReport } from "@/lib/audit/types";

export const dynamic = "force-dynamic";
export const maxDuration = 45;

// حدّ الطلبات والتخزين المؤقت في ذاكرة الخادم. كافٍ لخادم واحد؛
// على استضافة serverless يُستبدل بمخزن مشترك قبل الإطلاق (المرحلة 5 من الخطة).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_SCANS_PER_WINDOW = 8;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 500;

const hits = new Map<string, number[]>();
const cache = new Map<string, { at: number; report: AuditReport }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function allow(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_SCANS_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  if (hits.size >= MAX_ENTRIES) hits.clear();
  hits.set(key, recent);
  return true;
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
  if (!target) return failure("invalid_url");

  const now = Date.now();
  const cacheKey = target.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const cached = cache.get(cacheKey);
  if (cached && now - cached.at < CACHE_TTL_MS) return NextResponse.json(cached.report);

  // في التطوير المحلي كل الطلبات من عنوان واحد، فالحدّ يعطّل التجربة بلا فائدة.
  const limited = process.env.NODE_ENV === "production" && !allow(clientKey(request), now);
  if (limited) return failure("rate_limited");

  try {
    const report = await runAudit(target);
    if (cache.size >= MAX_ENTRIES) cache.clear();
    cache.set(cacheKey, { at: now, report });
    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof AuditError) return failure(err.code);
    console.error("[audit] unexpected failure", err);
    return failure("server_error");
  }
}
