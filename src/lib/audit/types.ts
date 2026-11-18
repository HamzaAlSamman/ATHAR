// أنواع تقرير الفحص — مشتركة بين الخادم (المحرّك) والواجهة.

export type AuditCategory = "performance" | "security" | "seo";

// pass: سليم · warn: يحتاج تحسيناً · fail: مشكلة مؤثرة
export type FindingStatus = "pass" | "warn" | "fail";

export interface Finding {
  id: string;
  category: AuditCategory;
  status: FindingStatus;
  /** وزن الفحص داخل فئته عند حساب الدرجة. */
  weight: number;
  /** قيم مقاسة تُحقن في نص الشرح (مثل {ms} أو {count}). */
  data?: Record<string, string | number>;
}

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface AuditFacts {
  status: number;
  ttfbMs: number;
  htmlKB: number;
  transferKB: number;
  compressed: boolean;
  https: boolean;
  redirects: number;
  certDaysLeft: number | null;
  certIssuer: string | null;
  tlsProtocol: string | null;
  server: string | null;
}

export interface AuditReport {
  ok: true;
  /** الرابط النهائي بعد التحويلات. */
  url: string;
  host: string;
  scannedAt: string;
  scores: Record<AuditCategory, number> & { overall: number };
  grade: Grade;
  facts: AuditFacts;
  findings: Finding[];
  /** نتيجة Lighthouse إن توفّر مفتاح PageSpeed. */
  lighthouse: { performance: number } | null;
}

export type AuditErrorCode =
  | "invalid_url"
  | "blocked_host"
  | "dns_failed"
  | "unreachable"
  | "timeout"
  | "blocked_by_site"
  | "rate_limited"
  | "server_error";

export interface AuditFailure {
  ok: false;
  error: AuditErrorCode;
}

export class AuditError extends Error {
  code: AuditErrorCode;
  constructor(code: AuditErrorCode) {
    super(code);
    this.code = code;
    this.name = "AuditError";
  }
}
