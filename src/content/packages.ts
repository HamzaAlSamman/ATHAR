// باقات الإصلاح بسعر ثابت + اشتراك الرعاية الشهري.
// مصدر الحقيقة للأسعار: غيّر الأرقام هنا فقط، وتتحدّث صفحة الأسعار والتقرير ونموذج التواصل معاً.
import type { AuditCategory } from "@/lib/audit/types";
import type { Locale } from "@/lib/config";

export const CURRENCY: Record<Locale, string> = { ar: "دولار", en: "USD" };

export type PackageId = "speed" | "security" | "seo" | "complete" | "care";

export interface FixPackage {
  id: PackageId;
  /** السعر بالدولار. للاشتراك: سعر الشهر. */
  price: number;
  monthly?: boolean;
  /** الفئات التي يعالجها: يستعملها التقرير لاقتراح الباقة المناسبة. */
  covers: AuditCategory[];
  featured?: boolean;
  /** مدة التسليم بأيام العمل. */
  days?: number;
  title: Record<Locale, string>;
  pitch: Record<Locale, string>;
  includes: Record<Locale, string[]>;
}

export const fixPackages: FixPackage[] = [
  {
    id: "speed",
    price: 149,
    days: 5,
    covers: ["performance"],
    title: { ar: "تسريع الموقع", en: "Speed fix" },
    pitch: {
      ar: "لموقع بطيء يخسر زواره قبل أن تظهر الصفحة.",
      en: "For a slow site that loses visitors before the page appears.",
    },
    includes: {
      ar: [
        "ضغط الصور وتحويلها لصيغ حديثة",
        "تأخير السكربتات التي تعطّل العرض",
        "تفعيل الضغط والتخزين المؤقت",
        "تقرير قبل وبعد بالأرقام",
      ],
      en: [
        "Image compression and modern formats",
        "Defer render-blocking scripts",
        "Enable compression and caching",
        "Before/after report with numbers",
      ],
    },
  },
  {
    id: "security",
    price: 99,
    days: 3,
    covers: ["security"],
    title: { ar: "تأمين الموقع", en: "Security hardening" },
    pitch: {
      ar: "لإغلاق الثغرات الظاهرة قبل أن يستغلها أحد.",
      en: "Close the visible gaps before someone exploits them.",
    },
    includes: {
      ar: [
        "ترويسات الأمان كاملة (HSTS، CSP وغيرها)",
        "إصلاح الشهادة والتحويل إلى HTTPS",
        "حماية ملفات تعريف الارتباط",
        "سجلات SPF و DMARC ضد انتحال بريدك",
      ],
      en: [
        "Full security headers (HSTS, CSP and more)",
        "Certificate and HTTPS redirect fixes",
        "Cookie protection flags",
        "SPF and DMARC records against email spoofing",
      ],
    },
  },
  {
    id: "seo",
    price: 99,
    days: 3,
    covers: ["seo"],
    title: { ar: "تهيئة السيو التقني", en: "Technical SEO setup" },
    pitch: {
      ar: "ليفهم غوغل موقعك ويعرضه بشكل جذاب في النتائج.",
      en: "So Google understands your site and shows it well in results.",
    },
    includes: {
      ar: [
        "العناوين والأوصاف لكل الصفحات الرئيسية",
        "خريطة الموقع و robots.txt",
        "البيانات المنظمة وصورة المشاركة",
        "ربط Google Search Console",
      ],
      en: [
        "Titles and descriptions for key pages",
        "Sitemap and robots.txt",
        "Structured data and share image",
        "Google Search Console setup",
      ],
    },
  },
  {
    id: "complete",
    price: 249,
    days: 7,
    featured: true,
    covers: ["performance", "security", "seo"],
    title: { ar: "الإصلاح الشامل", en: "Complete fix" },
    pitch: {
      ar: "الباقات الثلاث معاً، وتوفير 98 دولاراً.",
      en: "All three packages together, saving $98.",
    },
    includes: {
      ar: [
        "كل ما في باقات السرعة والأمان والسيو",
        "إعادة فحص بعد التسليم حتى الوصول لدرجة A أو B",
        "شهر رعاية مجاني بعد التسليم",
      ],
      en: [
        "Everything in the speed, security and SEO packages",
        "Re-audit after delivery until the site reaches grade A or B",
        "One free month of care after delivery",
      ],
    },
  },
];

export const carePlan: FixPackage = {
  id: "care",
  price: 29,
  monthly: true,
  covers: ["performance", "security", "seo"],
  title: { ar: "اشتراك الرعاية الشهري", en: "Monthly care plan" },
  pitch: {
    ar: "نراقب موقعك وننبهك قبل أن تتحول المشكلة إلى خسارة.",
    en: "We watch your site and alert you before a problem turns into lost sales.",
  },
  includes: {
    ar: [
      "فحص أسبوعي وتقرير شهري",
      "تنبيه فوري إذا توقف الموقع أو قاربت الشهادة على الانتهاء",
      "تحديثات وإصلاحات صغيرة حتى ساعتين شهرياً",
      "إلغاء في أي وقت",
    ],
    en: [
      "Weekly audit and monthly report",
      "Instant alert if the site goes down or the certificate nears expiry",
      "Updates and small fixes, up to two hours a month",
      "Cancel any time",
    ],
  },
};

export const allPackages: FixPackage[] = [...fixPackages, carePlan];

export function getPackage(id: string | null | undefined): FixPackage | undefined {
  return allPackages.find((p) => p.id === id);
}

/**
 * يقترح باقة حسب نتيجة الفحص: فئة واحدة ضعيفة → باقتها، أكثر من فئة → الشامل، لا شيء → الرعاية.
 * "ضعيفة" = درجة أقل من 80.
 */
export function suggestPackage(scores: Record<AuditCategory, number>): FixPackage {
  const weak = (Object.keys(scores) as AuditCategory[]).filter((c) => scores[c] < 80);
  if (weak.length === 0) return carePlan;
  if (weak.length > 1) return fixPackages.find((p) => p.id === "complete")!;
  const map: Record<AuditCategory, PackageId> = { performance: "speed", security: "security", seo: "seo" };
  return fixPackages.find((p) => p.id === map[weak[0]])!;
}

export function formatPrice(pkg: FixPackage, lang: Locale): string {
  const amount = lang === "ar" ? `${pkg.price} ${CURRENCY.ar}` : `$${pkg.price}`;
  if (!pkg.monthly) return amount;
  return lang === "ar" ? `${amount} / شهرياً` : `${amount} / month`;
}

// أسعار حاسبة البناء (بالدولار)، متسقة مع باقات البناء في صفحة الأسعار:
// موقع تعريفي حتى 3 صفحات = 150، والباقة الاحترافية (متجر/موقع حتى 10 صفحات مع كل الإضافات) = 700.
export const buildRates = {
  base: { web: 150, store: 350 },
  includedPages: 3,
  extraPage: 25,
  seo: 99,
  bilingual: 80,
  payments: 120,
  blog: 90,
} as const;
