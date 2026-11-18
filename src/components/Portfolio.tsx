'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { publishedProjects as projects, localized } from '@/content/projects';
import styles from './Portfolio.module.css';

export default function Portfolio() {
  const { t, lang, path } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedProjectSlug, setExpandedProjectSlug] = useState<string | null>(null);

  const filterProjects = projects.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  const toggleExpand = (slug: string) => {
    setExpandedProjectSlug((current) => (current === slug ? null : slug));
  };

  const categories = [
    { key: 'all', label: t('portfolio.all') },
    { key: 'web', label: t('portfolio.web') },
    { key: 'stores', label: t('portfolio.stores') },
    { key: 'brands', label: t('portfolio.brands') },
  ];

  return (
    <section id="portfolio" className={styles.portfolio}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('portfolio.title')}</h2>
          <p className={styles.subtitle}>{t('portfolio.subtitle')}</p>
        </div>

        {/* فئات الفلترة */}
        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${activeTab === cat.key ? styles.activeTab : ''}`}
              onClick={() => {
                setActiveTab(cat.key);
                setExpandedProjectSlug(null);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* شبكة الأعمال */}
        <div className={styles.grid}>
          {filterProjects.map((project) => {
            const isExpanded = expandedProjectSlug === project.slug;

            return (
              <div key={project.slug} className={styles.card}>
                {/* الواجهة البصرية الافتراضية للكارت */}
                <div className={styles.cardVisual}>
                  <span className={styles.cardTag}>
                    {t(`portfolio.${project.category}`)}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{localized(project.title, lang)}</h3>
                  <p className={styles.desc}>{localized(project.desc, lang)}</p>

                  <button
                    className={styles.detailsBtn}
                    onClick={() => toggleExpand(project.slug)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? (lang === 'ar' ? 'إغلاق التفاصيل' : 'Close Details') : (lang === 'ar' ? 'عرض دراسة الحالة بالأرقام' : 'View Case Study')}</span>
                    <span>{isExpanded ? '↑' : '→'}</span>
                  </button>
                </div>

                {/* لوحة تفاصيل دراسة الحالة التفاعلية */}
                {isExpanded && (
                  <div className={styles.caseStudyPanel}>
                    <div>
                      <h4 className={styles.caseTitle}>
                        {t('portfolio.caseStudy.challenge')}
                      </h4>
                      <p className={styles.caseText}>{localized(project.challenge, lang)}</p>
                    </div>
                    <div>
                      <h4 className={styles.caseTitle}>
                        {t('portfolio.caseStudy.solution')}
                      </h4>
                      <p className={styles.caseText}>{localized(project.solution, lang)}</p>
                    </div>
                    <div className={styles.caseResult}>
                      <h4 className={styles.caseTitle}>
                        {t('portfolio.caseStudy.result')}
                      </h4>
                      <p style={{ marginTop: '4px' }}>{localized(project.result, lang)}</p>
                    </div>
                    <Link href={path(`/portfolio/${project.slug}`)} className={styles.detailsBtn}>
                      <span>{lang === 'ar' ? 'فتح دراسة الحالة كاملة' : 'Open full case study'}</span>
                      <span>{lang === 'ar' ? '←' : '→'}</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
