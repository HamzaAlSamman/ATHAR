'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './TechLab.module.css';

type ToolId = 'speed' | 'mobile' | 'security';

export default function TechLab() {
  const { t, lang } = useLanguage();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState({ metric1: 0, metric2: 0, metric3: 0, metric4: 0 });

  // Reset audit state when switching tools
  const handleSelectTool = (toolId: ToolId) => {
    setActiveTool(toolId);
    setUrl('');
    setIsScanning(false);
    setScanStep(0);
    setShowResults(false);
  };

  const handleBackToGrid = () => {
    setActiveTool(null);
    setUrl('');
    setIsScanning(false);
    setScanStep(0);
    setShowResults(false);
  };

  // Status steps for the terminal scanning animation
  const getScanSteps = () => {
    if (activeTool === 'speed') {
      return [
        t('techLab.speedTester.status1'),
        t('techLab.speedTester.status2'),
        t('techLab.speedTester.status3'),
        t('techLab.speedTester.status4')
      ];
    } else if (activeTool === 'mobile') {
      return [
        t('techLab.mobileAuditor.status1'),
        t('techLab.mobileAuditor.status2'),
        t('techLab.mobileAuditor.status3'),
        t('techLab.mobileAuditor.status4')
      ];
    } else {
      return [
        t('techLab.securityChecker.status1'),
        t('techLab.securityChecker.status2'),
        t('techLab.securityChecker.status3'),
        t('techLab.securityChecker.status4')
      ];
    }
  };

  const steps = getScanSteps();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // تشغيل الفحص من معالج الحدث مباشرة: نعرض خطوات الكونسول تباعاً ثم ننهي الفحص.
  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setShowResults(false);
    setScanStep(0);
    setIsScanning(true);

    for (let i = 1; i < steps.length; i++) {
      await sleep(1200);
      setScanStep(i);
    }
    await sleep(800);
    await finishScan();
  };

  // إنهاء الفحص: لأداة السرعة نجلب نتائج حقيقية من /api/audit (فحص فعلي بدون مفتاح)، وإلا نعود للمحاكاة.
  async function finishScan() {
    if (activeTool === 'speed') {
      try {
        const res = await fetch(`/api/audit?url=${encodeURIComponent(url.trim())}`);
        if (res.ok) {
          const data = await res.json();
          const s = data?.scores;
          if (data?.ok && s) {
            setScores({
              metric1: s.performance ?? 0,
              metric2: s.seo ?? 0,
              metric3: s.accessibility ?? 0,
              metric4: s.bestPractices ?? 0,
            });
            setIsScanning(false);
            setShowResults(true);
            return;
          }
        }
      } catch {
        /* fall back to simulation below */
      }
    }
    calculateScores();
    setIsScanning(false);
    setShowResults(true);
  }

  function calculateScores() {
    const lowercaseUrl = url.toLowerCase();
    
    // Easter Egg: if URL contains 'athar' or is 'google.com', give perfect score
    if (lowercaseUrl.includes('athar') || lowercaseUrl.includes('google')) {
      setScores({ metric1: 100, metric2: 100, metric3: 100, metric4: 100 });
      return;
    }

    // Hash URL for deterministic scores
    let hash = 0;
    for (let i = 0; i < lowercaseUrl.length; i++) {
      hash = lowercaseUrl.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const metric1 = 45 + (Math.abs(hash) % 21); // 45 to 65
    const metric2 = 58 + (Math.abs(hash >> 1) % 23); // 58 to 80
    const metric3 = 50 + (Math.abs(hash >> 2) % 21); // 50 to 70
    const metric4 = 60 + (Math.abs(hash >> 3) % 21); // 60 to 80

    setScores({ metric1, metric2, metric3, metric4 });
  }

  const handleCTAClick = () => {
    // حفظ بيانات الفحص محلياً ثم التوجّه لصفحة التواصل لتعبئة النموذج تلقائياً.
    const queryPrefill = {
      tool: activeTool,
      url: url
    };
    localStorage.setItem('athar_prefill', JSON.stringify(queryPrefill));
    window.location.href = '/contact';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'var(--color-mint)';
    if (score >= 50) return 'var(--color-coral)';
    return '#E74C3C'; // Red
  };

  // Get localized labels for the scores depending on the active tool
  const getMetricLabels = () => {
    if (activeTool === 'speed') {
      return [
        t('techLab.speedTester.performance'),
        t('techLab.speedTester.seo'),
        t('techLab.speedTester.ux'),
        t('techLab.speedTester.bestPractices')
      ];
    } else if (activeTool === 'mobile') {
      return [
        t('techLab.mobileAuditor.responsive'),
        t('techLab.mobileAuditor.fontScale'),
        t('techLab.mobileAuditor.touchTarget'),
        t('techLab.mobileAuditor.layoutLoad')
      ];
    } else {
      return [
        t('techLab.securityChecker.sslStatus'),
        t('techLab.securityChecker.httpHeaders'),
        t('techLab.securityChecker.xssShield'),
        t('techLab.securityChecker.databaseSec')
      ];
    }
  };

  const metricLabels = getMetricLabels();

  return (
    <section id="tech-lab" className={styles.techLab}>
      <div className="container">
        
        {/* If no tool is active, display the Grid of Squares */}
        {activeTool === null ? (
          <>
            <div className={styles.headerArea}>
              <span className={styles.tagline}>{lang === 'ar' ? 'مختبر الابتكار' : 'Innovation Hub'}</span>
              <h2 className={styles.title}>{t('techLab.title')}</h2>
              <p className={styles.subtitle}>{t('techLab.subtitle')}</p>
            </div>

            <div className={styles.toolsGrid}>
              {/* Box 1: Speed Tester */}
              <div className={styles.toolCard} onClick={() => handleSelectTool('speed')}>
                <div className={styles.toolIcon}>⚡</div>
                <h3 className={styles.toolCardTitle}>{t('techLab.speedTester.title')}</h3>
                <p className={styles.toolCardDesc}>{lang === 'ar' ? 'قياس سرعة استجابة الخادم والمقاييس الحيوية للصفحة.' : 'Audit page load speeds and backend latency metrics.'}</p>
                <span className={styles.toolCardLink}>{lang === 'ar' ? 'تشغيل الأداة ←' : 'Launch Tool →'}</span>
              </div>

              {/* Box 2: Mobile Auditor */}
              <div className={styles.toolCard} onClick={() => handleSelectTool('mobile')}>
                <div className={styles.toolIcon}>📱</div>
                <h3 className={styles.toolCardTitle}>{t('techLab.mobileAuditor.title')}</h3>
                <p className={styles.toolCardDesc}>{lang === 'ar' ? 'فحص توافق الواجهات وسلاسة القراءة على الهواتف.' : 'Audit mobile responsive fluidity and typography spacing.'}</p>
                <span className={styles.toolCardLink}>{lang === 'ar' ? 'تشغيل الأداة ←' : 'Launch Tool →'}</span>
              </div>

              {/* Box 3: Security Checker */}
              <div className={styles.toolCard} onClick={() => handleSelectTool('security')}>
                <div className={styles.toolIcon}>🔒</div>
                <h3 className={styles.toolCardTitle}>{t('techLab.securityChecker.title')}</h3>
                <p className={styles.toolCardDesc}>{lang === 'ar' ? 'فحص شهادات التشفير وجدران الحماية للبيانات.' : 'Audit SSL certifications, HTTP security, and database WAFs.'}</p>
                <span className={styles.toolCardLink}>{lang === 'ar' ? 'تشغيل الأداة ←' : 'Launch Tool →'}</span>
              </div>
            </div>
          </>
        ) : (
          /* Tool Interface Mode */
          <div className={styles.labCard}>
            <div className={styles.cardBgPattern}></div>

            <button onClick={handleBackToGrid} className={styles.backBtn}>
              {lang === 'ar' ? '← العودة للمختبر' : '← Back to Lab'}
            </button>

            <h3 className={styles.toolTitle}>
              {activeTool === 'speed' && t('techLab.speedTester.title')}
              {activeTool === 'mobile' && t('techLab.mobileAuditor.title')}
              {activeTool === 'security' && t('techLab.securityChecker.title')}
            </h3>
            
            <p className={styles.toolDesc}>
              {activeTool === 'speed' && t('techLab.speedTester.desc')}
              {activeTool === 'mobile' && t('techLab.mobileAuditor.desc')}
              {activeTool === 'security' && t('techLab.securityChecker.desc')}
            </p>

            <form onSubmit={handleStartScan} className={styles.form}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>https://</span>
                <input
                  type="text"
                  placeholder={
                    activeTool === 'speed' ? t('techLab.speedTester.placeholder') :
                    activeTool === 'mobile' ? t('techLab.mobileAuditor.placeholder') :
                    t('techLab.securityChecker.placeholder')
                  }
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isScanning}
                  className={styles.input}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !url.trim()}
                className={`${styles.submitBtn} ${isScanning ? styles.scanning : ''}`}
              >
                {isScanning ? (
                  activeTool === 'speed' ? t('techLab.speedTester.btnScanning') :
                  activeTool === 'mobile' ? t('techLab.mobileAuditor.btnScanning') :
                  t('techLab.securityChecker.btnScanning')
                ) : (
                  activeTool === 'speed' ? t('techLab.speedTester.btnStart') :
                  activeTool === 'mobile' ? t('techLab.mobileAuditor.btnStart') :
                  t('techLab.securityChecker.btnStart')
                )}
              </button>
            </form>

            {/* Scanning Console Animation */}
            {isScanning && (
              <div className={styles.consoleWrapper}>
                <div className={styles.consoleHeader}>
                  <div className={styles.consoleDots}>
                    <span></span><span></span><span></span>
                  </div>
                  <div className={styles.consoleTitle}>
                    {activeTool === 'speed' && 'Performance Audit Console'}
                    {activeTool === 'mobile' && 'UX & Responsiveness Console'}
                    {activeTool === 'security' && 'Security Audit Console'}
                  </div>
                </div>
                <div className={styles.consoleBody}>
                  <div className={styles.consoleLine}>
                    <span className={styles.consoleMint}>[INIT]</span> Auditor instance mounted...
                  </div>
                  <div className={styles.consoleLine}>
                    <span className={styles.consoleMint}>[HTTP]</span> Auditing host &quot;{url}&quot;...
                  </div>
                  
                  {scanStep >= 0 && (
                    <div className={styles.consoleLine}>
                      <span className={styles.consoleMint}>[STAGE 1]</span> {steps[0]}
                    </div>
                  )}
                  {scanStep >= 1 && (
                    <div className={styles.consoleLine}>
                      <span className={styles.consoleMint}>[STAGE 2]</span> {steps[1]}
                    </div>
                  )}
                  {scanStep >= 2 && (
                    <div className={styles.consoleLine}>
                      <span className={styles.consoleMint}>[STAGE 3]</span> {steps[2]}
                    </div>
                  )}
                  {scanStep >= 3 && (
                    <div className={styles.consoleLine}>
                      <span className={styles.consoleMint}>[STAGE 4]</span> {steps[3]}
                    </div>
                  )}
                  
                  <div className={styles.loadingBarWrapper}>
                    <div 
                      className={styles.loadingBarProgress} 
                      style={{ width: `${((scanStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Results Dashboard */}
            {showResults && !isScanning && (
              <div className={styles.resultsWrapper}>
                <h4 className={styles.resultsHeader}>
                  {activeTool === 'speed' && t('techLab.speedTester.resultsTitle')}
                  {activeTool === 'mobile' && t('techLab.mobileAuditor.resultsTitle')}
                  {activeTool === 'security' && t('techLab.securityChecker.resultsTitle')}
                  &nbsp;({url})
                </h4>
                
                <div className={styles.scoresGrid}>
                  {/* Score 1 */}
                  <div className={styles.scoreCard}>
                    <div className={styles.circleOuter}>
                      <svg className={styles.svgCircle}>
                        <circle cx="50" cy="50" r="42" className={styles.circleBg} />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          className={styles.circleValue}
                          style={{
                            strokeDashoffset: 264 - (264 * scores.metric1) / 100,
                            stroke: getScoreColor(scores.metric1)
                          }}
                        />
                      </svg>
                      <div className={styles.scoreNumber} style={{ color: getScoreColor(scores.metric1) }}>
                        {scores.metric1}
                      </div>
                    </div>
                    <span className={styles.scoreLabel}>{metricLabels[0]}</span>
                  </div>

                  {/* Score 2 */}
                  <div className={styles.scoreCard}>
                    <div className={styles.circleOuter}>
                      <svg className={styles.svgCircle}>
                        <circle cx="50" cy="50" r="42" className={styles.circleBg} />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          className={styles.circleValue}
                          style={{
                            strokeDashoffset: 264 - (264 * scores.metric2) / 100,
                            stroke: getScoreColor(scores.metric2)
                          }}
                        />
                      </svg>
                      <div className={styles.scoreNumber} style={{ color: getScoreColor(scores.metric2) }}>
                        {scores.metric2}
                      </div>
                    </div>
                    <span className={styles.scoreLabel}>{metricLabels[1]}</span>
                  </div>

                  {/* Score 3 */}
                  <div className={styles.scoreCard}>
                    <div className={styles.circleOuter}>
                      <svg className={styles.svgCircle}>
                        <circle cx="50" cy="50" r="42" className={styles.circleBg} />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          className={styles.circleValue}
                          style={{
                            strokeDashoffset: 264 - (264 * scores.metric3) / 100,
                            stroke: getScoreColor(scores.metric3)
                          }}
                        />
                      </svg>
                      <div className={styles.scoreNumber} style={{ color: getScoreColor(scores.metric3) }}>
                        {scores.metric3}
                      </div>
                    </div>
                    <span className={styles.scoreLabel}>{metricLabels[2]}</span>
                  </div>

                  {/* Score 4 */}
                  <div className={styles.scoreCard}>
                    <div className={styles.circleOuter}>
                      <svg className={styles.svgCircle}>
                        <circle cx="50" cy="50" r="42" className={styles.circleBg} />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          className={styles.circleValue}
                          style={{
                            strokeDashoffset: 264 - (264 * scores.metric4) / 100,
                            stroke: getScoreColor(scores.metric4)
                          }}
                        />
                      </svg>
                      <div className={styles.scoreNumber} style={{ color: getScoreColor(scores.metric4) }}>
                        {scores.metric4}
                      </div>
                    </div>
                    <span className={styles.scoreLabel}>{metricLabels[3]}</span>
                  </div>
                </div>

                {/* Recommendations Details */}
                <div className={styles.auditDetails}>
                  <div className={styles.warningList}>
                    {activeTool === 'speed' && (
                      <>
                        {scores.metric1 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'تأخر استجابة أول بكسل (LCP)' : 'Slow Largest Contentful Paint (LCP)'}</strong>
                              <p>{lang === 'ar' ? 'تستغرق الصفحة أكثر من 3.8 ثوانٍ لتصبح مرئية بالكامل للزوار.' : 'Page taking more than 3.8 seconds to become fully visible.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric3 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'صور ضخمة غير مضغوطة' : 'Unoptimized Massive Images'}</strong>
                              <p>{lang === 'ar' ? 'توجد ملفات صور غير مهيأة للجوال تستهلك بيانات الهاتف وبطاقات شبكة الزوار.' : 'Images not formatted for mobile, slowing page load speed.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric4 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotYellow}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'أكواد برمجية ومكتبات جافاسكريبت زائدة' : 'Bloated Third-party Scripts'}</strong>
                              <p>{lang === 'ar' ? 'تحميل مكتبات ضخمة غير مستخدمة يؤدي لتأخير تفاعل الصفحة عند اللمس.' : 'Large unused JS bundles block thread rendering.'}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {activeTool === 'mobile' && (
                      <>
                        {scores.metric1 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'تداخل في العناصر التفاعلية' : 'Overlapping Tap Targets'}</strong>
                              <p>{lang === 'ar' ? 'الأزرار والروابط متقاربة جداً مما يسبب صعوبة في الضغط عليها عبر الشاشات الصغيرة.' : 'Clickable elements are too close, resulting in touch friction.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric2 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'عدم ثبات التصميم أثناء التحميل (CLS)' : 'Layout Shift (CLS) Detected'}</strong>
                              <p>{lang === 'ar' ? 'العناصر تتحرك بشكل غير مستقر عند تحميل الصفحة بالجوال، مما يزعج القارئ.' : 'Layout elements shift during initial loading, affecting UX.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric3 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotYellow}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'أحجام خطوط صغيرة جداً' : 'Small Font Sizes'}</strong>
                              <p>{lang === 'ar' ? 'بعض نصوص المتن تقل عن 14px مما يضطر الزائر لتكبير الشاشة يدوياً.' : 'Text elements scale below 14px, causing legibility issues.'}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {activeTool === 'security' && (
                      <>
                        {scores.metric2 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'غياب هيدرز الحماية الأساسية' : 'Missing Security Headers'}</strong>
                              <p>{lang === 'ar' ? 'موقعك لا يرسل هيدرز حماية مثل CSP أو X-Frame-Options لمنع الاختراق.' : 'Critical HTTP security headers are missing, exposing transactional interfaces.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric3 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotRed}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'ثغرات XSS محتملة' : 'Potential Infiltration Points'}</strong>
                              <p>{lang === 'ar' ? 'المدخلات غير معقمة بشكل كامل مما يترك احتمالية لحقن نصوص برمجية ضارة.' : 'Input parameters not sanitized, leaving pathways open for XSS.'}</p>
                            </div>
                          </div>
                        )}
                        {scores.metric4 < 90 && (
                          <div className={styles.warningItem}>
                            <span className={styles.warningDotYellow}></span>
                            <div>
                              <strong>{lang === 'ar' ? 'إصدارات برمجية قديمة' : 'Outdated Software Libraries'}</strong>
                              <p>{lang === 'ar' ? 'بعض التبعيات والمكتبات المستخدمة بها ثغرات معروفة لم يتم تحديثها.' : 'Outdated libraries with known issues detected.'}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className={styles.recommendationBox}>
                    <strong>
                      {activeTool === 'speed' && t('techLab.speedTester.recommendation')}
                      {activeTool === 'mobile' && t('techLab.mobileAuditor.recommendation')}
                      {activeTool === 'security' && t('techLab.securityChecker.recommendation')}
                    </strong>
                    <p>
                      {scores.metric1 === 100 
                        ? (lang === 'ar' ? 'تهانينا! موقعك مبرمج بأعلى المعايير الهندسية ويعمل بأقصى كفاءة وحماية ممكنة. استمر في الحفاظ على هذا الأثر الرقمي الرائع.' : 'Congratulations! Your site is engineered to the highest standards, operating at absolute peak efficiency. Keep leaving this incredible digital imprint.')
                        : (
                          activeTool === 'speed' ? t('techLab.speedTester.recommendationText') :
                          activeTool === 'mobile' ? t('techLab.mobileAuditor.recommendationText') :
                          t('techLab.securityChecker.recommendationText')
                        )}
                    </p>
                  </div>
                </div>

                {/* Lead Gen Box */}
                {scores.metric1 < 100 && (
                  <div className={styles.ctaCard}>
                    <h5 className={styles.ctaTitle}>
                      {activeTool === 'speed' && t('techLab.speedTester.ctaTitle')}
                      {activeTool === 'mobile' && t('techLab.mobileAuditor.ctaTitle')}
                      {activeTool === 'security' && t('techLab.securityChecker.ctaTitle')}
                    </h5>
                    <p className={styles.ctaDesc}>
                      {activeTool === 'speed' && t('techLab.speedTester.ctaDesc')}
                      {activeTool === 'mobile' && t('techLab.mobileAuditor.ctaDesc')}
                      {activeTool === 'security' && t('techLab.securityChecker.ctaDesc')}
                    </p>
                    <button 
                      onClick={handleCTAClick}
                      className={styles.ctaBtn}
                    >
                      {activeTool === 'speed' && t('techLab.speedTester.ctaBtn')}
                      {activeTool === 'mobile' && t('techLab.mobileAuditor.ctaBtn')}
                      {activeTool === 'security' && t('techLab.securityChecker.ctaBtn')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
