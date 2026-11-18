'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { services } from '@/content/services';
import styles from './services.module.css';

const TEXT = {
  ar: {
    tagline: 'خدمات البرمجة',
    title: 'نبرمج ما يحتاجه شغلك، من الموقع إلى التطبيق',
    subtitle: 'فريق واحد للتصميم والبرمجة والنشر. تعرف السعر قبل أن نبدأ، والكود ملكك بعد التسليم.',
    examples: 'أمثلة على ما نبنيه',
    includes: 'ماذا يشمل',
    from: 'يبدأ من {price} دولار',
    quote: 'سعر ثابت بعد جلسة تحديد النطاق',
    request: 'اطلب عرض سعر',
    ctaTitle: 'عندك فكرة ولا تعرف من أين تبدأ؟',
    ctaDesc: 'احكِ لنا عنها في جلسة مجانية، ونرجع لك بأبسط حل يحققها وبسعر ثابت.',
    ctaBtn: 'احجز الجلسة المجانية',
  },
  en: {
    tagline: 'Software services',
    title: 'We build what your business needs, from website to app',
    subtitle: 'One team for design, development and launch. You know the price before we start, and the code is yours after delivery.',
    examples: 'Examples of what we build',
    includes: "What's included",
    from: 'From ${price}',
    quote: 'Fixed price after a scoping session',
    request: 'Get a quote',
    ctaTitle: 'Have an idea but not sure where to start?',
    ctaDesc: 'Tell us about it in a free session, and we come back with the simplest solution and a fixed price.',
    ctaBtn: 'Book the free session',
  },
} as const;

export default function ServicesPageContent() {
  const { lang, path } = useLanguage();
  const ui = TEXT[lang];

  return (
    <div className={styles.servicesPage}>
      <Header />

      <main style={{ flex: '1 0 auto', paddingTop: '80px' }}>
        <section className={styles.heroSection}>
          <div className={styles.glowOrb}></div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.tagline}>{ui.tagline}</span>
            <h1 className={styles.title}>{ui.title}</h1>
            <p className={styles.subtitle}>{ui.subtitle}</p>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className={`container ${styles.servicesGrid}`}>
            {services.map((service) => (
              <article key={service.id} id={service.id} className={styles.serviceDetailCard}>
                <div className={styles.serviceInfo}>
                  <h2>{service.title[lang]}</h2>
                  <p className={styles.serviceDesc}>{service.long[lang]}</p>
                  <h3 className={styles.featuresTitle}>{ui.examples}</h3>
                  <ul className={styles.featuresList}>
                    {service.examples[lang].map((item) => (
                      <li key={item} className={styles.featureItem}>
                        <span className={styles.featureCheckDot}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.techBadgeRow}>
                    {service.tech.map((tech) => (
                      <span key={tech} className={styles.techBadge} dir="ltr">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.featuresWrapper}>
                  <h3 className={styles.featuresTitle}>{ui.includes}</h3>
                  <ul className={styles.featuresList}>
                    {service.includes[lang].map((item) => (
                      <li key={item} className={styles.featureItem}>
                        <span className={styles.featureCheckDot}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={styles.priceLine}>
                    {service.from ? ui.from.replace('{price}', String(service.from)) : ui.quote}
                  </p>
                  <Link href={`${path('/contact')}?service=${service.id}`} className={styles.requestBtn}>
                    {ui.request}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>{ui.ctaTitle}</h2>
              <p className={styles.ctaDesc}>{ui.ctaDesc}</p>
              <Link href={path('/contact')} className={styles.ctaBtn}>
                {ui.ctaBtn}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
