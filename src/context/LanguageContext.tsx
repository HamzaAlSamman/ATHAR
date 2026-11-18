'use client';

import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { translations } from '@/locales/translations';
import { LANG_COOKIE, type Locale } from '@/lib/config';
import { localePath, stripLocale } from '@/lib/i18n';

interface LanguageContextType {
  lang: Locale;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  t: <T = string>(key: string) => T;
  /** يحوّل مساراً داخلياً لمسار بلغة الصفحة الحالية: path('/pricing') → '/ar/pricing'. */
  path: (href?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const persistLang = (value: Locale) => {
  // الكوكي يجعل الروابط بدون لغة (/pricing) تفتح باللغة التي اختارها الزائر آخر مرة.
  document.cookie = `${LANG_COOKIE}=${value};path=/;max-age=31536000;samesite=lax`;
};

// اللغة مصدرها الرابط (/ar أو /en)، فالخادم يرسم الصفحة باللغة الصحيحة من أول طلب.
export const LanguageProvider: React.FC<{ children: React.ReactNode; lang: Locale }> = ({ children, lang }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    persistLang(lang);
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    const next: Locale = lang === 'ar' ? 'en' : 'ar';
    persistLang(next);
    const query = typeof window === 'undefined' ? '' : window.location.search;
    router.push(`${localePath(next, stripLocale(pathname ?? '/'))}${query}`);
  }, [lang, pathname, router]);

  const t = useCallback(
    <T = string,>(key: string): T => {
      let current: unknown = translations[lang];
      for (const k of key.split('.')) {
        if (current === null || typeof current !== 'object' || !(k in current)) return key as T;
        current = (current as Record<string, unknown>)[k];
      }
      return current as T;
    },
    [lang]
  );

  const path = useCallback((href = '/') => localePath(lang, href), [lang]);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t, path }}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
