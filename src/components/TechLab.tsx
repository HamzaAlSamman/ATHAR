'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { auditUi, fillText, findingText } from '@/locales/audit';
import type {
  AuditCategory,
  AuditErrorCode,
  AuditFailure,
  AuditReport,
  Finding,
  FindingStatus,
} from '@/lib/audit/types';
import styles from './TechLab.module.css';

type Phase = 'idle' | 'scanning' | 'done' | 'error';

const CATEGORY_ORDER: AuditCategory[] = ['performance', 'security', 'seo'];
const STATUS_ORDER: Record<FindingStatus, number> = { fail: 0, warn: 1, pass: 2 };
const RING_LENGTH = 2 * Math.PI * 42;

function toneFor(score: number): 'good' | 'mid' | 'bad' {
  if (score >= 80) return 'good';
  if (score >= 50) return 'mid';
  return 'bad';
}

/** يحذف البروتوكول والشرطة الأخيرة ليُعرض الرابط نظيفاً في حقل الإدخال ورابط المشاركة. */
function cleanTarget(value: string): string {
  return value.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const tone = toneFor(score);
  return (
    <div className={styles.scoreCard}>
      <div className={styles.ring}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" className={styles.ringTrack} />
          <circle
            cx="50"
            cy="50"
            r="42"
            className={`${styles.ringValue} ${styles[tone]}`}
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - score / 100)}
          />
        </svg>
        <span className={styles.ringNumber}>{score}</span>
      </div>
      <span className={styles.scoreLabel}>{label}</span>
    </div>
  );
}

