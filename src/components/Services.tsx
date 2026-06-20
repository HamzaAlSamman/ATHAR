'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Services.module.css';

export default function Services() {
  const { t } = useLanguage();

  const servicesData = [
    {
      key: 'web',
      num: '01',
    },
    {
      key: 'stores',
      num: '02',
    },
    {
      key: 'seo',
      num: '03',
    },
    {
      key: 'uiux',
      num: '04',
    }
  ];

  return (
    <section id="services" className={styles.services}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('services.title')}</h2>
          <p className={styles.subtitle}>{t('services.subtitle')}</p>
        </div>

        {/* شبكة الخدمات */}
        <div className={styles.grid}>
          {servicesData.map((service) => {
            const features = t<string[]>(`services.${service.key}.features`);
            
            return (
              <div key={service.key} className={styles.card}>
                <div className={styles.iconWrapper}>
                  {service.num}
                </div>
                <h3 className={styles.cardTitle}>
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className={styles.cardDesc}>
                  {t(`services.${service.key}.desc`)}
                </p>
                <ul className={styles.featuresList}>
                  {Array.isArray(features) && features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.bullet}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
