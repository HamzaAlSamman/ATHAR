'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { localized, type Project } from '@/content/projects';
import styles from '../../article.module.css';

export default function ProjectContent({ project }: { project: Project }) {
  const { lang, t } = useLanguage();

  const catLabel = t(`portfolio.${project.category}`);
  const cs = {
    challenge: t('portfolio.caseStudy.challenge'),
    solution: t('portfolio.caseStudy.solution'),
    result: t('portfolio.caseStudy.result'),
  };

  return (
    <article className={`container ${styles.wrapper}`}>
      <nav className={styles.breadcrumb}>
        <Link href="/">{t('nav.home')}</Link>
        <span>/</span>
        <Link href="/portfolio">{t('nav.portfolio')}</Link>
      </nav>

      <span className={styles.category}>{catLabel}</span>
      <h1 className={styles.title}>{localized(project.title, lang)}</h1>
      <p className={styles.lead}>{localized(project.desc, lang)}</p>

      <div className={styles.metricsGrid}>
        {project.metrics.map((m, i) => (
          <div key={i} className={styles.metricCard}>
            <span className={styles.metricValue}>{m.value}</span>
            <div className={styles.metricLabel}>{localized(m.label, lang)}</div>
          </div>
        ))}
      </div>

      <section className={styles.block}>
        <h2 className={styles.blockHeading}>{cs.challenge}</h2>
        <p className={styles.blockBody}>{localized(project.challenge, lang)}</p>
      </section>
      <section className={styles.block}>
        <h2 className={styles.blockHeading}>{cs.solution}</h2>
        <p className={styles.blockBody}>{localized(project.solution, lang)}</p>
      </section>
      <section className={styles.block}>
        <h2 className={styles.blockHeading}>{cs.result}</h2>
        <p className={styles.blockBody}>{localized(project.result, lang)}</p>
      </section>

      <div className={styles.stack}>
        {project.stack.map((s) => (
          <span key={s} className={styles.stackTag}>{s}</span>
        ))}
      </div>

      <div className={styles.ctaBox}>
        <h3 className={styles.ctaTitle}>
          {lang === 'ar'
            ? 'هل تريد نتائج مماثلة لمشروعك؟'
            : 'Want similar results for your project?'}
        </h3>
        <Link href="/contact" className={styles.ctaBtn}>
          {t('hero.cta')}
        </Link>
      </div>
    </article>
  );
}
