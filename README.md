# أثر (ATHR) — موقع الوكالة

موقع وكالة "أثر" لتصميم وتطوير المواقع والمتاجر الإلكترونية الفاخرة، مبني على **Next.js 16 (App Router) + React 19 + TypeScript**، ثنائي اللغة (عربي/إنجليزي، RTL/LTR).

## التشغيل

```bash
npm install
cp .env.example .env.local   # ثم املأ القيم المطلوبة
npm run dev                  # http://localhost:3000
npm run build && npm start   # نسخة الإنتاج
```

## متغيرات البيئة

كل المتغيرات اختيارية — الموقع يعمل بدونها مع تدهور سلس (graceful fallback). راجع [.env.example](.env.example):

| المتغير | الوظيفة | بدونه |
|---------|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | الرابط الرسمي (SEO/sitemap) | يستخدم `https://athr.agency` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | رقم واتساب التواصل | رقم افتراضي |
| `RESEND_API_KEY` | إرسال طلبات التواصل بالبريد | تُحفظ الطلبات محلياً فقط |
| `PAGESPEED_API_KEY` | فحص أداء حقيقي في المختبر التقني | يعمل بوضع المحاكاة |
| `ANTHROPIC_API_KEY` | مساعد أثر الذكي (Claude) | رسالة افتراضية توجّه للتواصل |
| `ADMIN_PASSWORD` | الدخول للوحة التحكم `/admin` | اللوحة معطّلة (503) |

## البنية

```
src/
├── app/                # المسارات (App Router)
│   ├── api/            # contact · chat · pagespeed · admin
│   ├── blog/[slug]/    # صفحات المقالات التفصيلية
│   ├── portfolio/[slug]/ # دراسات الحالة التفصيلية
│   ├── admin/          # لوحة تحكم الطلبات
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
│   └── layout.tsx      # يضبط lang/dir من الكوكي على الخادم + JSON-LD + المساعد
├── components/         # مكوّنات الواجهة (Header, Hero, ... ChatWidget, JsonLd)
├── content/            # مصدر الحقيقة للمقالات والمشاريع (ثنائي اللغة)
├── context/            # سياق اللغة
├── locales/            # نصوص الترجمة (مفصولة عن المنطق)
└── lib/                # config (إعدادات مركزية) + store (مخزن الطلبات)
```

## ملاحظات

- **اللغة:** تُحفظ في كوكي `athar_lang` ليضبط الخادم `<html lang/dir>` قبل الترطيب (SEO صحيح).
- **الطلبات:** تُحفظ في `data/leads.json` (مستبعد من git) وتظهر في `/admin`.
- **المختبر التقني:** أداة السرعة تستخدم Google PageSpeed Insights عند توفّر المفتاح، وإلا محاكاة.
