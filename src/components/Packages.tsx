'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { carePlan, fixPackages, formatPrice, type FixPackage } from '@/content/packages';
import { savePrefill } from '@/lib/prefill';
import styles from './Packages.module.css';

const TEXT = {
  ar: {
    eyebrow: 'لموقعك الحالي',
    title: 'عندك موقع قائم؟ نحسّنه بسعر ثابت',
    subtitle: 'افحص موقعك مجاناً في مختبرنا، ثم اختر ما يعالج نتيجتك.',
    days: 'التسليم خلال {days} أيام عمل',
    choose: 'اطلب هذه الباقة',
    featured: 'الأوفر',
    careEyebrow: 'بعد الإصلاح',
    careChoose: 'اشترك الآن',
    note: 'الأسعار لموقع واحد حتى 20 صفحة. المتاجر والمواقع الأكبر نعطيك سعرها الثابت بعد الفحص.',
  },
  en: {
    eyebrow: 'For your current site',
    title: 'Already have a site? We improve it at a fixed price',
    subtitle: 'Audit your site free in our lab, then pick what fixes your result.',
    days: 'Delivered in {days} business days',
    choose: 'Choose this package',
    featured: 'Best value',
    careEyebrow: 'After the fix',
    careChoose: 'Subscribe',
    note: 'Prices are for one website up to 20 pages. For stores and larger sites we quote a fixed price after the audit.',
  },
} as const;

export default function Packages() {
  const { lang, path } = useLanguage();
  const router = useRouter();
  const ui = TEXT[lang];

  const choose = (pkg: FixPackage) => {
    savePrefill({ packageId: pkg.id });
    router.push(path('/contact'));
  };

  return (
    <section id="packages" className={styles.section} aria-labelledby="packages-title">
      <div className="container">
        <header className={styles.header}>
          <span className={styles.eyebrow}>{ui.eyebrow}</span>
          <h2 id="packages-title" className={styles.title}>
            {ui.title}
          </h2>
          <p className={styles.subtitle}>{ui.subtitle}</p>
        </header>

        <ul className={styles.grid}>
          {fixPackages.map((pkg) => (
            <li key={pkg.id} className={`${styles.card} ${pkg.featured ? styles.featured : ''}`}>
              {pkg.featured && <span className={styles.badge}>{ui.featured}</span>}
              <h3 className={styles.cardTitle}>{pkg.title[lang]}</h3>
              <p className={styles.pitch}>{pkg.pitch[lang]}</p>
              <p className={styles.price}>{formatPrice(pkg, lang)}</p>
              {pkg.days && <p className={styles.days}>{ui.days.replace('{days}', String(pkg.days))}</p>}
              <ul className={styles.includes}>
                {pkg.includes[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button type="button" className={styles.cta} onClick={() => choose(pkg)}>
                {ui.choose}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.care}>
          <div className={styles.careText}>
            <span className={styles.eyebrow}>{ui.careEyebrow}</span>
            <h3 className={styles.cardTitle}>{carePlan.title[lang]}</h3>
            <p className={styles.pitch}>{carePlan.pitch[lang]}</p>
            <ul className={styles.careList}>
              {carePlan.includes[lang].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.careAction}>
            <p className={styles.carePrice}>{formatPrice(carePlan, lang)}</p>
            <button type="button" className={styles.careCta} onClick={() => choose(carePlan)}>
              {ui.careChoose}
            </button>
          </div>
        </div>

        <p className={styles.note}>{ui.note}</p>
      </div>
    </section>
  );
}
