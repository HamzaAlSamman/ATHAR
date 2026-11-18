'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/content/services';
import styles from './Services.module.css';

const TEXT = {
  ar: {
    title: 'ماذا نبرمج',
    subtitle: 'أربعة مجالات، فريق واحد يتولى المشروع من الفكرة إلى الإطلاق.',
    from: 'يبدأ من {price} دولار',
    quote: 'سعر ثابت بعد تحديد النطاق',
    more: 'التفاصيل',
  },
  en: {
    title: 'What we build',
    subtitle: 'Four areas, one team that takes your project from idea to launch.',
    from: 'From ${price}',
    quote: 'Fixed price after scoping',
    more: 'Details',
  },
} as const;

export default function Services() {
  const { lang, path } = useLanguage();
  const ui = TEXT[lang];

  return (
    <section id="services" className={styles.services}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{ui.title}</h2>
          <p className={styles.subtitle}>{ui.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {services.map((service, i) => (
            <article key={service.id} className={styles.card}>
              <div className={styles.iconWrapper}>{String(i + 1).padStart(2, '0')}</div>
              <h3 className={styles.cardTitle}>{service.title[lang]}</h3>
              <p className={styles.cardDesc}>{service.short[lang]}</p>
              <ul className={styles.featuresList}>
                {service.examples[lang].map((example) => (
                  <li key={example} className={styles.featureItem}>
                    <span className={styles.bullet}>✓</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.cardFooter}>
                <span className={styles.price}>
                  {service.from ? ui.from.replace('{price}', String(service.from)) : ui.quote}
                </span>
                <Link href={`${path('/services')}#${service.id}`} className={styles.more}>
                  {ui.more}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
