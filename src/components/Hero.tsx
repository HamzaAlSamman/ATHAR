'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

const TEXT = {
  ar: {
    tag: 'شركة برمجة · مواقع، أنظمة، تطبيقات جوال',
    title: 'نبرمج فكرتك: موقع، نظام، أو تطبيق جوال يشتغل من أول يوم',
    subtitle:
      'من موقع شركتك إلى نظام يدير حجوزاتك وزبائنك، إلى تطبيق على آيفون وأندرويد. سعر ثابت قبل أن نبدأ، والكود ملكك بالكامل.',
    cta: 'اطلب عرض سعر',
    secondary: 'شاهد ما نبرمجه',
    auditLink: 'عندك موقع؟ افحصه مجاناً',
    facts: [
      { value: 'ويب · جوال · ذكاء', label: 'نبرمج من الواجهة إلى الخادم' },
      { value: 'سعر ثابت', label: 'تعرفه قبل أن نبدأ' },
      { value: '100%', label: 'الكود والتصاميم ملكك' },
    ],
    app: 'لوحة الحجوزات',
    rows: ['حجز جديد · 10:30', 'دفعة مستلمة · 45$', 'زبون جديد'],
    phone: 'طلبك في الطريق',
  },
  en: {
    tag: 'Software studio · Websites, systems, mobile apps',
    title: 'We build your idea: a website, a system or a mobile app that works from day one',
    subtitle:
      'From your company website to a system that runs your bookings and customers, to an app on iPhone and Android. A fixed price before we start, and the code is fully yours.',
    cta: 'Get a quote',
    secondary: 'See what we build',
    auditLink: 'Have a site? Audit it for free',
    facts: [
      { value: 'Web · Mobile · AI', label: 'front end to back end' },
      { value: 'Fixed price', label: 'known before we start' },
      { value: '100%', label: 'code and designs are yours' },
    ],
    app: 'Bookings dashboard',
    rows: ['New booking · 10:30', 'Payment received · $45', 'New customer'],
    phone: 'Your order is on the way',
  },
} as const;

const BARS = [42, 64, 50, 78, 60, 88, 72];

export default function Hero() {
  const { lang, path } = useLanguage();
  const ui = TEXT[lang];

  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.textSide}>
          <p className={styles.tagline}>{ui.tag}</p>
          <h1 className={styles.title}>{ui.title}</h1>
          <p className={styles.subtitle}>{ui.subtitle}</p>

          <div className={styles.ctas}>
            <Link href={path('/contact')} className={styles.primaryCta}>
              {ui.cta}
            </Link>
            <Link href={path('/services')} className={styles.secondaryCta}>
              {ui.secondary}
            </Link>
          </div>

          <Link href={path('/tech-lab')} className={styles.auditLink}>
            {ui.auditLink}
          </Link>

          <dl className={styles.statsRow}>
            {ui.facts.map((fact) => (
              <div key={fact.label} className={styles.statItem}>
                <dt className={styles.statLbl}>{fact.label}</dt>
                <dd className={styles.statVal}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* لوحة نظام وتطبيق جوال توضيحيان: يريان الزائر نوع ما نبرمجه. */}
        <div className={styles.visualSide} aria-hidden="true">
          <div className={styles.appWindow}>
            <div className={styles.appBar}>
              <span />
              <span />
              <span />
              <strong>{ui.app}</strong>
            </div>
            <div className={styles.appBody}>
              <div className={styles.chart}>
                {BARS.map((h, i) => (
                  <i key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
              <ul className={styles.rows}>
                {ui.rows.map((row) => (
                  <li key={row}>
                    <b />
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.phone}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneCard}>
              <span className={styles.phoneDot} />
              {ui.phone}
            </div>
            <div className={styles.phoneLines}>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
