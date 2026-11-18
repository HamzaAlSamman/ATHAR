'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './HowItWorks.module.css';

const TEXT = {
  ar: {
    title: 'ثلاث خطوات من الفحص إلى موقع سليم',
    steps: [
      { title: 'افحص موقعك', text: 'تقرير مجاني خلال ثوانٍ يرتب المشاكل حسب تأثيرها على زوارك ومبيعاتك.' },
      { title: 'اختر الباقة', text: 'التقرير يقترح الباقة المناسبة لنتيجتك، بسعر ثابت ومدة تسليم محددة.' },
      { title: 'نصلح ونثبت', text: 'ننفّذ الإصلاح ثم نعيد الفحص أمامك لترى الفرق بالأرقام.' },
    ],
    cta: 'ابدأ بالفحص المجاني',
  },
  en: {
    title: 'Three steps from audit to a healthy site',
    steps: [
      { title: 'Audit your site', text: 'A free report in seconds, ranking issues by their impact on visitors and sales.' },
      { title: 'Pick a package', text: 'The report suggests the package for your result, with a fixed price and delivery date.' },
      { title: 'We fix and prove it', text: 'We apply the fixes, then re-run the audit so you see the difference in numbers.' },
    ],
    cta: 'Start with the free audit',
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
          <Link href={path('/tech-lab')} className={styles.cta}>
            {ui.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