export default function TechLab({ initialUrl = '' }: { initialUrl?: string }) {
  const { lang } = useLanguage();
  const router = useRouter();
  const ui = auditUi[lang];

  const startTarget = cleanTarget(initialUrl);
  const [url, setUrl] = useState(startTarget);
  const [phase, setPhase] = useState<Phase>(startTarget ? 'scanning' : 'idle');
  const [stage, setStage] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [errorCode, setErrorCode] = useState<AuditErrorCode | null>(null);
  const [copied, setCopied] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const showResult = useCallback((target: string, data: AuditReport | AuditFailure | null) => {
    if (data === null) return; // طلب أُلغي لأن فحصاً أحدث بدأ
    if (data.ok) {
      setReport(data);
      setPhase('done');
      // الرابط في شريط العنوان يصير رابط التقرير نفسه، جاهزاً للنسخ والمشاركة.
      window.history.replaceState(null, '', `/tech-lab?url=${encodeURIComponent(target)}`);
    } else {
      setErrorCode(data.error);
      setPhase('error');
    }
  }, []);

  const scan = useCallback(
    (target: string) => {
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      fetch(`/api/audit?url=${encodeURIComponent(target)}`, { signal: controller.signal })
        .then((res) => res.json() as Promise<AuditReport | AuditFailure>)
        .catch((err: unknown): AuditFailure | null =>
          err instanceof DOMException && err.name === 'AbortError' ? null : { ok: false, error: 'server_error' }
        )
        .then((data) => showResult(target, data));
    },
    [showResult]
  );

  // رابط تقرير مشارَك (‎/tech-lab?url=...‎) يبدأ الفحص فور فتح الصفحة.
  useEffect(() => {
    if (startTarget) scan(startTarget);
    return () => requestRef.current?.abort();
  }, [startTarget, scan]);

  // مراحل الكونسول تتقدم أثناء انتظار الرد الحقيقي، وتتوقف عند آخر مرحلة حتى يصل.
  useEffect(() => {
    if (phase !== 'scanning') return;
    const timer = setInterval(() => {
      setStage((current) => Math.min(current + 1, auditUi.ar.stages.length - 1));
    }, 1400);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') resultsRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = cleanTarget(url);
    if (!target || phase === 'scanning') return;
    setUrl(target);
    setReport(null);
    setErrorCode(null);
    setStage(0);
    setPhase('scanning');
    scan(target);
  };

  const shareLink = () =>
    `${window.location.origin}/tech-lab?url=${encodeURIComponent(cleanTarget(url))}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* الحافظة غير متاحة: الرابط ظاهر في شريط العنوان */
    }
  };

  const handleFixRequest = () => {
    if (!report) return;
    const fails = report.findings.filter((f) => f.status === 'fail').length;
    // نموذج التواصل يقرأ هذه القيمة ويملأ تفاصيل الطلب تلقائياً.
    localStorage.setItem(
      'athar_prefill',
      JSON.stringify({ tool: 'audit', url: report.host, grade: report.grade, score: report.scores.overall, fails })
    );
    router.push('/contact');
  };

  const renderFinding = (finding: Finding) => {
    const text = findingText[finding.id]?.[lang];
    if (!text) return null;
    return (
      <li key={finding.id}>
        <details className={`${styles.finding} ${styles[finding.status]}`}>
          <summary className={styles.findingSummary}>
            <span className={`${styles.chip} ${styles[finding.status]}`}>{ui.statusLabel[finding.status]}</span>
            <span className={styles.findingTitle}>{fillText(text.issue, finding.data)}</span>
            <span className={styles.chevron} aria-hidden="true" />
          </summary>
          <div className={styles.findingBody}>
            <p>
              <strong>{ui.why}</strong> {text.why}
            </p>
            <p>
              <strong>{ui.fix}</strong> <span dir="auto">{text.fix}</span>
            </p>
          </div>
        </details>
      </li>
    );
  };

  const fails = report?.findings.filter((f) => f.status === 'fail').length ?? 0;
  const warns = report?.findings.filter((f) => f.status === 'warn').length ?? 0;

  return (
    <section id="tech-lab" className={styles.techLab}>
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.tagline}>{ui.tagline}</span>
          <h1 className={styles.title}>{ui.title}</h1>
          <p className={styles.subtitle}>{ui.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="audit-url" className={styles.srOnly}>
            {ui.inputLabel}
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix} aria-hidden="true">
              https://
            </span>
            <input
              id="audit-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              dir="ltr"
              placeholder={ui.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={phase === 'scanning'}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" disabled={phase === 'scanning' || !url.trim()} className={styles.submitBtn}>
            {phase === 'scanning' ? ui.scanning : phase === 'done' ? ui.rescan : ui.start}
          </button>
        </form>

        <ul className={styles.trustRow}>
          {ui.trust.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {phase === 'scanning' && (
          <div className={styles.console} role="status" aria-live="polite">
            <div className={styles.consoleHeader}>
              <span className={styles.consoleDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.consoleTitle} dir="ltr">
                {cleanTarget(url)}
              </span>
            </div>
            <ol className={styles.consoleBody}>
              {ui.stages.slice(0, stage + 1).map((line, index) => (
                <li key={line} className={index === stage ? styles.consoleActive : styles.consoleDone}>
                  {line}
                </li>
              ))}
            </ol>
            <div className={styles.progress} aria-hidden="true">
              <span style={{ width: `${((stage + 1) / (ui.stages.length + 1)) * 100}%` }} />
            </div>
          </div>
        )}

        {phase === 'error' && errorCode && (
          <div className={styles.errorBox} role="alert">
            {ui.errors[errorCode]}
          </div>
        )}

        {phase === 'done' && report && (
          <div className={styles.report} ref={resultsRef} tabIndex={-1}>
            <div className={styles.summaryCard}>
              <div className={`${styles.gradeBadge} ${styles[toneFor(report.scores.overall)]}`}>
                <span className={styles.gradeLetter}>{report.grade}</span>
                <span className={styles.gradeCaption}>{ui.gradeLabel}</span>
              </div>
              <div className={styles.summaryText}>
                <h2 className={styles.host} dir="ltr">
                  {report.host}
                </h2>
                <p className={styles.overall}>
                  {ui.overall}: <strong>{report.scores.overall}/100</strong>
                </p>
                <p className={styles.summaryLine}>
                  {fails + warns === 0 ? ui.summaryClean : fillText(ui.summary, { fails, warns })}
                </p>
              </div>
              <div className={styles.shareRow}>
                <button type="button" onClick={handleCopy} className={styles.ghostBtn}>
                  {copied ? ui.copied : ui.share}
                </button>
                <a
                  className={styles.ghostBtn}
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${fillText(ui.shareMessage, {
                      host: report.host,
                      grade: report.grade,
                      score: report.scores.overall,
                    })}\n${typeof window === 'undefined' ? '' : shareLink()}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ui.whatsapp}
                </a>
              </div>
            </div>

            <div className={styles.scoresGrid}>
              {CATEGORY_ORDER.map((category) => (
                <ScoreRing key={category} score={report.scores[category]} label={ui.categories[category]} />
              ))}
            </div>

            <dl className={styles.facts}>
              <div>
                <dt>{ui.facts.ttfb}</dt>
                <dd>
                  {report.facts.ttfbMs} {ui.facts.ms}
                </dd>
              </div>
              <div>
                <dt>{ui.facts.size}</dt>
                <dd>
                  {report.facts.htmlKB} {ui.facts.kb}
                </dd>
              </div>
              <div>
                <dt>{ui.facts.cert}</dt>
                <dd>
                  {report.facts.certDaysLeft === null
                    ? ui.facts.none
                    : `${report.facts.certDaysLeft} ${ui.facts.days}`}
                </dd>
              </div>
              <div>
                <dt>{ui.facts.tls}</dt>
                <dd dir="ltr">{report.facts.tlsProtocol ?? ui.facts.none}</dd>
              </div>
            </dl>

            {CATEGORY_ORDER.map((category) => {
              const items = report.findings
                .filter((f) => f.category === category)
                .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.weight - a.weight);
              const issues = items.filter((f) => f.status !== 'pass');
              const passed = items.filter((f) => f.status === 'pass');
              return (
                <section key={category} className={styles.category}>
                  <header className={styles.categoryHeader}>
                    <h3>{ui.categories[category]}</h3>
                    <span className={`${styles.categoryScore} ${styles[toneFor(report.scores[category])]}`}>
                      {report.scores[category]}
                    </span>
                  </header>
                  {issues.length > 0 && <ul className={styles.findings}>{issues.map(renderFinding)}</ul>}
                  {passed.length > 0 && (
                    <details className={styles.passedGroup}>
                      <summary>{fillText(ui.passedCount, { count: passed.length })}</summary>
                      <ul>
                        {passed.map((f) => (
                          <li key={f.id}>{fillText(findingText[f.id]?.[lang]?.pass ?? f.id, f.data)}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </section>
              );
            })}

            <div className={styles.cta}>
              <div>
                <h3>{ui.ctaTitle}</h3>
                <p>{ui.ctaDesc}</p>
              </div>
              <button type="button" onClick={handleFixRequest} className={styles.ctaBtn}>
                {ui.ctaBtn}
              </button>
            </div>

            <p className={styles.method}>{ui.method}</p>
          </div>
        )}
      </div>
    </section>
  );
}
