'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './HowItWorks.module.css';

const TEXT = {
  ar: {
    title: 'كيف نشتغل',
    steps: [
      { title: 'نفهم فكرتك', text: 'جلسة مجانية نسمع فيها ما تحتاجه ونقترح أبسط حل يحققه.' },
      { title: 'سعر وخطة مكتوبة', text: 'نطاق العمل والسعر الثابت ومواعيد التسليم على ورقة قبل أي دفعة.' },
      { title: 'نبرمج وتتابع', text: 'نسخة تجريبية تفتحها كل أسبوع وترى التقدم بنفسك.' },
      { title: 'نطلق ونبقى معك', text: 'نشر، تدريب فريقك، ودعم بعد الإطلاق أو اشتراك رعاية شهري.' },
    ],
    cta: 'احجز الجلسة المجانية',
  },
  en: {
    title: 'How we work',
    steps: [
      { title: 'We understand your idea', text: 'A free session to hear what you need and suggest the simplest solution that gets there.' },
      { title: 'Written plan and price', text: 'Scope, fixed price and delivery dates in writing before any payment.' },
      { title: 'We build, you follow', text: 'A test version you can open every week to see progress yourself.' },
      { title: 'Launch and support', text: 'Deployment, team training, and support after launch or a monthly care plan.' },
    ],
    cta: 'Book the free session',
  },
} as const;

export default function HowItWorks() {
  const { lang, path } = useLanguage();
  const ui = TEXT[lang];

  return (
    <section className={styles.section} aria-labelledby="how-title">
      <div className="container">
        <h2 id="how-title" className={styles.title}>
          {ui.title}
        </h2>
        <ol className={styles.steps}>
          {ui.steps.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.num} aria-hidden="true">
                {i + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.ctaRow}>
          <Link href={path('/contact')} className={styles.cta}>
            {ui.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
