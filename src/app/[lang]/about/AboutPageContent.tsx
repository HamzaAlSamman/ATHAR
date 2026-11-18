'use client';

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteSection from "@/components/QuoteSection";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./about.module.css";

export default function AboutPageContent() {
  const { t, lang } = useLanguage();

  const pillarsItems = [
    {
      highlight: 'Speed < 1.2s',
      titleAr: 'الأداء المطلق وسرعة الاستجابة',
      titleEn: 'Absolute Performance & Speed',
      textAr: 'مواقعنا تُبنى لتُحمّل في أقل من 1.2 ثانية. نعتمد على التحميل المسبق الاستاتيكي وتقنيات Next.js لضمان أعلى سرعة ترضي جوجل وتمنع خسارة زوارك.',
      textEn: 'Every platform is optimized for sub-1.2s loading speeds. We leverage static site generation (SSG) to guarantee performance that ranks high on Google.'
    },
    {
      highlight: 'Bespoke UX',
      titleAr: 'تصاميم حصرية بدون أي قوالب',
      titleEn: 'Bespoke UX, Zero Templates',
      textAr: 'نرفض استخدام القوالب الجاهزة أو الووردبريس المستهلك. كل بكسل نضعه يُصمم خصيصاً في Figma ليعكس هوية علامتك التجارية بدقة ويزيد مبيعاتك.',
      textEn: 'We reject ready-made templates. Every interface is designed from scratch in Figma to reflect your brand visual guidelines and boost customer conversions.'
    },
    {
      highlight: 'Pure Code',
      titleAr: 'حماية حديدية وأكواد نظيفة',
      titleEn: 'Enterprise-grade Code Security',
      textAr: 'نلتزم بأعلى معايير الأمن السيبراني. قواعد البيانات والاتصالات تُبنى بطريقة مشفرة بالكامل تمنع سحب البيانات وتوفر جدران حماية برمجية إضافية.',
      textEn: 'We strictly enforce cyber security protocols. Custom APIs and database integrations are encrypted to block vulnerabilities and secure client transactions.'
    }
  ];

  const teamRoles = [
    {
      icon: '01',
      titleAr: 'هندسة الحلول والأنظمة',
      titleEn: 'Solutions & Systems Architecture',
      specAr: 'Next.js / Node.js / Clean Code',
      specEn: 'Next.js / Node.js / Clean Code',
      descAr: 'تصميم هيكلية الأكواد وقواعد البيانات لضمان أعلى سرعة استجابة وأمان تام لا يقبل الاختراق.',
      descEn: 'Architecting robust database structures and application logic for maximum throughput and secure transactions.'
    },
    {
      icon: '02',
      titleAr: 'تصميم الواجهات الفاخرة',
      titleEn: 'Premium UI/UX Artistry',
      specAr: 'Figma / Interactive Prototypes',
      specEn: 'Figma / Interactive Prototypes',
      descAr: 'دراسة سلوك زوار موقعك وبناء واجهات مستخدم بصرية جريئة ومتفرقة تزيد من ثقة العملاء ومعدل التحويل.',
      descEn: 'Studying user behaviors to layout bold visual interfaces that enhance customer trust and optimize conversion rates.'
    },
    {
      icon: '03',
      titleAr: 'تهيئة الظهور وتصدر البحث',
      titleEn: 'Technical SEO Optimization',
      specAr: 'Core Web Vitals / Schema JSON-LD',
      specEn: 'Core Web Vitals / Schema JSON-LD',
      descAr: 'تحسين بنية الموقع التقنية وزحف الروبوتات لضمان تصدر موقعك نتائج جوجل والحصول على عملاء مهتمين مجاناً.',
      descEn: 'Tuning page indexes and schemas to ensure search robots index pages faster, driving organic clients for free.'
    }
  ];

  return (
    <div className={styles.aboutPage}>
      <Header />
      
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        {/* Page Hero Banner */}
        <section className={styles.heroSection}>
          <div className={styles.glowOrb}></div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.tagline}>
              {lang === 'ar' ? 'فلسفة أثر البرمجية' : 'Athar Code Philosophy'}
            </span>
            <h1 className={styles.title}>
              {lang === 'ar' ? 'نحن لا نبني مجرد مواقع، نحن نترك أثراً' : 'We Do Not Just Build Websites, We Leave an Imprint'}
            </h1>
            <p className={styles.subtitle}>
              {t('about.subtitle')}
            </p>
          </div>
        </section>

        {/* Our Story details */}
        <section className={styles.storySection}>
          <div className={`container ${styles.storyGrid}`}>
            <div className={styles.storyImageContainer}>
              <div className={styles.storyWireframe}>
                <div className={styles.wireBlock}>
                  ATHR AGENCY DESIGN GRID
                </div>
                <div className={styles.wireCode}>
                  {`// Brand Philosophy definition
const athr = {
  mission: "Leave an imprint",
  speed: "sub-1.2s",
  uxCrafted: true
};`}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className={styles.wireBlock} style={{ flex: 1 }}>UI GRID</div>
                  <div className={styles.wireBlock} style={{ flex: 1 }}>100% SEO</div>
                </div>
              </div>
            </div>
            
            <div className={styles.storyContent}>
              <h2>{lang === 'ar' ? 'البصمة البرمجية التي تضمن تميزك' : 'The Code Print That Secures Your Eminence'}</h2>
              <p>
                {t('about.storyText')}
              </p>
              <p>
                {lang === 'ar' 
                  ? 'نتحرك داخلياً في أثر بروح الابتكار والسرعة، مستبعدين الأساليب التقليدية والقوالب الجاهزة التي تضعف هيبة شركتك. كل سطر كود يكتبه مهندسونا يُبنى خصيصاً ليناسب طبيعة عملك ويوفر أعلى درجات الكفاءة.'
                  : 'We operate internally with speed and innovation, rejecting generic pre-built layouts that weaken your corporate brand. Every line of code written by our engineers is bespoke, tailored to your workflows and built for efficiency.'}
              </p>
            </div>
          </div>
        </section>

        {/* Three Pillars of Software Excellence */}
        <section className={styles.pillarsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{lang === 'ar' ? 'ركائز التميز البرمجي في أثر' : 'The Three Pillars of Software Excellence'}</h2>
              <p>
                {lang === 'ar' 
                  ? 'المعايير التقنية الثلاثة التي نبني عليها كل منصة لضمان التفوق الرقمي المستدام' 
                  : 'The three engineering standards we embed in every platform to secure sustainable digital supremacy'}
              </p>
            </div>
            
            <div className={styles.pillarsGrid}>
              {pillarsItems.map((item, idx) => (
                <div key={idx} className={styles.pillarCard}>
                  <div className={styles.pillarBadge}>{item.highlight}</div>
                  <h3 className={styles.pillarTitle}>
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  <p className={styles.pillarText}>
                    {lang === 'ar' ? item.textAr : item.textEn}
                  </p>
                  <div className={styles.cardIndicator}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Roles */}
        <section className={styles.teamSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{lang === 'ar' ? 'هندسة الكفاءات في أثر' : 'Our Engineering Roles at Athar'}</h2>
              <p>{lang === 'ar' ? 'نتكامل كفريق لضمان حصولك على تحفة فنية برمجية خالية من العيوب' : 'We coordinate seamlessly to deliver a flawless, high-performance web asset'}</p>
            </div>
            
            <div className={styles.teamGrid}>
              {teamRoles.map((role, idx) => (
                <div key={idx} className={styles.teamCard}>
                  <div className={styles.roleIcon}>{role.icon}</div>
                  <h3 className={styles.roleTitle}>{lang === 'ar' ? role.titleAr : role.titleEn}</h3>
                  <span className={styles.roleSpec}>{lang === 'ar' ? role.specAr : role.specEn}</span>
                  <p className={styles.roleDesc}>{lang === 'ar' ? role.descAr : role.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* philosophy quote */}
        <QuoteSection />
      </main>

      <Footer />
    </div>
  );
}
