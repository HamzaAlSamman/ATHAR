'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import styles from "./services.module.css";

export default function ServicesPageContent() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const servicesDetails = [
    {
      id: 'web',
      titleAr: 'تصميم وتطوير المواقع الفاخرة',
      titleEn: 'Bespoke Premium Web Development',
      descAr: 'نقوم ببرمجة وهندسة مواقع مخصصة للشركات والمنصات تعكس هيبتها التجارية وتوفر أداءً خارقاً يعتمد على البرمجة الخاصة الكاملة دون القوالب الجاهزة.',
      descEn: 'We engineer bespoke digital platforms and corporate sites that elevate your brand reputation, featuring full-scale custom code with zero template dependency.',
      tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel'],
      featuresAr: [
        'تصميم واجهات وتجربة مستخدم حصرية من الصفر',
        'برمجة خفيفة سريعة التحميل بأقل من 1.2 ثانية',
        'أكواد نظيفة مهندسة لسهولة التوسع والتطوير مستقبلاً',
        'ربط لوحات تحكم ديناميكية وسهلة التعديل والتحكم',
        'تكامل كامل مع خدمات جوجل التحليلية وتتبع الأداء'
      ],
      featuresEn: [
        '100% custom UI/UX design crafted from scratch',
        'Lightweight, high-speed architectures with <1.2s loads',
        'Clean code architectures optimized for future scalability',
        'Intuitive, easy-to-use CMS control dashboards',
        'Native analytics integration and pixel triggers'
      ]
    },
    {
      id: 'stores',
      titleAr: 'تصميم وبرمجة المتاجر الإلكترونية',
      titleEn: 'Conversion-Optimized E-commerce Stores',
      descAr: 'متاجر ذكية مهيأة للبيع تضمن تجربة شراء سريعة خالية من الأخطاء لرفع معدلات التحويل وزيادة الأرباح، سواء كانت برمجة خاصة أو تخصيص منصات.',
      descEn: 'High-conversion retail and wholesale web shops structured to secure purchases and elevate sales revenues across regional GCC markets.',
      tech: ['Next.js', 'Shopify Liquid', 'Salla CSS', 'Zid APIs', 'Tailwind', 'Stripe'],
      featuresAr: [
        'ربط بوابات الدفع الإلكتروني (مدى، أبل باي، فيزا)',
        'تحسين رحلة الشراء (CRO) لتقليل السلال المتروكة',
        'ربط مؤتمت بالكامل مع شركات الشحن والتوصيل',
        'نظام إدارة مخازن متطور يدعم التنبيهات الفورية',
        'تصميم متجاوب بالكامل وسهل التصفح عبر الهواتف'
      ],
      featuresEn: [
        'Instant integration of regional gateways (Mada, Apple Pay)',
        'Checkout optimization (CRO) reducing cart abandonments',
        'Automated logistics integration with shipping carriers',
        'Advanced inventory sync and instant stock notifications',
        'Seamless mobile layouts engineered for checkout speed'
      ]
    },
    {
      id: 'seo',
      titleAr: 'تحسين محركات البحث وتصدر جوجل (SEO)',
      titleEn: 'Advanced Technical SEO & Google Search Ranking',
      descAr: 'نهيئ موقعك فنيّاً وتيبوغرافيّاً للزحف السريع والترتيب المتقدم في محركات البحث لجلب عملاء مهتمين بمنتجاتك وخدماتك مجاناً وبشكل عضوي.',
      descEn: 'Optimize your technical site schemas and keywords to ensure rapid indexing and high organic placements on search result pages.',
      tech: ['Schema JSON-LD', 'Google Search Console', 'Sitemaps XML', 'Robots.txt', 'Core Web Vitals'],
      featuresAr: [
        'تحليل شامل ومنافس للكلمات المفتاحية الأكثر ربحية',
        'تهيئة الأكواد الفنية وهندسة العناوين والأوسمة الميتا',
        'بناء خرائط الموقع وتوجيه عناكب جوجل الفوري',
        'رفع كفاءة ومقاييس الويب الحيوية (Core Web Vitals)',
        'تقارير أداء شهرية واضحة عن الكلمات المتصدرة'
      ],
      featuresEn: [
        'Profitable keyword gap analysis and search intent research',
        'Bespoke technical code tuning, structured data JSON-LD',
        'Automated XML sitemaps generation and search crawls',
        'Optimizing Core Web Vitals to clear search algorithm audits',
        'Transparent monthly keyword performance reports'
      ]
    },
    {
      id: 'uiux',
      titleAr: 'تصميم واجهات وتجربة المستخدم (UI/UX)',
      titleEn: 'Premium UI/UX Artistry & Figma Prototyping',
      descAr: 'نقوم بدراسة رحلة المستخدم وتصميم واجهات بصرية مدهشة تعكس فخامة علامتك التجارية وتضمن تصفحاً مريحاً يزيد من معدلات التفاعل والإغلاق.',
      descEn: 'We research visual patterns and layout user pathways that showcase your premium branding and drive engagement metrics.',
      tech: ['Figma', 'Interactive Prototypes', 'Design Systems', 'Wireframing', 'Typography Grid'],
      featuresAr: [
        'تخطيط هيكلي كامل لرحلة المستخدم (Wireframing)',
        'تصميم واجهات مستخدم بصرية وتفاعلية فاخرة (UI)',
        'اختبار سهولة وقابلية الاستخدام للمستهلك الفعلي',
        'بناء لغة تصميم ونظام موحد للعلامة (Design System)',
        'تسليم ملفات Figma كاملة ومهيأة للمطورين'
      ],
      featuresEn: [
        'User journey wireframing and interactive flow map layout',
        'Bold, high-fidelity visual interface designs (UI)',
        'Rapid usability testing and consumer behavior checks',
        'Component libraries and cohesive design systems',
        'Developer-ready Figma blueprints and styling tokens'
      ]
    }
  ];

  return (
    <div className={styles.servicesPage}>
      <Header />

      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.glowOrb}></div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.tagline}>
              {lang === 'ar' ? 'ماذا نصنع في أثر؟' : 'What We Craft at Athar'}
            </span>
            <h1 className={styles.title}>
              {lang === 'ar' ? 'حلول رقمية مهندسة لنمو استثمارك' : 'Engineered Digital Solutions for Investment Growth'}
            </h1>
            <p className={styles.subtitle}>
              {t('services.subtitle')}
            </p>
          </div>
        </section>

        {/* Detailed Grid Section */}
        <section className={styles.gridSection}>
          <div className={`container ${styles.servicesGrid}`}>
            {servicesDetails.map((service, idx) => (
              <div key={idx} className={styles.serviceDetailCard}>
                <div className={styles.serviceInfo}>
                  <h2>{lang === 'ar' ? service.titleAr : service.titleEn}</h2>
                  <p className={styles.serviceDesc}>
                    {lang === 'ar' ? service.descAr : service.descEn}
                  </p>
                  
                  <div className={styles.techBadgeRow}>
                    {service.tech.map((t, i) => (
                      <span key={i} className={styles.techBadge}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.featuresWrapper}>
                  <h3 className={styles.featuresTitle}>
                    {lang === 'ar' ? 'ماذا تشمل الخدمة؟' : 'What is Included?'}
                  </h3>
                  <ul className={styles.featuresList}>
                    {(lang === 'ar' ? service.featuresAr : service.featuresEn).map((feat, i) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.featureCheckDot}></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>
                {lang === 'ar' ? 'هل أنت جاهز لبدء مشروعك معنا؟' : 'Ready to Launch Your Custom Project?'}
              </h2>
              <p className={styles.ctaDesc}>
                {lang === 'ar' 
                  ? 'سواء كنت تريد بناء موقعك التعريفي من الصفر أو إطلاق متجر إلكتروني بميزات معقدة، نحن هنا لمساعدتك على التفوق.'
                  : 'Whether you need a custom corporate platform built from scratch or a scaling e-store, our team is equipped to deliver.'}
              </p>
              <button 
                onClick={() => router.push('/contact')}
                className={styles.ctaBtn}
              >
                {t('hero.cta')}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
