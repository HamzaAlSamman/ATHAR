'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { savePrefill } from '@/lib/prefill';
import styles from './Pricing.module.css';

export default function Pricing() {
  const { t, lang, path } = useLanguage();
  const router = useRouter();

  const plans = [
    {
      key: 'basic',
      isPopular: false,
    },
    {
      key: 'pro',
      isPopular: true,
    },
    {
      key: 'enterprise',
      isPopular: false,
    }
  ];

  // باقات البناء تفتح نموذج التواصل معبّأً باسم الباقة (النموذج في صفحة مستقلة).
  const handleSelectPlan = (planKey: string, planTitle: string) => {
    const details = lang === 'ar'
      ? `أرغب في الاستفسار عن باقة: ${planTitle}`
      : `I want to inquire about package: ${planTitle}`;
    savePrefill({ requestType: planKey === 'basic' ? 'web' : planKey === 'pro' ? 'store' : 'other', details });
    router.push(path('/contact'));
  };

  return (
    <section id="pricing" className={styles.pricing}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('pricing.title')}</h2>
          <p className={styles.subtitle}>{t('pricing.subtitle')}</p>
        </div>

        {/* شبكة الباقات */}
        <div className={styles.grid}>
          {plans.map((plan) => {
            const planTitle = t(`pricing.${plan.key}.title`) as string;
            const price = t(`pricing.${plan.key}.price`) as string;
            const currency = t(`pricing.${plan.key}.currency`) as string;
            const features = t<string[]>(`pricing.${plan.key}.features`);
            const btnText = t(`pricing.${plan.key}.btn`) as string;

            return (
              <div 
                key={plan.key} 
                className={`${styles.card} ${plan.isPopular ? styles.popularCard : ''}`}
              >
                {plan.isPopular && (
                  <span className={styles.badge}>
                    {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
                  </span>
                )}
                
                <h3 className={styles.planTitle}>{planTitle}</h3>
                <p className={styles.planDesc}>{t(`pricing.${plan.key}.desc`)}</p>

                <div className={styles.priceWrapper}>
                  <div className={`${styles.price} ${/^\d/.test(price) ? '' : styles.priceText}`}>
                    <span>{price}</span>
                    <span className={styles.currency}>{currency}</span>
                  </div>
                </div>

                <ul className={styles.featuresList}>
                  {Array.isArray(features) && features.map((feat, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`${styles.ctaBtn} ${plan.isPopular ? styles.popularCtaBtn : ''}`}
                  onClick={() => handleSelectPlan(plan.key, planTitle)}
                  id={`pricing-cta-${plan.key}`}
                >
                  {btnText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
