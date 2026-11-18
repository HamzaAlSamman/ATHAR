// تمرير سياق الطلب إلى نموذج التواصل (من التقرير أو صفحة الأسعار) عبر التخزين المحلي.
// نموذج التواصل يقرأ القيمة مرة واحدة ثم يحذفها.
export const PREFILL_KEY = "athar_prefill";

export interface ContactPrefill {
  /** الباقة المختارة، إن وُجدت. */
  packageId?: string;
  /** نتيجة الفحص، إن جاء الطلب من التقرير. */
  audit?: { host: string; grade: string; score: number; fails: number };
  /** نوع طلب صريح (web أو store) من الحاسبة أو باقات البناء. */
  requestType?: string;
  /** نص جاهز لحقل التفاصيل. */
  details?: string;
}

export function savePrefill(data: ContactPrefill): void {
  try {
    localStorage.setItem(PREFILL_KEY, JSON.stringify(data));
  } catch {
    /* التخزين غير متاح: يفتح النموذج فارغاً */
  }
}

export function takePrefill(): ContactPrefill | null {
  try {
    const raw = localStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    localStorage.removeItem(PREFILL_KEY);
    const data = JSON.parse(raw) as ContactPrefill;
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}
