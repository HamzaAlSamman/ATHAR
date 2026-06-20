// مخزن مشاريع الأعمال (ثنائي اللغة) — مصدر الحقيقة لقائمة الأعمال وصفحات دراسات الحالة والـ sitemap.

import type { Locale } from "@/lib/config";

export type ProjectCategory = "web" | "stores" | "brands";

export interface Project {
  slug: string;
  category: ProjectCategory;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  challenge: { ar: string; en: string };
  solution: { ar: string; en: string };
  result: { ar: string; en: string };
  cover: string;
  metrics: { value: string; label: { ar: string; en: string } }[];
  stack: string[];
}

export const projects: Project[] = [
  {
    slug: "nakhlah-hail-dates-store",
    category: "stores",
    title: {
      ar: "متجر نخلة وهيل للتمور الفاخرة",
      en: "Nakhlah & Hail Luxury Dates Store",
    },
    desc: {
      ar: "تجربة تجارة إلكترونية متكاملة تركز على سرعة التصفح وسلاسة إتمام الشراء لقطاعي التجزئة والجملة.",
      en: "A seamless e-commerce experience optimized for checkout speed for retail and wholesale.",
    },
    challenge: {
      ar: "بطء أداء المتجر السابق (زمن تحميل يتجاوز 5 ثوانٍ)، مما أدى إلى خسارة 40% من المبيعات بسبب السلال المتروكة.",
      en: "The previous store took over 5 seconds to load, resulting in losing 40% of potential carts.",
    },
    solution: {
      ar: "إعادة بناء المتجر بتصميم بسيط وخفيف الوزن (Minimalist)، مع ربطه ببوابات دفع فورية (مدى، Apple Pay) وحلول شحن ذكية.",
      en: "Rebuilt with a fast, lightweight Minimalist design, integrating instant checkouts (Mada, Apple Pay).",
    },
    result: {
      ar: "تقليص زمن التحميل إلى 0.9 ثانية فقط، وارتفاع المبيعات بنسبة 55% خلال الشهر الأول من الإطلاق.",
      en: "Reduced load time to 0.9s and boosted overall sales by 55% in the first month post-launch.",
    },
    cover: "/logo.png",
    metrics: [
      { value: "0.9s", label: { ar: "زمن التحميل", en: "Load time" } },
      { value: "+55%", label: { ar: "نمو المبيعات", en: "Sales growth" } },
      { value: "-40%", label: { ar: "السلال المتروكة", en: "Cart abandonment" } },
    ],
    stack: ["Next.js", "Salla API", "Mada", "Apple Pay"],
  },
  {
    slug: "alraid-engineering-consultations",
    category: "web",
    title: {
      ar: "منصة الرائد للاستشارات الهندسية",
      en: "Al-Raid Engineering Consultations",
    },
    desc: {
      ar: "موقع تعريفي ونظام مؤتمت متطور لحجز وإدارة الاستشارات لشركة استشارية كبرى بالخليج.",
      en: "A premium corporate hub with automated booking schedules for a top GCC consultancy.",
    },
    challenge: {
      ar: "تشتت العملاء بين قنوات التواصل الاجتماعي المختلفة وغياب آلية مركزية وموحدة لحجز وإدارة المواعيد.",
      en: "Clients struggled to schedule slots, scattering leads across uncoordinated social channels.",
    },
    solution: {
      ar: "تطوير موقع ويب تعريفي يعكس هوية الشركة، مدمج بنظام ذكي لجدولة المواعيد وتأكيد الحجوزات تلقائياً مع لوحة تحكم إدارية.",
      en: "Developed a rich corporate site with integrated booking calendar linked to calendar apps and admin panels.",
    },
    result: {
      ar: "استقبلنا أكثر من 450 حجزاً مؤكداً شهرياً عبر الموقع، مما وفر 30% من الوقت المهدر في العمليات الإدارية.",
      en: "Secured +450 confirmed appointments monthly, saving 30% of administrative operational hours.",
    },
    cover: "/logo.png",
    metrics: [
      { value: "+450", label: { ar: "حجز شهري", en: "Monthly bookings" } },
      { value: "-30%", label: { ar: "وقت إداري", en: "Admin time" } },
      { value: "24/7", label: { ar: "حجز ذاتي", en: "Self-booking" } },
    ],
    stack: ["Next.js", "Booking system", "Admin dashboard"],
  },
  {
    slug: "sanad-logistics-identity",
    category: "brands",
    title: {
      ar: 'الهوية البصرية لتطبيق "سند" اللوجستي',
      en: "Sanad Logistics App Visual Identity",
    },
    desc: {
      ar: "بناء العلامة التجارية وتصميم الهوية البصرية المتكاملة (الشعار، القرطاسيات، ودليل الاستخدام).",
      en: "Full brand guidelines, including logo typography, style books, and stationary.",
    },
    challenge: {
      ar: "الحاجة إلى بناء علامة بصرية مميزة ومرنة لشركة خدمات لوجستية ناشئة، تعبر عن السرعة والموثوقية وتناسب شاشات التطبيقات.",
      en: "A new startup app needing a memorable, trustworthy aesthetic that feels solid on mobile UI.",
    },
    solution: {
      ar: "تصميم شعار خطي (Logotype) عصري يدمج معاني السرعة والأمان، مع صياغة دليل إرشادي شامل للألوان والخطوط والأيقونات.",
      en: "Designed a modern logotype symbolizing speed, stability, and trust with guidelines for app interfaces.",
    },
    result: {
      ar: "إطلاق الهوية بنجاح، وارتفاع مؤشر ثقة المستخدمين بالعلامة بنسبة 85% في استطلاعات الرأي الأولية.",
      en: "Successfully launched, achieving an 85% user-trust rating in initial customer satisfaction surveys.",
    },
    cover: "/logo.png",
    metrics: [
      { value: "85%", label: { ar: "ثقة المستخدمين", en: "User trust" } },
      { value: "1:1", label: { ar: "تناغم عربي/لاتيني", en: "AR/EN harmony" } },
    ],
    stack: ["Brand identity", "Logotype", "Guidelines"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function localized<T>(field: { ar: T; en: T }, lang: Locale): T {
  return field[lang];
}
