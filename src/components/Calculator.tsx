'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Calculator.module.css';

export default function Calculator() {
  const { t, lang } = useLanguage();
  
  const [projectType, setProjectType] = useState<'web' | 'store'>('web');
  const [pages, setPages] = useState<number>(5);
  const [featureSeo, setFeatureSeo] = useState<boolean>(false);
  const [featureLang, setFeatureLang] = useState<boolean>(false);
  const [featurePay, setFeaturePay] = useState<boolean>(false);
  const [featureBlog, setFeatureBlog] = useState<boolean>(false);
  
  // التكلفة والمدة قيم مشتقة من الاختيارات — تُحسب أثناء العرض بدل تخزينها في حالة.
  const { cost, days } = useMemo(() => {
    const isAr = lang === 'ar';

    // قيم التكلفة
    const baseCost = projectType === 'web'
      ? (isAr ? 3000 : 800)
      : (isAr ? 7500 : 2000);

    const extraPagesCost = pages <= 3
      ? 0
      : (pages - 3) * (isAr ? 200 : 50);

    const seoCost = featureSeo ? (isAr ? 1200 : 320) : 0;
    const langCost = featureLang ? (isAr ? 1500 : 400) : 0;
    const payCost = featurePay ? (isAr ? 1500 : 400) : 0;
    const blogCost = featureBlog ? (isAr ? 1000 : 270) : 0;

    const totalCost = baseCost + extraPagesCost + seoCost + langCost + payCost + blogCost;

    // قيم المدة الزمنية بالعمل التقريبي
    const baseDays = projectType === 'web' ? 10 : 20;
    const extraPagesDays = pages <= 3 ? 0 : Math.ceil((pages - 3) * 0.5);
    const seoDays = featureSeo ? 7 : 0;
    const langDays = featureLang ? 5 : 0;
    const payDays = featurePay ? 8 : 0;
    const blogDays = featureBlog ? 4 : 0;

    const totalDays = baseDays + extraPagesDays + seoDays + langDays + payDays + blogDays;

    return { cost: totalCost, days: totalDays };
  }, [projectType, pages, featureSeo, featureLang, featurePay, featureBlog, lang]);

  const handleCTA = () => {
    // صياغة تفاصيل المشروع لإرسالها لنموذج الاتصال
    const details = lang === 'ar' 
      ? `أرغب في تنفيذ مشروع: ${projectType === 'web' ? 'موقع تعريفي' : 'متجر إلكتروني'}، بعدد صفحات: ${pages}. الميزات الإضافية: ${featureSeo ? 'تهيئة السيو، ' : ''}${featureLang ? 'ثنائي اللغة، ' : ''}${featurePay ? 'بوابات الدفع والشحن، ' : ''}${featureBlog ? 'نظام المدونة' : ''}. التكلفة التقديرية: ${cost} ريال سعودي`
      : `I want to execute: ${projectType === 'web' ? 'Corporate Website' : 'E-Store'} with ${pages} pages. Extras: ${featureSeo ? 'SEO, ' : ''}${featureLang ? 'Multilingual, ' : ''}${featurePay ? 'Payments, ' : ''}${featureBlog ? 'CMS Blog' : ''}. Estimate: ${cost} USD`;
    
    // إرسال حدث مخصص للموقع لتعبئة نموذج الاتصال
    const event = new CustomEvent('athar_estimate_selected', { 
      detail: { projectType, details } 
    });
    window.dispatchEvent(event);

    // التمرير السلس لنموذج الاتصال
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
    <section id="calculator" className={styles.calculator}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('calculator.title')}</h2>
          <p className={styles.subtitle}>{t('calculator.subtitle')}</p>
        </div>

        {/* شبكة حاسبة التكلفة */}
        <div className={styles.calcGrid}>
          {/* قسم الخيارات والنماذج */}
          <div className={styles.optionsForm}>
            
            {/* 1. نوع المشروع */}
            <div className={styles.group}>
              <label className={styles.groupLabel}>{t('calculator.typeLabel')}</label>
              <div className={styles.radioGroup}>
                <div 
                  className={`${styles.radioOption} ${projectType === 'web' ? styles.radioOptionActive : ''}`}
                  onClick={() => setProjectType('web')}
                >
                  <input 
                    type="radio" 
                    id="calc-type-web"
                    name="project_type" 
                    checked={projectType === 'web'} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.typeWeb')}</span>
                </div>
                <div 
                  className={`${styles.radioOption} ${projectType === 'store' ? styles.radioOptionActive : ''}`}
                  onClick={() => setProjectType('store')}
                >
                  <input 
                    type="radio" 
                    id="calc-type-store"
                    name="project_type" 
                    checked={projectType === 'store'} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.typeStore')}</span>
                </div>
              </div>
            </div>

            {/* 2. عدد الصفحات */}
            <div className={styles.group}>
              <div className={styles.sliderContainer}>
                <div className={styles.sliderValues}>
                  <span className={styles.groupLabel}>{t('calculator.pagesLabel')}</span>
                  <span style={{ color: 'var(--color-mint)', fontSize: '18px' }}>
                    {pages} {lang === 'ar' ? 'صفحات' : 'pages'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value))}
                  className={styles.slider}
                  id="calc-pages-range"
                />
                <div className={styles.sliderValues} style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-ink-muted)' }}>
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* 3. ميزات إضافية */}
            <div className={styles.group}>
              <label className={styles.groupLabel}>{t('calculator.featuresLabel')}</label>
              <div className={styles.checkboxGrid}>
                <div 
                  className={`${styles.checkboxOption} ${featureSeo ? styles.checkboxOptionActive : ''}`}
                  onClick={() => setFeatureSeo(!featureSeo)}
                >
                  <input 
                    type="checkbox" 
                    id="calc-feat-seo"
                    checked={featureSeo} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.featSEO')}</span>
                </div>
                <div 
                  className={`${styles.checkboxOption} ${featureLang ? styles.checkboxOptionActive : ''}`}
                  onClick={() => setFeatureLang(!featureLang)}
                >
                  <input 
                    type="checkbox" 
                    id="calc-feat-lang"
                    checked={featureLang} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.featLang')}</span>
                </div>
                <div 
                  className={`${styles.checkboxOption} ${featurePay ? styles.checkboxOptionActive : ''}`}
                  onClick={() => setFeaturePay(!featurePay)}
                >
                  <input 
                    type="checkbox" 
                    id="calc-feat-pay"
                    checked={featurePay} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.featPay')}</span>
                </div>
                <div 
                  className={`${styles.checkboxOption} ${featureBlog ? styles.checkboxOptionActive : ''}`}
                  onClick={() => setFeatureBlog(!featureBlog)}
                >
                  <input 
                    type="checkbox" 
                    id="calc-feat-blog"
                    checked={featureBlog} 
                    onChange={() => {}} 
                  />
                  <span>{t('calculator.featBlog')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* قسم النتيجة المعروضة */}
          <div className={styles.resultCard}>
            <h3 className={styles.resultTitle}>{t('calculator.resultTitle')}</h3>
            
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t('calculator.costLabel')}</span>
              <div className={styles.priceVal}>
                <span>{cost.toLocaleString()}</span>
                <span className={styles.priceCurrency}>{lang === 'ar' ? 'ريال سعودي' : 'USD'}</span>
              </div>
            </div>

            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t('calculator.timeLabel')}</span>
              <div className={styles.timeVal}>
                <span>{days}</span>
                <span style={{ fontSize: '15px', marginInlineStart: '6px', fontWeight: '500', color: 'rgba(244, 246, 247, 0.7)' }}>
                  {t('calculator.timeUnit')}
                </span>
              </div>
            </div>

            <button 
              className={styles.resultCta}
              onClick={handleCTA}
              id="calc-cta-submit"
            >
              {t('calculator.btnCTA')}
              <span>🚀</span>
            </button>

            <p className={styles.note}>{t('calculator.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
