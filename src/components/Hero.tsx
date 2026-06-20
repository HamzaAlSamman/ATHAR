'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero() {
  const { t, lang } = useLanguage();

  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const codeLines = [
      'const project = {',
      '  name: "ATHR",',
      '  cleanCode: true,',
      '  pagespeedScore: 100,',
      '  loadTime: "1.2s"',
      '};',
      'const status = "leaving impact...";'
    ];

    if (!isDeleting) {
      if (currentLineIdx < codeLines.length) {
        const currentFullLine = codeLines[currentLineIdx];
        if (currentCharIdx < currentFullLine.length) {
          const timeout = setTimeout(() => {
            setTypedLines(prev => {
              const updated = [...prev];
              if (updated[currentLineIdx] !== undefined) {
                updated[currentLineIdx] += currentFullLine[currentCharIdx];
              } else {
                updated[currentLineIdx] = currentFullLine[currentCharIdx];
              }
              return updated;
            });
            setCurrentCharIdx(prev => prev + 1);
          }, 30);
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setCurrentLineIdx(prev => prev + 1);
            setCurrentCharIdx(0);
          }, 150);
          return () => clearTimeout(timeout);
        }
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 4000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typedLines.length > 0) {
        const lastLineIdx = typedLines.length - 1;
        const lastLineText = typedLines[lastLineIdx];
        
        if (lastLineText.length > 0) {
          const timeout = setTimeout(() => {
            setTypedLines(prev => {
              const updated = [...prev];
              updated[lastLineIdx] = lastLineText.substring(0, lastLineText.length - 1);
              return updated;
            });
          }, 15);
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setTypedLines(prev => prev.slice(0, -1));
            setCurrentLineIdx(prev => Math.max(0, prev - 1));
            setCurrentCharIdx(0);
          }, 50);
          return () => clearTimeout(timeout);
        }
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentLineIdx(0);
          setCurrentCharIdx(0);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIdx, currentCharIdx, isDeleting, typedLines]);

  const renderHighlightedLine = (line: string, index: number) => {
    if (index === 0) {
      if (line.startsWith('const')) {
        return <div key={index}><span className={styles.codeCoral}>const</span>{line.substring(5)}</div>;
      }
    }
    if (index === 1) {
      if (line.includes('"ATHR"')) {
        const parts = line.split('"ATHR"');
        return <div key={index} style={{ paddingInlineStart: '16px' }}>{parts[0]}<span className={styles.codeGreen}>&quot;ATHR&quot;</span>{parts[1]}</div>;
      }
    }
    if (index === 2) {
      if (line.includes('true')) {
        const parts = line.split('true');
        return <div key={index} style={{ paddingInlineStart: '16px' }}>{parts[0]}<span className={styles.codeCoral}>true</span>{parts[1]}</div>;
      }
    }
    if (index === 3) {
      if (line.includes('100')) {
        const parts = line.split('100');
        return <div key={index} style={{ paddingInlineStart: '16px' }}>{parts[0]}<span className={styles.codeGreen}>100</span>{parts[1]}</div>;
      }
    }
    if (index === 4) {
      if (line.includes('"1.2s"')) {
        const parts = line.split('"1.2s"');
        return <div key={index} style={{ paddingInlineStart: '16px' }}>{parts[0]}<span className={styles.codeGreen}>&quot;1.2s&quot;</span>{parts[1]}</div>;
      }
    }
    if (index === 5) {
      return <div key={index}>{line}</div>;
    }
    if (index === 6) {
      let content: React.ReactNode = line;
      if (line.startsWith('const')) {
        const rest = line.substring(5);
        if (rest.includes('"leaving impact..."')) {
          const parts = rest.split('"leaving impact..."');
          content = (
            <>
              <span className={styles.codeCoral}>const</span>
              {parts[0]}
              <span className={styles.codeGreen}>&quot;leaving impact...&quot;</span>
              {parts[1]}
            </>
          );
        } else {
          content = (
            <>
              <span className={styles.codeCoral}>const</span>
              {rest}
            </>
          );
        }
      }
      return <div key={index} style={{ marginTop: '8px' }}>{content}</div>;
    }
    return <div key={index}>{line}</div>;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.heroContent} animate-fade-in-up`}>
        {/* الجانب النصي والتسويقي */}
        <div className={styles.textSide}>
          <div className={styles.tagline}>
            {t('hero.tag')}
          </div>
          <h1 className={styles.title}>
            {t('hero.title')}
          </h1>
          <p className={styles.subtitle}>
            {t('hero.subtitle')}
          </p>

          {/* أزرار الإجراءات بدون إيموجي */}
          <div className={styles.ctas}>
            <button 
              className={styles.primaryCta}
              onClick={() => scrollToSection('contact')}
              id="hero-cta-consultation"
            >
              {t('hero.cta')}
            </button>
            <button 
              className={styles.secondaryCta}
              onClick={() => scrollToSection('portfolio')}
              id="hero-cta-portfolio"
            >
              {t('nav.portfolio')}
            </button>
          </div>

          {/* أرقام وإحصائيات النجاح */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{lang === 'ar' ? '١٢٠+' : '+120'}</span>
              <span className={styles.statLbl}>{t('hero.stats.projects')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{lang === 'ar' ? '١.٢ ثانية' : '1.2s'}</span>
              <span className={styles.statLbl}>{t('hero.stats.speed')}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>{lang === 'ar' ? '٩٩٪' : '99%'}</span>
              <span className={styles.statLbl}>{t('hero.stats.satisfaction')}</span>
            </div>
          </div>
        </div>

        {/* الجانب البصري - محاكاة الكود التفاعلية بالـ CSS */}
        <div className={styles.visualSide}>
          <div className={styles.browserMockup}>
            <div className={styles.browserHeader}>
              <div className={styles.dots}>
                <div className={`${styles.dot} ${styles.dotClose}`}></div>
                <div className={`${styles.dot} ${styles.dotMin}`}></div>
                <div className={`${styles.dot} ${styles.dotMax}`}></div>
              </div>
              <div className={styles.browserAddress}>
                athar.agency/future
              </div>
              <div style={{ width: '40px' }}></div>
            </div>
            <div className={styles.browserContent}>
              <div className={styles.mockTitle}></div>
              <div className={styles.mockLines}>
                <div className={styles.mockLine}></div>
                <div className={`${styles.mockLine} ${styles.mockLineShort}`}></div>
              </div>
              
              <div className={styles.mockCodeFrame}>
                {typedLines.map((line, idx) => renderHighlightedLine(line, idx))}
                <div>
                  <span className="cursor-blink">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
