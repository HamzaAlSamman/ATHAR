// مخزن مقالات المدونة (ثنائي اللغة) — مصدر الحقيقة لقوائم المدونة وصفحات التفاصيل والـ sitemap.
// لاحقاً يمكن استبداله بـ CMS دون تغيير الواجهات التي تستهلكه.

import type { Locale } from "@/lib/config";

export interface BlogPostBlock {
  heading: { ar: string; en: string };
  body: { ar: string; en: string };
}

export interface BlogPost {
  slug: string;
  category: { ar: string; en: string };
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  date: { ar: string; en: string };
  time: { ar: string; en: string };
  cover: string;
  blocks: BlogPostBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "boost-ecommerce-sales-with-speed",
    category: { ar: "التجارة الإلكترونية", en: "E-commerce" },
    title: {
      ar: "كيف تزيد مبيعات متجرك الإلكتروني بنسبة 40% عبر تحسين سرعة الأداء؟",
      en: "Boost E-store Sales by 40% by Tuning Page Speed",
    },
    excerpt: {
      ar: "توضح الإحصاءات أن كل ثانية تأخير في تحميل متجرك قد تفقدك 10% من مبيعاتك المحتملة. إليك كيفية التغلب على هذه المشكلة وتسريع متجرك بفعالية.",
      en: "Stats reveal that a 1s load delay loses 10% of potential conversions. Learn the practical methods of speed optimization.",
    },
    date: { ar: "15 يونيو 2026", en: "June 15, 2026" },
    time: { ar: "5 دقائق قراءة", en: "5 min read" },
    cover: "/logo.png",
    blocks: [
      {
        heading: { ar: "لماذا السرعة = مبيعات؟", en: "Why speed equals sales" },
        body: {
          ar: "كل ثانية إضافية في زمن التحميل ترفع معدل الارتداد وتخفض معدل التحويل. المتسوّق العربي على الجوال غالباً على شبكة متوسطة، لذا فإن متجراً يفتح في أقل من ثانية يمنحك أفضلية مباشرة على المنافس.",
          en: "Every extra second of load time raises bounce rate and lowers conversions. Most Arab shoppers browse on mobile networks, so a sub-second store gives you a direct edge over competitors.",
        },
      },
      {
        heading: { ar: "أهم 3 خطوات عملية", en: "The top 3 practical steps" },
        body: {
          ar: "١) ضغط الصور وتحويلها لصيغ حديثة مثل WebP/AVIF. ٢) تقليل سكربتات الطرف الثالث وتأجيل تحميلها. ٣) الاعتماد على بنية حديثة مثل Next.js مع التصيير المسبق وحجب أقل قدر من الـ JavaScript.",
          en: "1) Compress and serve images as WebP/AVIF. 2) Reduce and defer third-party scripts. 3) Build on a modern stack like Next.js with prerendering and minimal shipped JavaScript.",
        },
      },
      {
        heading: { ar: "كيف نطبّقها في أثر؟", en: "How we apply this at Athar" },
        body: {
          ar: "نعيد بناء المتاجر البطيئة على بنية نظيفة تضمن زمن تحميل أقل من 1.2 ثانية، وقد رفعنا مبيعات أحد المتاجر 55% خلال الشهر الأول بعد إعادة البناء.",
          en: "We rebuild slow stores on a clean architecture guaranteeing sub-1.2s loads. One store's sales rose 55% in the first month post-rebuild.",
        },
      },
    ],
  },
  {
    slug: "local-seo-gcc-2026",
    category: { ar: "محركات البحث (SEO)", en: "SEO" },
    title: {
      ar: "الدليل العملي لتصدر نتائج البحث المحلية في السعودية والخليج لعام 2026",
      en: "The Blueprint for Dominating Local Search Results in the GCC for 2026",
    },
    excerpt: {
      ar: "يعد السيو المحلي الأداة الأكثر فعالية للشركات الخدمية والمكاتب الاستشارية لجذب عملاء مستهدفين محلياً وبدون تكلفة إعلانية.",
      en: "Local SEO is the secret weapon for agencies and consultancies to capture high-value clients in their area for free.",
    },
    date: { ar: "02 يونيو 2026", en: "June 02, 2026" },
    time: { ar: "8 دقائق قراءة", en: "8 min read" },
    cover: "/logo.png",
    blocks: [
      {
        heading: { ar: "ابدأ بملف نشاطك التجاري", en: "Start with your business profile" },
        body: {
          ar: "ملف Google Business المحسّن بالكامل (الفئة، الصور، المراجعات، أوقات العمل) هو حجر الأساس للظهور في الخريطة ونتائج 'بالقرب مني'.",
          en: "A fully optimized Google Business Profile (category, photos, reviews, hours) is the cornerstone of appearing in the map pack and 'near me' results.",
        },
      },
      {
        heading: { ar: "الكلمات المفتاحية بنية محلية", en: "Keywords with local intent" },
        body: {
          ar: "استهدف عبارات تجمع الخدمة بالمدينة (مثل: تصميم متاجر إلكترونية الرياض)، وابنِ صفحات هبوط مخصّصة لكل مدينة تخدمها.",
          en: "Target service-plus-city phrases (e.g. 'e-commerce design Riyadh') and build dedicated landing pages per city you serve.",
        },
      },
    ],
  },
  {
    slug: "nextjs-vs-wordpress",
    category: { ar: "تطوير الويب", en: "Web Development" },
    title: {
      ar: "مقارنة بين Next.js والووردبريس: متى تتطلب أعمالك حلاً برمجياً مخصصاً؟",
      en: "Next.js vs WordPress: When to Opt for Custom Code for Your Business?",
    },
    excerpt: {
      ar: "مقارنة موضوعية مبنية على الميزانية والأمان والمرونة التصميمية، لتحديد الخيار الأنسب لبناء موقع شركتك.",
      en: "An unbiased comparison helping you determine the best stack based on budget, security, and design modularity.",
    },
    date: { ar: "24 مايو 2026", en: "May 24, 2026" },
    time: { ar: "6 دقائق قراءة", en: "6 min read" },
    cover: "/logo.png",
    blocks: [
      {
        heading: { ar: "متى يكفي الووردبريس؟", en: "When WordPress is enough" },
        body: {
          ar: "للمواقع التعريفية البسيطة والمدوّنات ذات الميزانية المحدودة وفريق غير تقني، يقدّم الووردبريس انطلاقة سريعة — لكن مع تنازلات في الأداء والأمان.",
          en: "For simple brochure sites and blogs with a limited budget and non-technical team, WordPress offers a fast start — at the cost of performance and security.",
        },
      },
      {
        heading: { ar: "متى تحتاج Next.js؟", en: "When you need Next.js" },
        body: {
          ar: "عندما يكون الأداء، الأمان، التكامل المخصص، وتجربة فريدة حاسمة لنمو علامتك — تمنحك البنية المخصّصة تحكماً كاملاً وسرعة لا تضاهى.",
          en: "When performance, security, custom integrations, and a unique experience are critical to your brand's growth — a custom stack gives full control and unmatched speed.",
        },
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function localized<T>(field: { ar: T; en: T }, lang: Locale): T {
  return field[lang];
}
