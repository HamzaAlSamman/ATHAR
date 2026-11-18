# أثر (ATHR) — موقع الوكالة + مختبر فحص المواقع

موقع وكالة "أثر" لتطوير المواقع والمتاجر. العرض الأساسي: **فحص مجاني وحقيقي** لأي موقع (السرعة، الأمان، السيو) بتقرير درجته من A إلى F، ثم **إصلاح بسعر ثابت**.

مبني على **Next.js 16 (App Router) + React 19 + TypeScript**، بلغتين بروابط منفصلة (`/ar/...` و `/en/...`).

## التشغيل

```bash
npm install
cp .env.example .env.local   # ثم املأ القيم
npm run dev                  # http://localhost:3000
npm run build && npm start   # نسخة الإنتاج
```

## متغيرات البيئة

التفاصيل في [.env.example](.env.example). الموقع يعمل بدون أغلبها، لكن قبل النشر للعامة يلزم:

| المتغير | الوظيفة | بدونه |
|---------|---------|-------|
| `NEXT_PUBLIC_SITE_URL` | الرابط الرسمي (SEO، sitemap، روابط المشاركة) | `https://athr.agency` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | زر واتساب في نموذج التواصل | رقم وهمي |
| `CONTACT_EMAIL` | بريد استقبال الطلبات | `hello@athr.agency` |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Upstash Redis: الطلبات، حد الطلبات، تخزين التقارير | ملف محلي (يضيع على Vercel) |
| `RESEND_API_KEY` | بريد إشعار بكل طلب | الطلب يُحفظ فقط |
| `ADMIN_PASSWORD` | لوحة الطلبات `/admin` | اللوحة معطّلة |
| `PAGESPEED_API_KEY` | قياس Lighthouse كامل في الفحص | قياس خفيف من الخادم |
| `ANTHROPIC_API_KEY` | المساعد الذكي | رسالة افتراضية |
| `NEXT_PUBLIC_CR_NUMBER` | قسم الموثوقية (رقم السجل التجاري) | القسم مخفي |

## البنية

```
src/
├── proxy.ts               # يحوّل الروابط بدون لغة إلى /ar أو /en
├── app/
│   ├── [lang]/            # كل الصفحات العامة بلغتين
│   │   ├── tech-lab/      # مختبر الفحص (رابط تقرير قابل للمشاركة: ?url=)
│   │   ├── pricing/       # باقات الإصلاح + باقات البناء
│   │   └── privacy · terms · blog · services · contact · ...
│   ├── admin/             # لوحة الطلبات (تخطيط مستقل)
│   ├── api/               # audit · contact · chat · admin
│   └── sitemap.ts · robots.ts
├── lib/
│   ├── audit/             # محرّك الفحص (فحص سلبي + حماية SSRF)
│   ├── kv.ts · rate-limit.ts · store.ts · admin-auth.ts
│   └── i18n.ts · config.ts · prefill.ts
├── content/
│   ├── packages.ts        # ⭐ كل الأسعار (الإصلاح، الرعاية، الحاسبة)
│   ├── projects.ts        # المعرض: يظهر فقط ما عليه published: true
│   └── posts.ts
└── locales/               # نصوص الواجهة + نصوص الفحص
```

## تعديل شائع

- **الأسعار:** `src/content/packages.ts` فقط. صفحة الأسعار والتقرير ونموذج التواصل والمساعد تقرأ منه. (باقات البناء الثلاث نصوصها في `src/locales/translations.ts` تحت `pricing`.)
- **إظهار مشروع في المعرض:** `published: true` في `src/content/projects.ts`. صفحة المعرض مخفية ما دام لا يوجد مشروع منشور.

## الأمان

- الفحص سلبي: يقرأ ما يعلنه الموقع فقط. العناوين الداخلية محجوبة حتى عبر التحويلات وتبديل DNS.
- حد طلبات مشترك (Redis) على الفحص والتواصل والمساعد وتسجيل دخول اللوحة.
- ترويسات أمان كاملة من `next.config.ts` (CSP، HSTS، وغيرها).
- جلسة اللوحة رمز موقّع (HMAC) وليست كلمة المرور.
