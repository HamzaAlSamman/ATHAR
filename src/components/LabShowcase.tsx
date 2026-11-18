'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './LabShowcase.module.css';

// القسم الثانوي: أداة الفحص كدليل على ما نبرمجه، وباب لأصحاب المواقع القائمة.
const TEXT = {
  ar: {
    eyebrow: 'من برمجتنا',
    title: 'مختبر أثر: أداة فحص مواقع بنيناها بأنفسنا',
    text: 'محرّك يجري 37 فحصاً حقيقياً على أي موقع خلال ثوانٍ: السرعة، شهادة التشفير وترويسات الأمان، وإعدادات الظهور في غوغل. جرّبه على موقعك الحالي، والفحص مجاني.',
    label: 'رابط موقعك',
    cta: 'افحص موقعي',
    fixes: 'عندك مشاكل في موقعك الحالي؟ باقات الإصلاح بسعر ثابت',
  },
  en: {
    eyebrow: 'Built by us',
    title: 'ATHR Lab: a website audit tool we built ourselves',
    text: 'An engine that runs 37 real checks on any site in seconds: speed, TLS certificate and security headers, and Google visibility settings. Try it on your current site, free.',
    label: 'Your website',
    cta: 'Audit my site',
    fixes: 'Problems on your current site? Fixed-price fix packages',
  },
} as const;

export default function LabShowcase() {
  const { lang, path } = useLanguage();
  const router = useRouter();
  const ui = TEXT[lang];
  const [url, setUrl] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = url.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    if (!target) return;
    router.push(`${path('/tech-lab')}?url=${encodeURIComponent(target)}`);
  };

  return (
    <section className={styles.section} aria-labelledby="lab-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>{ui.eyebrow}</span>
          <h2 id="lab-title" className={styles.title}>
            {ui.title}
          </h2>
          <p className={styles.desc}>{ui.text}</p>
          <Link href={`${path('/pricing')}#packages`} className={styles.fixLink}>
            {ui.fixes}
          </Link>
        </div>
        <form className={styles.form} onSubmit={submit}>
          <label htmlFor="lab-url" className={styles.label}>
            {ui.label}
          </label>
          <div className={styles.inputWrap}>
            <span aria-hidden="true">https://</span>
            <input
              id="lab-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              dir="ltr"
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.cta}>
            {ui.cta}
          </button>
        </form>
      </div>
    </section>
  );
}
