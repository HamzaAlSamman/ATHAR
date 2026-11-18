'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/config';
import { allPackages, formatPrice, getPackage } from '@/content/packages';
import { takePrefill } from '@/lib/prefill';
import styles from './Contact.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const BUILD_TYPES = ['web', 'store', 'other'] as const;

const TEXT = {
  ar: {
    requestLabel: 'ماذا تحتاج؟',
    web: 'بناء موقع جديد',
    store: 'بناء متجر إلكتروني',
    other: 'شيء آخر',
    fixGroup: 'إصلاح موقع حالي',
    buildGroup: 'مشروع جديد',
    detailsPlaceholder: 'رابط موقعك الحالي إن وُجد، وما الذي تريد تحقيقه.',
    sending: 'جارٍ الإرسال...',
    required: 'اكتب اسمك ورقم جوالك حتى نتمكن من الرد عليك.',
    invalidPhone: 'رقم الجوال غير صحيح. اكتبه مع رمز الدولة، مثل +966 5x xxx xxxx',
    failed: 'تعذّر إرسال الطلب. جرّب مرة أخرى أو تواصل معنا عبر واتساب.',
    auditLine: 'أرغب في إصلاح موقعي بناءً على تقرير فحص مختبر أثر (الدرجة {grade}، {score}/100{fails}): https://{host}',
    failsPart: '، المشاكل المؤثرة: {fails}',
    waIntro: 'مرحباً أثر، أنا {name}.',
    waRequest: 'الطلب: {request}',
  },
  en: {
    requestLabel: 'What do you need?',
    web: 'A new website',
    store: 'A new online store',
    other: 'Something else',
    fixGroup: 'Fix an existing site',
    buildGroup: 'New project',
    detailsPlaceholder: 'Your current site link if you have one, and what you want to achieve.',
    sending: 'Sending...',
    required: 'Enter your name and phone number so we can reply.',
    invalidPhone: 'That phone number looks wrong. Include the country code, e.g. +966 5x xxx xxxx',
    failed: 'Could not send your request. Try again or contact us on WhatsApp.',
    auditLine: 'I would like to fix my website based on the ATHR Lab audit (grade {grade}, {score}/100{fails}): https://{host}',
    failsPart: ', {fails} significant issues',
    waIntro: 'Hello ATHR, I am {name}.',
    waRequest: 'Request: {request}',
  },
} as const;

function fill(template: string, data: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(data[k] ?? ''));
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const ui = TEXT[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [request, setRequest] = useState<string>('web');
  const [details, setDetails] = useState('');
  const [website, setWebsite] = useState(''); // حقل فخ للبوتات: مخفي عن البشر
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  // تعبئة النموذج من التقرير أو صفحة الأسعار أو الحاسبة (التخزين المحلي متاح بعد الترطيب فقط).
  useEffect(() => {
    const data = takePrefill();
    if (!data) return;
    const pkg = getPackage(data.packageId);
    /* eslint-disable react-hooks/set-state-in-effect -- قراءة تخزين العميل مرة واحدة عند التحميل */
    if (pkg) setRequest(pkg.id);
    else if (data.requestType && (BUILD_TYPES as readonly string[]).includes(data.requestType)) setRequest(data.requestType);
    else if (data.audit) setRequest('complete');

    if (data.audit) {
      const { host, grade, score, fails } = data.audit;
      setDetails(
        fill(ui.auditLine, {
          host: String(host).slice(0, 200),
          grade: String(grade).slice(0, 1),
          score: Number(score) || 0,
          fails: fails ? fill(ui.failsPart, { fails }) : '',
        })
      );
    } else if (data.details) {
      setDetails(String(data.details).slice(0, 2000));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ui]);

  const requestLabel = (value: string) => {
    const pkg = getPackage(value);
    if (pkg) return `${pkg.title[lang]} (${formatPrice(pkg, lang)})`;
    return ui[value as (typeof BUILD_TYPES)[number]] ?? value;
  };

  const validate = (): string | null => {
    if (!name.trim() || !phone.trim()) return ui.required;
    if (phone.replace(/\D/g, '').length < 8) return ui.invalidPhone;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      setStatus('error');
      return;
    }

    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          projectType: request,
          details,
          lang,
          website,
          source: getPackage(request) ? `package:${request}` : 'contact-form',
        }),
      });
      if (!res.ok) throw new Error('request_failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setPhone('');
      setDetails('');
    } catch {
      setError(ui.failed);
      setStatus('error');
    }
  };

  const handleWhatsApp = () => {
    const lines = [
      name.trim() ? fill(ui.waIntro, { name: name.trim() }) : '',
      fill(ui.waRequest, { request: requestLabel(request) }),
      details.trim(),
    ].filter(Boolean);
    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('contact.title')}</h2>
          <p className={styles.subtitle}>{t('contact.subtitle')}</p>
        </div>

        <div className={styles.formWrapper}>
          {status === 'sent' && (
            <div className={styles.successAlert} role="status">
              {t('contact.success')}
            </div>
          )}
          {status === 'error' && error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-name">
                {t('contact.name')} *
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-phone">
                {t('contact.phone')} *
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5x xxx xxxx"
                required
                maxLength={30}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-email">
                {t('contact.email')}
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={160}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-request">
                {ui.requestLabel}
              </label>
              <select
                id="contact-request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className={styles.select}
              >
                <optgroup label={ui.fixGroup}>
                  {allPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {requestLabel(pkg.id)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={ui.buildGroup}>
                  {BUILD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ui[type]}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-details">
                {t('contact.details')}
              </label>
              <textarea
                id="contact-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={ui.detailsPlaceholder}
                maxLength={2000}
                className={styles.textarea}
              />
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
              {status === 'sending' ? ui.sending : t('contact.submit')}
            </button>

            <button type="button" className={styles.whatsappBtn} onClick={handleWhatsApp}>
              <span>{t('contact.whatsapp')}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
