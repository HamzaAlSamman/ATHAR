'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/locales/translations';

type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: <T = string>(key: string) => T;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_COOKIE = 'athar_lang';

const persistLang = (value: Language) => {
  try {
    localStorage.setItem(LANG_COOKIE, value);
  } catch {
    /* localStorage may be unavailable */
  }
  // كتابة كوكي ليتمكن الخادم من ضبط اتجاه ولغة <html> قبل أي JS (مهم للـ SEO).
  document.cookie = `${LANG_COOKIE}=${value};path=/;max-age=31536000;samesite=lax`;
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLang?: Language;
}> = ({ children, initialLang = 'ar' }) => {
  const [lang, setLang] = useState<Language>(initialLang);

  useEffect(() => {
    // الخادم يضبط اللغة مسبقاً من الكوكي (initialLang). لا حاجة لأي تغيير إن وُجد تفضيل محفوظ.
    const saved = localStorage.getItem(LANG_COOKIE);
    if (saved === 'ar' || saved === 'en') return;

    // أول زيارة فقط: اكتشف لغة المتصفّح (متاحة على العميل فقط) واحفظها.
    const browserLang = navigator.language.split('-')[0];
    const detected: Language = browserLang === 'en' ? 'en' : 'ar';
    persistLang(detected);
    if (detected !== lang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- اكتشاف لغة المتصفّح يتعذّر إلا بعد الترطيب
      setLang(detected);
    }
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    persistLang(nextLang);
  };

  const t = <T = string,>(key: string): T => {
    const keys = key.split('.');
    let current: unknown = translations[lang];

    for (const k of keys) {
      if (current === null || typeof current !== 'object' || !(k in current)) {
        return key as T; // fallback to key name
      }
      current = (current as Record<string, unknown>)[k];
    }
    return current as T;
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
