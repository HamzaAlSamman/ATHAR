'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Trust.module.css';

export default function Trust() {
  const { t, lang } = useLanguage();

  return (
    <section className={styles.trust}>
      <div className={`container ${styles.trustGrid}`}>
        
        {/* العمود الأيسر: الوصف والشهادة الأمنية */}
        <div className={styles.leftCol}>
          <h2 className={styles.title}>{t('trust.title')}</h2>
          <p className={styles.desc}>{t('trust.subtitle')}</p>
          
          <div className={styles.certifiedCard}>
            <h4 className={styles.certTitle}>
              <span>🛡️</span> {t('trust.certTitle')}
            </h4>
            <p className={styles.certText}>{t('trust.certText')}</p>
          </div>
        </div>

        {/* العمود الأيمن: أرقام السجلات الرسمية وتوثيق المنصات */}
        <div className={styles.rightCol}>
          <div className={styles.registryRow}>
            <span className={styles.regLabel}>{t('trust.regLabel')}</span>
            <span className={styles.regVal}>
              {lang === 'ar' ? '١٠١٠٨٧٤٥٣٠' : '1010874530'}
            </span>
          </div>

          <div className={styles.registryRow}>
            <span className={styles.regLabel}>{t('trust.knownLabel')}</span>
            <span className={styles.platformBadge}>
              {lang === 'ar' ? 'موثوق / معروف' : 'Mauthooq Certified'}
            </span>
          </div>

          <div className={styles.registryRow}>
            <span className={styles.regLabel}>{lang === 'ar' ? 'الترخيص التقني:' : 'Tech Licensing:'}</span>
            <span className={styles.regVal}>
              ATHR-2026-X
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
