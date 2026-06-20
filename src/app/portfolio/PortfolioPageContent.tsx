'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import styles from "./portfolio.module.css";

export default function PortfolioPageContent() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const methodologySteps = [
    {
      num: '01',
      titleAr: 'الهندسة السلكية',
      subAr: 'Wireframing',
      titleEn: 'UX Wireframing',
      descAr: 'تخطيط وتوزيع العناصر وهندسة تجربة تضمن سهولة تدفق الزوار.',
      descEn: 'Structuring layout elements to guarantee smooth user flows.'
    },
    {
      num: '02',
      titleAr: 'التصميم التفاعلي',
      subAr: 'UI Art',
      titleEn: 'Bespoke UI Design',
      descAr: 'تصميم واجهات بصرية حصرية جريئة تتماشى تماماً مع الهوية البصرية.',
      descEn: 'Designing custom visual interfaces matching visual guidelines.'
    },
    {
      num: '03',
      titleAr: 'البرمجة النظيفة',
      subAr: 'Bespoke Code',
      titleEn: 'Clean Development',
      descAr: 'برمجة الأكواد وهندستها يدوياً باستخدام Next.js دون الاعتماد على قوالب جاهزة.',
      descEn: 'Bespoke software development on Next.js with zero template dependencies.'
    },
    {
      num: '04',
      titleAr: 'تحسين السرعة والسيو',
      subAr: 'Performance',
      titleEn: 'Performance & SEO Tune',
      descAr: 'تهيئة كاملة لسرعة تحميل sub-1.2s وضغط الصور ورفع مقاييس جوجل لـ 100%.',
      descEn: 'Optimizing web vitals to secure sub-1.2s loads and 100% Core Web Vitals.'
    },
    {
      num: '05',
      titleAr: 'الإطلاق والدعم',
      subAr: 'Launch',
      titleEn: 'Deployment & Support',
      descAr: 'إطلاق الموقع ومراقبته على الاستضافة السحابية مع تقديم دعم فني مستمر وحماية.',
      descEn: 'Hosting setup, cloud deployment, ongoing security checks and support.'
    }
  ];

  return (
    <div className={styles.portfolioPage}>
      <Header />

      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.glowOrb}></div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.tagline}>
              {lang === 'ar' ? 'سجل الإنجازات' : 'Our Track Record'}
            </span>
            <h1 className={styles.title}>
              {lang === 'ar' ? 'مشاريع بنيناها لتترك أثراً وتزيد النمو' : 'Projects Built to Leave an Imprint & Drive Growth'}
            </h1>
            <p className={styles.subtitle}>
              {t('portfolio.subtitle')}
            </p>
          </div>
        </section>

        {/* Portfolio Showcase Grid (reuse core interactive tabs component) */}
        <section className={styles.portfolioSection}>
          <Portfolio />
        </section>

        {/* Project Methodology */}
        <section className={styles.methodologySection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{lang === 'ar' ? 'منهجية أثر البرمجية لتنفيذ المشاريع' : 'Athar’s Software Project Methodology'}</h2>
              <p>{lang === 'ar' ? 'خطوات عمل صارمة ودقيقة تضمن جودة الأكواد وسرعة استجابتها' : 'Strict, detailed processes ensuring code quality and blazing response speeds'}</p>
            </div>
            
            <div className={styles.methodologyGrid}>
              {methodologySteps.map((step, idx) => (
                <div key={idx} className={styles.methodologyCard}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <h3 className={styles.stepTitle}>
                    {lang === 'ar' ? (
                      <>
                        <span className={styles.mainTitleText}>{step.titleAr}</span>
                        <span className={styles.stepSubTitle}>({step.subAr})</span>
                      </>
                    ) : (
                      step.titleEn
                    )}
                  </h3>
                  <p className={styles.stepDesc}>{lang === 'ar' ? step.descAr : step.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>
                {lang === 'ar' ? 'هل تريد أن يكون مشروعك قصة نجاحنا القادمة؟' : 'Want Your Project to Be Our Next Success Story?'}
              </h2>
              <p className={styles.ctaDesc}>
                {lang === 'ar' 
                  ? 'سواء كنت تريد بناء موقعك التعريفي من الصفر أو إطلاق متجر إلكتروني بميزات معقدة، نحن هنا لمساعدتك على التفوق.'
                  : 'Let’s construct a digital asset that drives customer conversion metrics and represents your brand authority.'}
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
