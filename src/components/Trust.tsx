'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/config';
import styles from './Trust.module.css';

// قسم الموثوقية يظهر فقط حين تُضبط بيانات قانونية حقيقية (NEXT_PUBLIC_CR_NUMBER).
// عرض رقم سجل أو توثيق غير صحيح يضر بالثقة ويعرّض للمساءلة، فلا نعرض أي قيمة افتراضية.
export default function Trust() {
  const { t, lang } = useLanguage();
  const { crNumber, maaroofUrl } = siteConfig.legal;
  if (!crNumber) return null;

  return (
    <section className={styles.trust}>
      <div className={`container ${styles.trustGrid}`}>
        <div className={styles.leftCol}>
          <h2 className={styles.title}>{t('trust.title')}</h2>
          <p className={styles.desc}>{t('trust.subtitle')}</p>
          <div className={styles.certifiedCard}>
            <h3 className={styles.certTitle}>{t('trust.certTitle')}</h3>
            <p className={styles.certText}>{t('trust.certText')}</p>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.registryRow}>
            <span className={styles.regLabel}>{t('trust.regLabel')}</span>
            <span className={styles.regVal} dir="ltr">
              {crNumber}
            </span>
          </div>
          {maaroofUrl && (
            <div className={styles.registryRow}>
              <span className={styles.regLabel}>{t('trust.knownLabel')}</span>
              <a className={styles.platformBadge} href={maaroofUrl} target="_blank" rel="noopener noreferrer">
                {lang === 'ar' ? 'عرض التوثيق' : 'View verification'}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
