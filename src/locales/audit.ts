// نصوص المختبر التقني: واجهة الفحص + شرح كل فحص (ما المشكلة، لماذا تهم، كيف تُصلَح).
// القيم بين {أقواس} تُستبدل بقياسات الفحص الفعلية.
import type { AuditCategory, AuditErrorCode } from "@/lib/audit/types";

export type AuditLang = "ar" | "en";

export interface FindingText {
  /** العنوان حين يكون الفحص سليماً. */
  pass: string;
  /** العنوان حين توجد مشكلة أو ملاحظة. */
  issue: string;
  why: string;
  fix: string;
}

export const findingText: Record<string, Record<AuditLang, FindingText>> = {
  // ===== الأداء =====
  perf_ttfb: {
    ar: {
      pass: "الخادم يستجيب بسرعة ({ms} مللي ثانية)",
      issue: "الخادم بطيء في الاستجابة ({ms} مللي ثانية)",
      why: "كل ما في الصفحة ينتظر أول رد من الخادم. التأخير هنا يؤخر كل شيء بعده، وغوغل يحسبه ضمن تقييم السرعة.",
      fix: "فعّل التخزين المؤقت للصفحات، استخدم شبكة توزيع محتوى (CDN)، وراجع الاستعلامات البطيئة أو خطة الاستضافة.",
    },
    en: {
      pass: "Server responds quickly ({ms} ms)",
      issue: "Slow server response ({ms} ms)",
      why: "Everything on the page waits for the first byte. A slow start delays everything after it, and Google counts it in speed scoring.",
      fix: "Enable page caching, put a CDN in front of the site, and review slow queries or the hosting plan.",
    },
  },
  perf_html_size: {
    ar: {
      pass: "حجم الصفحة مناسب ({kb} كيلوبايت)",
      issue: "صفحة HTML ثقيلة ({kb} كيلوبايت)",
      why: "المتصفح يحمّل هذا الملف ويحلّله قبل أن يعرض أي شيء. الحجم الكبير يبطئ الصفحة خاصة على شبكات الجوال.",
      fix: "احذف الأكواد والبيانات المضمّنة غير اللازمة، وأخّر تحميل الأقسام البعيدة عن أعلى الصفحة.",
    },
    en: {
      pass: "Page weight is reasonable ({kb} KB)",
      issue: "Heavy HTML document ({kb} KB)",
      why: "The browser must download and parse this file before showing anything. Large documents slow the page, especially on mobile networks.",
      fix: "Remove unneeded inline code and data, and defer below-the-fold sections.",
    },
  },
  perf_compression: {
    ar: {
      pass: "الضغط مفعّل",
      issue: "الصفحة تُرسل بدون ضغط",
      why: "الضغط يصغّر الملفات النصية بنسبة 60–80%. بدونه يحمّل الزائر بيانات أكثر بلا داعٍ.",
      fix: "فعّل ضغط Brotli أو Gzip من إعدادات الخادم أو الاستضافة. غالباً إعداد واحد.",
    },
    en: {
      pass: "Compression is enabled",
      issue: "Page is served uncompressed",
      why: "Compression shrinks text files by 60–80%. Without it visitors download far more data than needed.",
      fix: "Turn on Brotli or Gzip in the server or hosting settings. It is usually a single switch.",
    },
  },
  perf_redirects: {
    ar: {
      pass: "لا توجد تحويلات زائدة",
      issue: "سلسلة تحويلات قبل الوصول للصفحة (العدد: {count})",
      why: "كل تحويل طلب إضافي كامل قبل أن يبدأ تحميل الصفحة الفعلية.",
      fix: "اجعل الروابط تشير مباشرة إلى العنوان النهائي، وادمج التحويلات المتتالية في تحويل واحد.",
    },
    en: {
      pass: "No unnecessary redirects",
      issue: "Redirect chain before the page loads ({count} redirects)",
      why: "Each redirect is a full extra round trip before the real page starts loading.",
      fix: "Point links straight at the final address and collapse chained redirects into one.",
    },
  },
  perf_blocking_scripts: {
    ar: {
      pass: "لا توجد سكربتات تعطّل عرض الصفحة",
      issue: "سكربتات في رأس الصفحة تعطّل العرض (العدد: {count})",
      why: "المتصفح يتوقف عن رسم الصفحة حتى يحمّل وينفّذ كل واحد منها، فيرى الزائر صفحة بيضاء أطول.",
      fix: "أضف defer أو async لهذه السكربتات، أو انقلها إلى نهاية الصفحة.",
    },
    en: {
      pass: "No render-blocking scripts",
      issue: "{count} render-blocking scripts in the page head",
      why: "The browser stops painting until each one downloads and runs, so visitors stare at a blank page longer.",
      fix: "Add defer or async to these scripts, or move them to the end of the page.",
    },
  },
  perf_scripts_count: {
    ar: {
      pass: "عدد السكربتات معقول ({count})",
      issue: "عدد كبير من ملفات JavaScript ({count})",
      why: "كثرة السكربتات تثقل معالج الجوال وتؤخر تفاعل الصفحة مع لمسات الزائر.",
      fix: "احذف الإضافات وأدوات التتبع غير المستخدمة، وحمّل الباقي عند الحاجة فقط.",
    },
    en: {
      pass: "Script count is reasonable ({count})",
      issue: "Large number of JavaScript files ({count})",
      why: "Many scripts load the phone's processor and delay how soon the page reacts to taps.",
      fix: "Remove unused plugins and trackers, and load the rest only when needed.",
    },
  },
  perf_css_count: {
    ar: {
      pass: "عدد ملفات التنسيق معقول ({count})",
      issue: "عدد كبير من ملفات CSS ({count})",
      why: "كل ملف تنسيق يؤخر أول عرض للصفحة حتى يكتمل تحميله.",
      fix: "ادمج ملفات التنسيق واحذف غير المستخدم منها.",
    },
    en: {
      pass: "Stylesheet count is reasonable ({count})",
      issue: "Large number of CSS files ({count})",
      why: "Each stylesheet delays the first paint until it finishes loading.",
      fix: "Merge stylesheets and drop the unused ones.",
    },
  },
  perf_img_lazy: {
    ar: {
      pass: "الصور تُحمَّل عند الحاجة",
      issue: "كل الصور تُحمَّل دفعة واحدة (عدد الصور: {count})",
      why: "الزائر يحمّل صوراً لن يراها إلا بعد التمرير، فتتأخر الصور المهمة في أعلى الصفحة.",
      fix: 'أضف loading="lazy" للصور البعيدة عن أعلى الصفحة.',
    },
    en: {
      pass: "Images load lazily",
      issue: "All images load at once ({count} images)",
      why: "Visitors download images they will only see after scrolling, which delays the important ones at the top.",
      fix: 'Add loading="lazy" to images below the top of the page.',
    },
  },
  perf_img_dimensions: {
    ar: {
      pass: "الصور لها أبعاد محددة",
      issue: "صور بدون أبعاد محددة (العدد: {count})",
      why: "بدون width و height تقفز عناصر الصفحة أثناء التحميل، فيضغط الزائر على شيء لم يقصده.",
      fix: "حدّد width و height لكل صورة ليحجز المتصفح مكانها مسبقاً.",
    },
    en: {
      pass: "Images have explicit dimensions",
      issue: "{count} images without explicit dimensions",
      why: "Without width and height the layout jumps while loading, and visitors tap things they did not mean to.",
      fix: "Set width and height on every image so the browser reserves the space.",
    },
  },
  perf_lighthouse: {
    ar: {
      pass: "تقييم Lighthouse للأداء على الجوال: {score}",
      issue: "تقييم Lighthouse للأداء على الجوال: {score}",
      why: "هذا تقييم غوغل الرسمي لتجربة التحميل على الجوال، ويؤثر على ترتيب الموقع في البحث.",
      fix: "عالج الملاحظات أعلاه بالترتيب: استجابة الخادم، ثم السكربتات المعطِّلة، ثم الصور.",
    },
    en: {
      pass: "Lighthouse mobile performance: {score}",
      issue: "Lighthouse mobile performance: {score}",
      why: "This is Google's own rating of the mobile loading experience, and it affects search ranking.",
      fix: "Work through the items above in order: server response, then blocking scripts, then images.",
    },
  },

  // ===== الأمان =====
  sec_https: {
    ar: {
      pass: "الموقع يعمل عبر اتصال مشفّر (HTTPS)",
      issue: "الموقع يعمل بدون تشفير (HTTP)",
      why: "كل ما يكتبه الزائر، ومنه كلمات المرور وبيانات الدفع، يمر مكشوفاً. والمتصفحات تعرض تحذير «غير آمن».",
      fix: "ركّب شهادة SSL (مجانية عبر Let's Encrypt) وحوّل كل الزيارات إلى HTTPS.",
    },
    en: {
      pass: "Site is served over an encrypted connection (HTTPS)",
      issue: "Site is served without encryption (HTTP)",
      why: 'Everything visitors type, including passwords and payment details, travels in the clear. Browsers show a "Not secure" warning.',
      fix: "Install an SSL certificate (free via Let's Encrypt) and redirect all traffic to HTTPS.",
    },
  },
  sec_cert: {
    ar: {
      pass: "شهادة التشفير سليمة (الأيام المتبقية: {days})",
      issue: "شهادة التشفير منتهية أو غير موثوقة",
      why: "المتصفح يعرض صفحة تحذير حمراء بدل موقعك، ويغادر أغلب الزوار قبل أن يدخلوا.",
      fix: "أعد إصدار الشهادة للنطاق الصحيح من جهة موثوقة وفعّل التجديد التلقائي.",
    },
    en: {
      pass: "TLS certificate is valid (expires in {days} days)",
      issue: "TLS certificate is expired or untrusted",
      why: "Browsers show a red warning page instead of your site, and most visitors leave before entering.",
      fix: "Reissue the certificate for the correct domain from a trusted authority and enable auto-renewal.",
    },
  },
  sec_cert_expiring: {
    ar: {
      pass: "شهادة التشفير سليمة",
      issue: "شهادة التشفير تنتهي قريباً (الأيام المتبقية: {days})",
      why: "عند انتهائها يعرض المتصفح صفحة تحذير حمراء ويتوقف الموقع فعلياً عن استقبال الزوار.",
      fix: "جدّد الشهادة الآن وفعّل التجديد التلقائي حتى لا يتكرر الأمر.",
    },
    en: {
      pass: "TLS certificate is valid",
      issue: "TLS certificate expires in {days} days",
      why: "Once it expires browsers show a red warning page and the site effectively stops receiving visitors.",
      fix: "Renew it now and enable auto-renewal so it does not happen again.",
    },
  },
  sec_http_redirect: {
    ar: {
      pass: "الزيارات غير المشفّرة تُحوَّل إلى HTTPS",
      issue: "النسخة غير المشفّرة من الموقع ما زالت تعمل",
      why: "من يكتب عنوان الموقع بدون https يبقى على اتصال مكشوف يمكن التنصت عليه أو تعديله.",
      fix: "أضف تحويلاً دائماً (301) من http إلى https على مستوى الخادم.",
    },
    en: {
      pass: "Unencrypted visits are redirected to HTTPS",
      issue: "The unencrypted version of the site still works",
      why: "Anyone typing the address without https stays on an open connection that can be read or altered.",
      fix: "Add a permanent (301) redirect from http to https at the server level.",
    },
  },
  sec_hsts: {
    ar: {
      pass: "المتصفحات مُلزَمة باستخدام HTTPS (HSTS)",
      issue: "ترويسة HSTS غير مفعّلة أو مدتها قصيرة",
      why: "بدونها يمكن لمهاجم على نفس الشبكة أن يُنزل اتصال الزائر إلى HTTP ويعترضه.",
      fix: "أضف الترويسة: Strict-Transport-Security: max-age=31536000; includeSubDomains",
    },
    en: {
      pass: "Browsers are forced to use HTTPS (HSTS)",
      issue: "HSTS header is missing or too short-lived",
      why: "Without it an attacker on the same network can downgrade a visitor's connection to HTTP and intercept it.",
      fix: "Add the header: Strict-Transport-Security: max-age=31536000; includeSubDomains",
    },
  },
  sec_csp: {
    ar: {
      pass: "سياسة أمان المحتوى (CSP) مفعّلة",
      issue: "لا توجد سياسة أمان محتوى (CSP)",
      why: "هي خط الدفاع الأساسي ضد حقن السكربتات الخبيثة (XSS) التي تسرق جلسات وبيانات الزوار.",
      fix: "عرّف ترويسة Content-Security-Policy تحدد المصادر المسموح بها. ابدأ بوضع التقرير فقط ثم شدّدها.",
    },
    en: {
      pass: "Content Security Policy (CSP) is set",
      issue: "No Content Security Policy (CSP)",
      why: "It is the main defence against injected malicious scripts (XSS) that steal visitor sessions and data.",
      fix: "Define a Content-Security-Policy header listing allowed sources. Start in report-only mode, then tighten it.",
    },
  },
  sec_xcto: {
    ar: {
      pass: "الحماية من تخمين نوع الملفات مفعّلة",
      issue: "ترويسة X-Content-Type-Options غير موجودة",
      why: "بدونها قد يشغّل المتصفح ملفاً مرفوعاً على أنه سكربت، وهو باب لهجمات الحقن.",
      fix: "أضف الترويسة: X-Content-Type-Options: nosniff",
    },
    en: {
      pass: "MIME-sniffing protection is on",
      issue: "X-Content-Type-Options header is missing",
      why: "Without it a browser may run an uploaded file as a script, which opens the door to injection attacks.",
      fix: "Add the header: X-Content-Type-Options: nosniff",
    },
  },
  sec_clickjacking: {
    ar: {
      pass: "الموقع محمي من التضمين داخل صفحات أخرى",
      issue: "يمكن تضمين الموقع داخل صفحة أخرى (Clickjacking)",
      why: "يستطيع مهاجم عرض موقعك في إطار مخفي وخداع الزائر ليضغط أزراراً فيه دون علمه.",
      fix: "أضف X-Frame-Options: SAMEORIGIN أو التوجيه frame-ancestors في سياسة CSP.",
    },
    en: {
      pass: "Site cannot be framed by other pages",
      issue: "Site can be embedded in another page (clickjacking)",
      why: "An attacker can load your site in a hidden frame and trick visitors into clicking buttons on it.",
      fix: "Add X-Frame-Options: SAMEORIGIN or a frame-ancestors directive in the CSP.",
    },
  },
  sec_referrer: {
    ar: {
      pass: "سياسة الإحالة محددة",
      issue: "سياسة الإحالة (Referrer-Policy) غير محددة",
      why: "قد تتسرب روابط صفحاتك الداخلية، ومنها روابط تحمل معرّفات خاصة، إلى المواقع الخارجية.",
      fix: "أضف الترويسة: Referrer-Policy: strict-origin-when-cross-origin",
    },
    en: {
      pass: "Referrer policy is set",
      issue: "No Referrer-Policy set",
      why: "Internal page addresses, including ones carrying private identifiers, can leak to external sites.",
      fix: "Add the header: Referrer-Policy: strict-origin-when-cross-origin",
    },
  },
  sec_permissions: {
    ar: {
      pass: "صلاحيات المتصفح مقيّدة",
      issue: "صلاحيات المتصفح غير مقيّدة (Permissions-Policy)",
      why: "أي سكربت خارجي في الصفحة يستطيع طلب الكاميرا أو الموقع الجغرافي باسم موقعك.",
      fix: "أضف ترويسة Permissions-Policy تعطّل ما لا تستخدمه، مثل: camera=(), microphone=(), geolocation=()",
    },
    en: {
      pass: "Browser permissions are restricted",
      issue: "Browser permissions are unrestricted (Permissions-Policy)",
      why: "Any third-party script on the page can request the camera or location in your site's name.",
      fix: "Add a Permissions-Policy header disabling what you do not use, e.g. camera=(), microphone=(), geolocation=()",
    },
  },
  sec_cookies: {
    ar: {
      pass: "ملفات تعريف الارتباط محمية (العدد: {total})",
      issue: "ملفات تعريف ارتباط بدون حماية كاملة ({weak} من {total})",
      why: "الكوكي بدون Secure و HttpOnly و SameSite يمكن سرقته أو استغلاله لتنفيذ طلبات باسم الزائر.",
      fix: "أضف الخصائص Secure و HttpOnly و SameSite=Lax لكل كوكي لا يحتاجه JavaScript.",
    },
    en: {
      pass: "Cookies are protected ({total})",
      issue: "{weak} of {total} cookies lack full protection",
      why: "A cookie without Secure, HttpOnly and SameSite can be stolen or abused to act as the visitor.",
      fix: "Add Secure, HttpOnly and SameSite=Lax to every cookie JavaScript does not need.",
    },
  },
  sec_disclosure: {
    ar: {
      pass: "الخادم لا يكشف تفاصيل تقنيته",
      issue: "الخادم يكشف تقنيته أو إصداره ({value})",
      why: "معرفة الإصدار تسهّل على المهاجم البحث عن ثغرات معروفة فيه.",
      fix: "أخفِ ترويستي Server و X-Powered-By أو احذف رقم الإصدار منهما.",
    },
    en: {
      pass: "Server does not reveal its technology",
      issue: "Server reveals its technology or version ({value})",
      why: "Knowing the version makes it easier for an attacker to look up known vulnerabilities.",
      fix: "Hide the Server and X-Powered-By headers, or strip the version number.",
    },
  },
  sec_mixed: {
    ar: {
      pass: "لا يوجد محتوى غير مشفّر داخل الصفحة",
      issue: "عناصر تُحمَّل عبر HTTP داخل صفحة مشفّرة (العدد: {count})",
      why: "المتصفح يحجب هذه العناصر أو يعرض تحذيراً، ويمكن التلاعب بها أثناء النقل.",
      fix: "حوّل روابط هذه الملفات إلى https://.",
    },
    en: {
      pass: "No unencrypted content inside the page",
      issue: "{count} resources load over HTTP inside an encrypted page",
      why: "Browsers block these or show a warning, and they can be tampered with in transit.",
      fix: "Switch those resource links to https://.",
    },
  },
  sec_spf: {
    ar: {
      pass: "سجل SPF للبريد موجود",
      issue: "لا يوجد سجل SPF لبريد النطاق",
      why: "بدونه يستطيع أي شخص إرسال بريد يبدو أنه من نطاقك، ورسائلك الحقيقية قد تذهب إلى السبام.",
      fix: "أضف سجل TXT يبدأ بـ v=spf1 ويحدد خوادم الإرسال المصرّح لها.",
    },
    en: {
      pass: "SPF record is published",
      issue: "No SPF record for the domain's email",
      why: "Without it anyone can send mail that appears to come from your domain, and your real mail may land in spam.",
      fix: "Add a TXT record starting with v=spf1 that lists the servers allowed to send.",
    },
  },
  sec_dmarc: {
    ar: {
      pass: "سياسة DMARC تحمي النطاق من الانتحال",
      issue: "سياسة DMARC غير موجودة أو غير مفعّلة",
      why: "هي التي تأمر مزودي البريد برفض الرسائل المنتحِلة لاسم نطاقك. بدونها ينتحل المحتالون اسمك أمام عملائك.",
      fix: "أضف سجل TXT على _dmarc بسياسة p=quarantine ثم ارفعها إلى p=reject بعد المراقبة.",
    },
    en: {
      pass: "DMARC policy protects the domain from spoofing",
      issue: "DMARC policy is missing or not enforced",
      why: "It tells mail providers to reject messages spoofing your domain. Without it scammers can pose as you to your customers.",
      fix: "Add a TXT record at _dmarc with p=quarantine, then raise it to p=reject after monitoring.",
    },
  },

  // ===== السيو والجوال =====
  seo_status: {
    ar: {
      pass: "الصفحة تُفتح بشكل سليم",
      issue: "الصفحة تعيد رمز خطأ ({status})",
      why: "محركات البحث لا تفهرس صفحة تعيد خطأ، والزائر يرى صفحة معطّلة.",
      fix: "راجع سجلات الخادم وأصلح سبب الخطأ قبل أي تحسين آخر.",
    },
    en: {
      pass: "Page loads successfully",
      issue: "Page returns an error code ({status})",
      why: "Search engines do not index a page that returns an error, and visitors see a broken page.",
      fix: "Check the server logs and fix the error before any other improvement.",
    },
  },
  seo_title: {
    ar: {
      pass: "عنوان الصفحة مناسب (عدد الأحرف: {length})",
      issue: "عنوان الصفحة مفقود أو طوله غير مناسب (عدد الأحرف: {length})",
      why: "العنوان هو السطر الأزرق في نتائج غوغل وأهم عامل لنقر الباحث. الطويل يُقطع والقصير لا يشرح.",
      fix: "اكتب عنواناً فريداً بين 30 و60 حرفاً يبدأ بأهم كلمة مفتاحية.",
    },
    en: {
      pass: "Page title is well sized ({length} characters)",
      issue: "Page title is missing or badly sized ({length} characters)",
      why: "The title is the blue line in Google results and the main reason a searcher clicks. Long ones get cut, short ones say nothing.",
      fix: "Write a unique title of 30–60 characters that leads with the main keyword.",
    },
  },
  seo_description: {
    ar: {
      pass: "وصف الصفحة مناسب (عدد الأحرف: {length})",
      issue: "وصف الصفحة مفقود أو طوله غير مناسب (عدد الأحرف: {length})",
      why: "الوصف يظهر تحت العنوان في نتائج البحث. بدونه يختار غوغل نصاً عشوائياً من الصفحة.",
      fix: "اكتب وصفاً بين 120 و160 حرفاً يوضّح ما يجده الزائر ويدعوه للدخول.",
    },
    en: {
      pass: "Meta description is well sized ({length} characters)",
      issue: "Meta description is missing or badly sized ({length} characters)",
      why: "The description shows under the title in search results. Without it Google picks random text from the page.",
      fix: "Write 120–160 characters that say what the visitor will find and invite the click.",
    },
  },
  seo_h1: {
    ar: {
      pass: "عنوان رئيسي واحد (H1)",
      issue: "عدد العناوين الرئيسية H1 في الصفحة: {count}",
      why: "عنوان H1 واحد يخبر محركات البحث بموضوع الصفحة. غيابه أو تكراره يشتّت الفهم.",
      fix: "اجعل لكل صفحة عنوان H1 واحداً يصف موضوعها، واستخدم H2 و H3 لما تحته.",
    },
    en: {
      pass: "Exactly one main heading (H1)",
      issue: "Number of H1 headings on the page: {count}",
      why: "A single H1 tells search engines what the page is about. Missing or repeated H1s blur that signal.",
      fix: "Give each page one H1 describing its topic, and use H2 and H3 beneath it.",
    },
  },
  seo_viewport: {
    ar: {
      pass: "الصفحة مهيّأة لشاشات الجوال",
      issue: "الصفحة غير مهيّأة لشاشات الجوال",
      why: "بدون وسم viewport يعرض الجوال نسخة سطح المكتب مصغّرة. وغوغل يفهرس نسخة الجوال أولاً.",
      fix: 'أضف في رأس الصفحة: <meta name="viewport" content="width=device-width, initial-scale=1">',
    },
    en: {
      pass: "Page is set up for mobile screens",
      issue: "Page is not set up for mobile screens",
      why: "Without a viewport tag phones show a shrunken desktop page. Google indexes the mobile version first.",
      fix: 'Add to the page head: <meta name="viewport" content="width=device-width, initial-scale=1">',
    },
  },
  seo_lang: {
    ar: {
      pass: "لغة الصفحة محددة",
      issue: "لغة الصفحة غير محددة",
      why: "محركات البحث وقارئات الشاشة تعتمد عليها لعرض الصفحة للجمهور الصحيح ونطقها بشكل سليم.",
      fix: 'أضف الخاصية lang لوسم html، مثل: <html lang="ar" dir="rtl">',
    },
    en: {
      pass: "Page language is declared",
      issue: "Page language is not declared",
      why: "Search engines and screen readers rely on it to serve the right audience and pronounce text correctly.",
      fix: 'Add a lang attribute to the html tag, e.g. <html lang="en">',
    },
  },
  seo_canonical: {
    ar: {
      pass: "الرابط الأساسي (canonical) محدد",
      issue: "لا يوجد رابط أساسي (canonical)",
      why: "الصفحة نفسها قد تُفتح بعدة روابط، فيتوزّع ترتيبها بينها بدل أن يتركّز في رابط واحد.",
      fix: 'أضف <link rel="canonical" href="..."> يشير إلى العنوان الرسمي للصفحة.',
    },
    en: {
      pass: "Canonical URL is set",
      issue: "No canonical URL",
      why: "The same page can be reached through several addresses, splitting its ranking instead of concentrating it.",
      fix: 'Add <link rel="canonical" href="..."> pointing at the official address.',
    },
  },
  seo_og: {
    ar: {
      pass: "الرابط يظهر بعنوان وصورة عند مشاركته",
      issue: "الرابط يظهر بدون صورة أو عنوان عند مشاركته",
      why: "عند إرسال رابط موقعك في واتساب أو X يظهر نصاً مجرداً بدل بطاقة جذابة، فتقل النقرات.",
      fix: "أضف وسوم og:title و og:description و og:image (صورة 1200×630).",
    },
    en: {
      pass: "Link shows a title and image when shared",
      issue: "Link shows no image or title when shared",
      why: "Shared on WhatsApp or X, your link appears as bare text instead of an attractive card, so fewer people click.",
      fix: "Add og:title, og:description and og:image tags (1200×630 image).",
    },
  },
  seo_noindex: {
    ar: {
      pass: "الصفحة مسموح بفهرستها",
      issue: "الصفحة ممنوعة من الظهور في غوغل (noindex)",
      why: "هذا الوسم يأمر محركات البحث صراحةً بتجاهل الصفحة. موقعك لن يظهر في نتائج البحث.",
      fix: "احذف noindex من وسم robots ومن ترويسة X-Robots-Tag إن لم يكن ذلك مقصوداً.",
    },
    en: {
      pass: "Page is allowed to be indexed",
      issue: "Page is blocked from Google (noindex)",
      why: "This tag explicitly tells search engines to ignore the page. Your site will not appear in results.",
      fix: "Remove noindex from the robots meta tag and the X-Robots-Tag header unless it is intentional.",
    },
  },
  seo_robots_txt: {
    ar: {
      pass: "ملف robots.txt سليم",
      issue: "ملف robots.txt مفقود أو يمنع الزواحف",
      why: "هذا الملف يوجّه محركات البحث. غيابه يضيّع فرصة التوجيه، ومنعه الكامل يخفي الموقع.",
      fix: "أنشئ robots.txt يسمح بالزحف ويشير إلى خريطة الموقع.",
    },
    en: {
      pass: "robots.txt is in place",
      issue: "robots.txt is missing or blocks crawlers",
      why: "This file guides search engines. Missing, it wastes that chance; blocking everything hides the site.",
      fix: "Create a robots.txt that allows crawling and points to the sitemap.",
    },
  },
  seo_sitemap: {
    ar: {
      pass: "خريطة الموقع موجودة",
      issue: "لا توجد خريطة موقع (sitemap.xml)",
      why: "الخريطة تعرّف غوغل بكل صفحاتك. بدونها قد تبقى صفحات مهمة غير مفهرسة لأسابيع.",
      fix: "ولّد sitemap.xml وأضف رابطه في robots.txt وفي Google Search Console.",
    },
    en: {
      pass: "Sitemap found",
      issue: "No sitemap (sitemap.xml)",
      why: "A sitemap tells Google about all your pages. Without one, important pages can stay unindexed for weeks.",
      fix: "Generate sitemap.xml and list it in robots.txt and Google Search Console.",
    },
  },
  seo_structured: {
    ar: {
      pass: "البيانات المنظمة موجودة",
      issue: "لا توجد بيانات منظمة (Schema)",
      why: "هي ما يمنح نتيجتك في غوغل النجوم والأسعار والأسئلة الشائعة، فتبرز عن المنافسين.",
      fix: "أضف JSON-LD مناسباً لنشاطك: Organization أو Product أو LocalBusiness.",
    },
    en: {
      pass: "Structured data found",
      issue: "No structured data (Schema)",
      why: "It is what gives your Google result stars, prices and FAQs, making it stand out from competitors.",
      fix: "Add JSON-LD suited to your business: Organization, Product or LocalBusiness.",
    },
  },
  seo_img_alt: {
    ar: {
      pass: "الصور لها نص بديل",
      issue: "صور بدون نص بديل alt (العدد: {count})",
      why: "النص البديل هو ما تقرؤه محركات البحث وقارئات الشاشة عن الصورة. بدونه تضيع زيارات بحث الصور.",
      fix: "أضف خاصية alt تصف محتوى كل صورة، واتركها فارغة للصور الزخرفية فقط.",
    },
    en: {
      pass: "Images have alt text",
      issue: "{count} images without alt text",
      why: "Alt text is what search engines and screen readers read about an image. Without it you lose image-search traffic.",
      fix: "Add an alt attribute describing each image, leaving it empty only for decorative ones.",
    },
  },
};

