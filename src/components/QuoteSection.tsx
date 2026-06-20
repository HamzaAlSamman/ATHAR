'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './QuoteSection.module.css';

export default function QuoteSection() {
  const { t, lang } = useLanguage();

  return (
    <section className={styles.quoteSection} aria-label="Philosophy Quote">
      <div className="container">
        <div className={styles.quoteWrapper}>
          {/* Decorative glowing background elements */}
          <div className={styles.glowOrb}></div>
          
          <div className={styles.quoteCard}>
            <span className={styles.quoteSymbolStart}>“</span>
            
            <blockquote className={styles.blockquote}>
              {t('about.quote')}
            </blockquote>
            
            <span className={styles.quoteSymbolEnd}>”</span>
            
            <div className={styles.authorContainer}>
              <div className={styles.divider}></div>
              <cite className={styles.author}>
                {lang === 'ar' ? 'فلسفة وكالة أثر' : 'Athar Agency Philosophy'}
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
