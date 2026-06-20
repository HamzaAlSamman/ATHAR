'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Pricing.module.css';

export default function Pricing() {
  const { t, lang } = useLanguage();

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

  const handleSelectPlan = (planKey: string, planTitle: string) => {
    // إرسال حدث لتعبئة الحقول
    const details = lang === 'ar'
      ? `أرغب في الاستفسار عن باقة: ${planTitle}`
      : `I want to inquire about package: ${planTitle}`;

    const event = new CustomEvent('athar_estimate_selected', {
      detail: { projectType: planKey === 'basic' ? 'web' : 'store', details }
    });
    window.dispatchEvent(event);

    // التمرير التلقائي لنموذج الاتصال
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
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
                  <div className={styles.price}>
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
