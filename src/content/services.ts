// خدمات البرمجة الأربع: مصدر واحد للصفحة الرئيسية وصفحة الخدمات ونموذج التواصل والمساعد.
import type { Locale } from "@/lib/config";

export type ServiceId = "web" | "webapp" | "mobile" | "automation";

export interface Service {
  id: ServiceId;
  title: Record<Locale, string>;
  /** سطر واحد للبطاقات. */
  short: Record<Locale, string>;
  /** فقرة لصفحة الخدمات. */
  long: Record<Locale, string>;
  /** أمثلة ملموسة لما يمكن بناؤه: تساعد الزائر أن يرى مشروعه فيها. */
  examples: Record<Locale, string[]>;
  includes: Record<Locale, string[]>;
  tech: string[];
  /** سعر البداية بالدولار إن كان معلناً؛ غير ذلك سعر ثابت بعد تحديد النطاق. */
  from?: number;
}

export const services: Service[] = [
  {
    id: "web",
    from: 150,
    title: { ar: "مواقع ومتاجر إلكترونية", en: "Websites & online stores" },
    short: {
      ar: "مواقع شركات ومتاجر سريعة، مبرمجة من الصفر بدون قوالب جاهزة.",
      en: "Fast company sites and stores, coded from scratch with no templates.",
    },
    long: {
      ar: "نبرمج مواقع الشركات والمتاجر الإلكترونية من الصفر، بلغتين، مع لوحة تحكم سهلة وربط بوابات الدفع والشحن. كل موقع نسلّمه يمر بنفس الفحص الذي تراه في مختبرنا.",
      en: "We code company websites and online stores from scratch, bilingual, with an easy admin panel and payment and shipping integrations. Every site we ship passes the same audit you can run in our lab.",
    },
    examples: {
      ar: ["موقع شركة أو عيادة أو مكتب", "متجر إلكتروني بمدفوعات وشحن", "صفحة هبوط لإطلاق منتج"],
      en: ["Company, clinic or office website", "Online store with payments and shipping", "Landing page for a product launch"],
    },
    includes: {
      ar: ["تصميم خاص بهويتك", "عربي وإنجليزي", "لوحة تحكم بالمحتوى", "ربط الدفع والشحن", "سرعة وأمان وسيو جاهزين من اليوم الأول"],
      en: ["Design built around your brand", "Arabic and English", "Content admin panel", "Payment and shipping integration", "Speed, security and SEO ready from day one"],
    },
    tech: ["Next.js", "React", "TypeScript", "Shopify", "Salla", "Stripe"],
  },
  {
    id: "webapp",
    title: { ar: "تطبيقات ويب وأنظمة إدارة", en: "Web apps & business systems" },
    short: {
      ar: "أنظمة تدير شغلك: حجوزات، زبائن، مخزون، لوحات تحكم ومنصات اشتراك.",
      en: "Systems that run your business: bookings, customers, inventory, dashboards and subscription platforms.",
    },
    long: {
      ar: "إذا كان شغلك يعتمد على جداول إكسل ورسائل واتساب، نبني لك نظاماً واحداً يجمعه: حسابات مستخدمين بصلاحيات، قاعدة بيانات، تقارير، وربط مع الأدوات التي تستخدمها.",
      en: "If your business runs on spreadsheets and WhatsApp threads, we build one system that brings it together: user accounts with roles, a database, reports, and links to the tools you already use.",
    },
    examples: {
      ar: ["نظام حجوزات ومواعيد", "إدارة زبائن ومبيعات (CRM)", "إدارة مخزون وفواتير", "منصة باشتراك شهري (SaaS)"],
      en: ["Booking and appointment system", "Customer and sales management (CRM)", "Inventory and invoicing", "Subscription platform (SaaS)"],
    },
    includes: {
      ar: ["تحليل سير العمل قبل البرمجة", "حسابات وصلاحيات", "قاعدة بيانات ونسخ احتياطي", "لوحة تقارير", "تدريب فريقك"],
      en: ["Workflow analysis before coding", "Accounts and permissions", "Database with backups", "Reporting dashboard", "Team training"],
    },
    tech: ["Next.js", "Node.js", "PostgreSQL", "Supabase", "TypeScript"],
  },
  {
    id: "mobile",
    title: { ar: "تطبيقات جوال", en: "Mobile apps" },
    short: {
      ar: "تطبيق واحد يعمل على آيفون وأندرويد، ومنشور على المتجرين.",
      en: "One app for iPhone and Android, published on both stores.",
    },
    long: {
      ar: "نبرمج تطبيقات جوال لآيفون وأندرويد من كود واحد، ونتولى النشر على App Store و Google Play، مع لوحة تحكم ويب لإدارة المحتوى والمستخدمين.",
      en: "We build iPhone and Android apps from one codebase, handle publishing on the App Store and Google Play, and add a web admin to manage content and users.",
    },
    examples: {
      ar: ["تطبيق لمتجرك أو مطعمك", "تطبيق حجز وخدمات", "تطبيق ولاء ونقاط للزبائن"],
      en: ["App for your store or restaurant", "Booking and services app", "Customer loyalty and points app"],
    },
    includes: {
      ar: ["آيفون وأندرويد", "إشعارات فورية", "تسجيل دخول ودفع داخل التطبيق", "النشر على المتجرين", "لوحة تحكم ويب"],
      en: ["iPhone and Android", "Push notifications", "Sign-in and in-app payments", "Publishing on both stores", "Web admin panel"],
    },
    tech: ["Flutter", "React Native", "Firebase", "Supabase"],
  },
  {
    id: "automation",
    title: { ar: "ربط وأتمتة وذكاء اصطناعي", en: "Integrations, automation & AI" },
    short: {
      ar: "نربط أنظمتك ببعضها، ونؤتمت الشغل المتكرر، ونضيف مساعدات ذكية.",
      en: "We connect your systems, automate repetitive work and add AI assistants.",
    },
    long: {
      ar: "شغل يتكرر كل يوم بين الإيميل والواتساب والجداول يمكن أن يتم وحده. نربط الأنظمة عبر APIs، ونبني مساعدات ذكية ترد على زبائنك وتفهم مستنداتك.",
      en: "Work that repeats every day across email, WhatsApp and spreadsheets can run on its own. We connect systems through APIs and build AI assistants that answer customers and understand your documents.",
    },
    examples: {
      ar: ["مساعد ذكي يرد على زبائنك", "ربط متجرك بالمحاسبة والشحن", "تقارير تصلك تلقائياً", "رسائل واتساب آلية"],
      en: ["AI assistant answering your customers", "Store linked to accounting and shipping", "Reports delivered automatically", "Automated WhatsApp messages"],
    },
    includes: {
      ar: ["ربط بوابات الدفع والـ APIs", "أتمتة سير العمل", "مساعد ذكي بمحتواك", "مراقبة وتنبيهات"],
      en: ["Payment gateway and API integration", "Workflow automation", "AI assistant trained on your content", "Monitoring and alerts"],
    },
    tech: ["Claude API", "Node.js", "Webhooks", "WhatsApp API", "n8n"],
  },
];

export function getService(id: string | null | undefined): Service | undefined {
  return services.find((s) => s.id === id);
}
