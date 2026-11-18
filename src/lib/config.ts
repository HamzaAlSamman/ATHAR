// إعدادات الموقع المركزية لوكالة "أثر" — تقرأ من متغيرات البيئة مع قيم افتراضية آمنة.
// كل القيم الحساسة (مفاتيح API) تبقى على الخادم فقط ولا تبدأ بـ NEXT_PUBLIC.

const stripTrailingSlash = (url: string) => url.replace(/\/$/, '');

export const siteConfig = {
  name: 'أثر',
  nameEn: 'ATHR',
  // الرابط الرسمي للنشر — يُستخدم في الـ sitemap و metadata و JSON-LD.
  url: stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || 'https://athr.agency'),
  // رقم الواتساب بصيغة دولية بدون رموز (مثال: 966500000000).
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000',
  // بريد استقبال الطلبات.
  contactEmail: process.env.CONTACT_EMAIL || 'hello@athr.agency',
  social: {
    x: process.env.NEXT_PUBLIC_SOCIAL_X || '#',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '#',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '#',
  },
  // بيانات قانونية تُعرض فقط إن وُجدت فعلاً. لا نعرض أرقام سجلات أو توثيقات غير حقيقية.
  legal: {
    crNumber: process.env.NEXT_PUBLIC_CR_NUMBER || '',
    maaroofUrl: process.env.NEXT_PUBLIC_MAAROOF_URL || '',
  },
} as const;

/** هل ضُبطت بيانات التواصل الحقيقية؟ تُستعمل في فحص ما قبل الإطلاق. */
export const usingPlaceholderContact =
  !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || !process.env.CONTACT_EMAIL;

export type Locale = 'ar' | 'en';

export const LANG_COOKIE = 'athar_lang';

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === 'en' ? 'en' : 'ar';
}