export interface AuditUiText {
  tagline: string;
  title: string;
  subtitle: string;
  placeholder: string;
  inputLabel: string;
  start: string;
  scanning: string;
  rescan: string;
  trust: string[];
  stages: string[];
  categories: Record<AuditCategory, string>;
  overall: string;
  gradeLabel: string;
  summary: string;
  summaryClean: string;
  facts: { ttfb: string; size: string; cert: string; tls: string; days: string; ms: string; kb: string; none: string };
  statusLabel: { fail: string; warn: string; pass: string };
  why: string;
  fix: string;
  passedCount: string;
  share: string;
  copied: string;
  whatsapp: string;
  shareMessage: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  suggested: string;
  method: string;
  errors: Record<AuditErrorCode, string>;
}

export const auditUi: Record<AuditLang, AuditUiText> = {
  ar: {
    tagline: "مختبر أثر التقني",
    title: "افحص موقعك مجاناً",
    subtitle: "تقرير حقيقي عن السرعة والأمان والظهور في غوغل، مع شرح كل مشكلة وطريقة إصلاحها.",
    placeholder: "example.com",
    inputLabel: "رابط الموقع",
    start: "ابدأ الفحص",
    scanning: "جاري الفحص...",
    rescan: "إعادة الفحص",
    trust: ["بدون تسجيل", "نتائج حقيقية", "فحص آمن لا يغيّر شيئاً في موقعك"],
    stages: [
      "الاتصال بالخادم وقياس زمن الاستجابة",
      "قراءة شهادة التشفير وترويسات الأمان",
      "تحليل بنية الصفحة والسكربتات والصور",
      "فحص إعدادات البحث وحماية البريد",
    ],
    categories: { performance: "السرعة والأداء", security: "الأمان", seo: "السيو والجوال" },
    overall: "التقييم العام",
    gradeLabel: "الدرجة",
    summary: "المشاكل المؤثرة: {fails} · نقاط التحسين: {warns}",
    summaryClean: "لم نجد مشاكل مؤثرة. عمل ممتاز.",
    facts: {
      ttfb: "استجابة الخادم",
      size: "حجم الصفحة",
      cert: "صلاحية الشهادة",
      tls: "بروتوكول التشفير",
      days: "يوم",
      ms: "مللي ثانية",
      kb: "كيلوبايت",
      none: "لا يوجد",
    },
    statusLabel: { fail: "مشكلة", warn: "تحسين", pass: "سليم" },
    why: "لماذا يهم؟",
    fix: "طريقة الإصلاح",
    passedCount: "الفحوصات السليمة: {count}",
    share: "نسخ رابط التقرير",
    copied: "تم النسخ",
    whatsapp: "مشاركة عبر واتساب",
    shareMessage: "تقرير فحص موقع {host}: الدرجة {grade} ({score}/100)",
    ctaTitle: "نصلح هذه المشاكل لك",
    ctaDesc: "نرسل التقرير مع طلبك، ونعود إليك خلال يوم عمل بخطة الإصلاح وموعد التسليم.",
    ctaBtn: "اطلب إصلاح موقعي",
    suggested: "الباقة المناسبة لنتيجتك",
    method:
      "الفحص يقرأ الصفحة كما تصل من الخادم قبل تشغيل JavaScript، وهي الصورة التي تراها محركات البحث أولاً. زمن الاستجابة مقاس من خوادمنا وقد يختلف عن موقع زائرك.",
    errors: {
      invalid_url: "الرابط غير صحيح. اكتب عنوان الموقع مثل example.com",
      blocked_host: "لا يمكن فحص هذا العنوان. الفحص متاح للمواقع العامة فقط.",
      dns_failed: "لم نجد هذا النطاق. تأكد من كتابة العنوان بشكل صحيح.",
      unreachable: "تعذّر الاتصال بالموقع. قد يكون متوقفاً حالياً.",
      timeout: "الموقع لم يستجب خلال 12 ثانية، وهذه بحد ذاتها مشكلة أداء تستحق المعالجة.",
      blocked_by_site: "الموقع حجب الفحص الآلي (جدار حماية أو صفحة تحقق). لا يمكن قراءة بياناته.",
      rate_limited: "أجريت فحوصات كثيرة خلال وقت قصير. حاول بعد بضع دقائق.",
      server_error: "حدث خطأ غير متوقع أثناء الفحص. حاول مرة أخرى.",
    },
  },
  en: {
    tagline: "Athar Tech Lab",
    title: "Audit your website for free",
    subtitle: "A real report on speed, security and Google visibility, with every issue explained and how to fix it.",
    placeholder: "example.com",
    inputLabel: "Website address",
    start: "Start audit",
    scanning: "Scanning...",
    rescan: "Scan again",
    trust: ["No sign-up", "Real results", "Safe scan that changes nothing on your site"],
    stages: [
      "Connecting to the server and timing the response",
      "Reading the TLS certificate and security headers",
      "Analysing page structure, scripts and images",
      "Checking search settings and email protection",
    ],
    categories: { performance: "Speed & performance", security: "Security", seo: "SEO & mobile" },
    overall: "Overall",
    gradeLabel: "Grade",
    summary: "We found {fails} significant issues and {warns} points to improve.",
    summaryClean: "No significant issues found. Great work.",
    facts: {
      ttfb: "Server response",
      size: "Page weight",
      cert: "Certificate validity",
      tls: "TLS protocol",
      days: "days",
      ms: "ms",
      kb: "KB",
      none: "None",
    },
    statusLabel: { fail: "Issue", warn: "Improve", pass: "Passed" },
    why: "Why it matters",
    fix: "How to fix it",
    passedCount: "{count} checks passed",
    share: "Copy report link",
    copied: "Copied",
    whatsapp: "Share on WhatsApp",
    shareMessage: "Website audit for {host}: grade {grade} ({score}/100)",
    ctaTitle: "We can fix these for you",
    ctaDesc: "We attach this report to your request and reply within one business day with the fix plan and delivery date.",
    ctaBtn: "Fix my website",
    suggested: "Package that fits your result",
    method:
      "The audit reads the page as the server sends it, before JavaScript runs, which is what search engines see first. Response time is measured from our servers and may differ from your visitors' location.",
    errors: {
      invalid_url: "That address is not valid. Enter a site like example.com",
      blocked_host: "This address cannot be scanned. Audits are for public websites only.",
      dns_failed: "We could not find that domain. Check the spelling.",
      unreachable: "Could not connect to the site. It may be down right now.",
      timeout: "The site did not respond within 12 seconds, which is itself a performance problem worth fixing.",
      blocked_by_site: "The site blocked the automated scan (firewall or challenge page), so its data cannot be read.",
      rate_limited: "Too many scans in a short time. Try again in a few minutes.",
      server_error: "Something unexpected went wrong during the scan. Please try again.",
    },
  },
};

/** يستبدل {المفاتيح} في النص بالقيم المقاسة. */
export function fillText(template: string, data?: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(data?.[key] ?? ""));
}
