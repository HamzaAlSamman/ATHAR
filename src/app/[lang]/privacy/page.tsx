import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";
import { isLocale, pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/privacy", {
    ar: { title: "سياسة الخصوصية | أثر", description: "ما البيانات التي تجمعها أثر، ولماذا، وكم نحتفظ بها، وكيف تطلب حذفها." },
    en: { title: "Privacy policy | ATHR", description: "What data ATHR collects, why, how long we keep it, and how to ask for deletion." },
  });
}

const CONTENT: Record<"ar" | "en", { title: string; updated: string; intro: string; sections: LegalSection[] }> = {
  ar: {
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 18 نوفمبر 2026",
    intro: "نجمع أقل قدر ممكن من البيانات، ولا نبيعها ولا نشاركها لأغراض إعلانية.",
    sections: [
      {
        title: "نموذج التواصل",
        body: [
          "حين ترسل طلباً نحفظ الاسم ورقم الجوال والبريد الإلكتروني (إن كتبته) وتفاصيل الطلب، لنتمكن من الرد عليك وتقديم عرض السعر.",
          "نحتفظ بهذه البيانات مدة لا تتجاوز سنتين من آخر تواصل، ثم نحذفها، إلا إذا أصبحت عميلاً فنحتفظ بما يلزم للعقد والفواتير.",
        ],
      },
      {
        title: "أداة فحص المواقع",
        body: [
          "حين تفحص موقعاً نرسل طلباً عادياً إلى ذلك الموقع ونقرأ ما يعلنه للعموم فقط: الصفحة الرئيسية، الترويسات، شهادة التشفير، وسجلات DNS. لا نجرّب أي ثغرات ولا نغيّر شيئاً.",
          "نحتفظ بنتيجة الفحص في ذاكرة الخادم مؤقتاً (حتى 10 دقائق) لتسريع إعادة فتح رابط التقرير، ونستخدم عنوان IP الخاص بك مؤقتاً لتحديد عدد الفحوصات ومنع إساءة الاستخدام.",
        ],
      },
      {
        title: "التحليلات وملفات تعريف الارتباط",
        body: [
          "نستخدم Vercel Web Analytics لقياس عدد الزيارات والصفحات الأكثر استخداماً بشكل إجمالي. لا يستخدم ملفات تعريف ارتباط ولا يتتبعك بين المواقع.",
          "نحفظ ملف تعريف ارتباط واحداً (athar_lang) يتذكر لغتك المفضلة فقط.",
        ],
      },
      {
        title: "المساعد الذكي",
        body: [
          "إن استخدمت المحادثة في الموقع تُرسل رسائلك إلى مزود الذكاء الاصطناعي (Anthropic) لتوليد الرد، ولا نستخدمها لأي غرض آخر. لا تكتب فيها بيانات حساسة.",
        ],
      },
      {
        title: "حقوقك",
        body: [
          `يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذفها بمراسلتنا على ${siteConfig.contactEmail}، ونرد خلال 30 يوماً.`,
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "Last updated: 18 November 2026",
    intro: "We collect as little data as possible, and we never sell it or share it for advertising.",
    sections: [
      {
        title: "Contact form",
        body: [
          "When you send a request we store your name, phone number, email (if given) and request details so we can reply and send a quote.",
          "We keep this for no more than two years after our last contact, then delete it, unless you become a client, in which case we keep what the contract and invoices require.",
        ],
      },
      {
        title: "Website audit tool",
        body: [
          "When you audit a site we send a normal request to it and read only what it publishes: the home page, headers, TLS certificate and DNS records. We do not probe for vulnerabilities or change anything.",
          "We keep the result in server memory briefly (up to 10 minutes) so shared report links open quickly, and use your IP address temporarily to limit scans and prevent abuse.",
        ],
      },
      {
        title: "Analytics and cookies",
        body: [
          "We use Vercel Web Analytics to count visits and popular pages in aggregate. It sets no cookies and does not track you across sites.",
          "We set one cookie (athar_lang) that only remembers your language.",
        ],
      },
      {
        title: "AI assistant",
        body: [
          "If you use the chat, your messages are sent to our AI provider (Anthropic) to generate replies and are used for nothing else. Do not share sensitive data in it.",
        ],
      },
      {
        title: "Your rights",
        body: [
          `You can ask for a copy of your data, a correction or deletion by writing to ${siteConfig.contactEmail}. We reply within 30 days.`,
        ],
      },
    ],
  },
};

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage {...CONTENT[lang]} />;
}
