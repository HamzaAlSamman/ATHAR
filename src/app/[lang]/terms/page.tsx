import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";
import { isLocale, pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/terms", {
    ar: { title: "الشروط والأحكام | أثر", description: "شروط استخدام أداة الفحص المجانية وطلب خدمات أثر." },
    en: { title: "Terms of service | ATHR", description: "Terms for using the free audit tool and ordering ATHR services." },
  });
}

const CONTENT: Record<"ar" | "en", { title: string; updated: string; intro: string; sections: LegalSection[] }> = {
  ar: {
    title: "الشروط والأحكام",
    updated: "آخر تحديث: 18 نوفمبر 2026",
    intro: "باستخدامك لهذا الموقع أو أداة الفحص فيه، فأنت توافق على هذه الشروط.",
    sections: [
      {
        title: "أداة الفحص",
        body: [
          "الفحص مجاني وللاستخدام المعقول. افحص المواقع التي تملكها أو التي لديك مصلحة مشروعة في معرفة حالتها.",
          "يُمنع استخدام الأداة بشكل آلي أو بكثافة تضر بالمواقع المفحوصة أو بخدمتنا، ولنا أن نوقف الوصول عند الإساءة.",
          "النتائج إرشادية وتعكس حالة الموقع لحظة الفحص من خوادمنا، ولا تُعد ضماناً بخلو الموقع من الثغرات أو المشاكل.",
        ],
      },
      {
        title: "الأسعار والطلبات",
        body: [
          "الأسعار المعلنة لموقع واحد بحدود ما هو موضّح في كل باقة. نؤكد السعر النهائي والمدة كتابياً قبل بدء العمل، ولا يتغيّر السعر بعد التأكيد إلا إذا تغيّر نطاق العمل باتفاق الطرفين.",
          "يبدأ العمل بعد تأكيد الطلب وتوفير صلاحيات الوصول اللازمة إلى الموقع أو الاستضافة.",
          "اشتراك الرعاية الشهري يُجدَّد شهرياً ويمكن إلغاؤه في أي وقت، ويسري الإلغاء من نهاية الشهر المدفوع.",
        ],
      },
      {
        title: "الملكية",
        body: [
          "الكود والتصاميم التي ننفّذها لك تصبح ملكك بالكامل بعد سداد قيمتها.",
          "محتوى هذا الموقع وأداة الفحص ملك لأثر، ولا يجوز نسخهما لإنشاء خدمة منافسة.",
        ],
      },
      {
        title: "التواصل",
        body: [`لأي سؤال عن هذه الشروط راسلنا على ${siteConfig.contactEmail}.`],
      },
    ],
  },
  en: {
    title: "Terms of service",
    updated: "Last updated: 18 November 2026",
    intro: "By using this website or its audit tool, you agree to these terms.",
    sections: [
      {
        title: "Audit tool",
        body: [
          "The audit is free for reasonable use. Scan sites you own or have a legitimate interest in checking.",
          "Automated or heavy use that harms scanned sites or our service is not allowed, and we may block access on abuse.",
          "Results are guidance reflecting the site at the moment it was scanned from our servers. They are not a guarantee that a site is free of vulnerabilities or problems.",
        ],
      },
      {
        title: "Prices and orders",
        body: [
          "Published prices are for one website within the scope described in each package. We confirm the final price and timeline in writing before work starts, and the price does not change after confirmation unless the scope changes by mutual agreement.",
          "Work starts once the order is confirmed and we have the access needed to the site or hosting.",
          "The monthly care plan renews monthly and can be cancelled at any time, effective at the end of the paid month.",
        ],
      },
      {
        title: "Ownership",
        body: [
          "Code and designs we deliver become fully yours once paid for.",
          "The content of this website and the audit tool belong to ATHR and may not be copied to build a competing service.",
        ],
      },
      {
        title: "Contact",
        body: [`For any question about these terms, write to ${siteConfig.contactEmail}.`],
      },
    ],
  },
};

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage {...CONTENT[lang]} />;
}
