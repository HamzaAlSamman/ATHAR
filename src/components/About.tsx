'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './About.module.css';

interface ValueItem {
  title: string;
  desc: string;
}

export default function About() {
  const { t } = useLanguage();

  const valuesList = t<ValueItem[]>('about.values');
  const numberLabels = ['01', '02', '03'];

  return (
    <section id="about" className={styles.about}>
      <div className={`container ${styles.aboutGrid}`}>
        {/* الجانب البصري - محاكي تخطيط هيكلي للموقع */}
        <div className={styles.visualSide}>
          <div className={styles.wireframeIllustrator}>
            <div className={styles.wireHeader}>
              <div className={styles.wireLogo}></div>
              <div className={styles.wireNav}>
                <div className={styles.wireNavItem}></div>
                <div className={styles.wireNavItem}></div>
                <div className={styles.wireNavItem}></div>
              </div>
            </div>
            
            <div className={styles.wireGrid}>
              <div className={styles.wireBox}>COL 1</div>
              <div className={styles.wireBox}>COL 2</div>
              <div className={styles.wireBox}>COL 3</div>
            </div>

            <div className={styles.wireCodeBox}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{'// Wireframing structure...'}</span>
                <div className={styles.wirePulse}></div>
              </div>
              <div style={{ color: 'var(--color-mint)', marginTop: '4px' }}>&lt;section id=&quot;athar-impact&quot;&gt;</div>
              <div style={{ paddingInlineStart: '12px' }}>&lt;div className=&quot;impression&quot;&gt;&lt;/div&gt;</div>
              <div style={{ color: 'var(--color-mint)' }}>&lt;/section&gt;</div>
            </div>
          </div>
        </div>

        {/* الجانب النصي وقيم العمل */}
        <div className={styles.textSide}>
          <div className={styles.tagline}>
            {t('hero.vibeCoding')}
          </div>
          <h2 className={styles.title}>
            {t('about.storyTitle')}
          </h2>
          <p className={styles.storyDesc}>
            {t('about.storyText')}
          </p>

          <div className={styles.valuesWrapper}>
            <h3 className={styles.valueTitle}>{t('about.valuesTitle')}</h3>
            <div className={styles.valuesList}>
              {Array.isArray(valuesList) && valuesList.map((val, idx) => (
                <div key={idx} className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    {numberLabels[idx]}
                  </div>
                  <div className={styles.valueInfo}>
                    <h4 className={styles.valName}>{val.title}</h4>
                    <p className={styles.valDesc}>{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
