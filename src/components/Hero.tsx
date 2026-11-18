'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

const TEXT = {
  ar: {
    tag: 'فحص مجاني · بدون تسجيل',
    title: 'اعرف لماذا يخسر موقعك زواره، ونصلحه لك بسعر ثابت',
    subtitle:
      'اكتب رابط موقعك واحصل خلال ثوانٍ على تقرير حقيقي عن سرعته وأمانه وظهوره في غوغل، مع شرح كل مشكلة وطريقة إصلاحها.',
    label: 'رابط موقعك',
    cta: 'افحص موقعي مجاناً',
    secondary: 'شاهد الأسعار',
    facts: [
      { value: '37', label: 'فحصاً حقيقياً في كل تقرير' },
      { value: 'A–F', label: 'درجة واضحة لكل موقع' },
      { value: 'سعر ثابت', label: 'تعرفه قبل أن نبدأ' },
    ],
    sample: 'مثال على تقرير',
    categories: ['السرعة', 'الأمان', 'السيو'],
    issues: ['لا توجد سياسة أمان محتوى (CSP)', 'سكربتات تعطّل عرض الصفحة', 'لا توجد بيانات منظمة'],
    issueLabel: 'مشكلة',
    grade: 'الدرجة',
  },
  en: {
    tag: 'Free audit · No sign-up',
    title: 'Find out why your website loses visitors, and get it fixed at a fixed price',
    subtitle:
      'Enter your site and get a real report in seconds on its speed, security and Google visibility, with every issue explained and how to fix it.',
    label: 'Your website',
    cta: 'Audit my site for free',
    secondary: 'See pricing',
    facts: [
      { value: '37', label: 'real checks in every report' },
      { value: 'A–F', label: 'a clear grade for every site' },
      { value: 'Fixed price', label: 'known before we start' },
    ],
    sample: 'Sample report',
    categories: ['Speed', 'Security', 'SEO'],
    issues: ['No Content Security Policy (CSP)', 'Render-blocking scripts', 'No structured data'],
    issueLabel: 'Issue',
    grade: 'Grade',
  },
} as const;

const SAMPLE_SCORES = [62, 48, 81];

export default function Hero() {
  const { lang, path } = useLanguage();
  const router = useRouter();
  const ui = TEXT[lang];
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = url.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    if (!target) return;
    router.push(`${path('/tech-lab')}?url=${encodeURIComponent(target)}`);
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.textSide}>
          <p className={styles.tagline}>{ui.tag}</p>
          <h1 className={styles.title}>{ui.title}</h1>
          <p className={styles.subtitle}>{ui.subtitle}</p>

          <form className={styles.auditForm} onSubmit={handleSubmit}>
            <label htmlFor="hero-url" className={styles.srOnly}>
              {ui.label}
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputPrefix} aria-hidden="true">
                https://
              </span>
              <input
                id="hero-url"
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                dir="ltr"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.primaryCta}>
              {ui.cta}
            </button>
          </form>

          <Link href={path('/pricing')} className={styles.secondaryLink}>
            {ui.secondary}
          </Link>

          <dl className={styles.statsRow}>
            {ui.facts.map((fact) => (
              <div key={fact.label} className={styles.statItem}>
                <dt className={styles.statLbl}>{fact.label}</dt>
                <dd className={styles.statVal}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* مثال ثابت لشكل التقرير: يوضح للزائر ما سيحصل عليه قبل أن يكتب رابطه. */}
        <div className={styles.visualSide} aria-hidden="true">
          <div className={styles.sampleCard}>
            <div className={styles.sampleHead}>
              <span className={styles.sampleLabel}>{ui.sample}</span>
              <span className={styles.sampleHost} dir="ltr">
                your-store.com
              </span>
            </div>
            <div className={styles.sampleSummary}>
              <div className={styles.sampleGrade}>
                <span>D</span>
                <small>{ui.grade}</small>
              </div>
              <div className={styles.sampleBars}>
                {ui.categories.map((name, i) => (
                  <div key={name} className={styles.sampleBar}>
                    <span className={styles.sampleBarName}>{name}</span>
                    <span className={styles.sampleTrack}>
                      <span
                        className={styles.sampleFill}
                        data-tone={SAMPLE_SCORES[i] >= 80 ? 'good' : SAMPLE_SCORES[i] >= 50 ? 'mid' : 'bad'}
                        style={{ width: `${SAMPLE_SCORES[i]}%` }}
                      />
                    </span>
                    <span className={styles.sampleScore}>{SAMPLE_SCORES[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <ul className={styles.sampleIssues}>
              {ui.issues.map((issue) => (
                <li key={issue}>
                  <span className={styles.sampleChip}>{ui.issueLabel}</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
