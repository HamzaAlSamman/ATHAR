'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/config';
import styles from './Contact.module.css';

export default function Contact() {
  const { t, lang } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('web');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // الاستماع لحدث حاسبة التسعير التفاعلية لتعبئة البيانات تلقائياً
    const handleEstimateSelected = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.projectType) {
          setProjectType(customEvent.detail.projectType);
        }
        if (customEvent.detail.details) {
          setDetails(customEvent.detail.details);
        }
      }
    };

    window.addEventListener('athar_estimate_selected', handleEstimateSelected);
    
    // التحقق من وجود بيانات فحص تقني في التخزين المحلي لتعبئة النموذج
    try {
      const storedPrefill = localStorage.getItem('athar_prefill');
      if (storedPrefill) {
        const data = JSON.parse(storedPrefill);
        if (data.url) {
          const host = String(data.url).slice(0, 200);
          const grade = typeof data.grade === 'string' ? data.grade.slice(0, 1) : '';
          const score = Number.isFinite(data.score) ? Number(data.score) : null;
          const fails = Number.isFinite(data.fails) ? Number(data.fails) : null;
          const hasResult = Boolean(grade) && score !== null;
          const resultAr = hasResult
            ? ` (الدرجة ${grade}، ${score}/100${fails ? `، المشاكل المؤثرة: ${fails}` : ''})`
            : '';
          const resultEn = hasResult
            ? ` (grade ${grade}, ${score}/100${fails ? `, ${fails} significant issues` : ''})`
            : '';

          // تعبئة من نتائج المختبر التقني المحفوظة محلياً (تتم بعد الترطيب فقط).
          // eslint-disable-next-line react-hooks/set-state-in-effect -- قراءة تخزين العميل عند التحميل
          setProjectType('web');
          setDetails(
            lang === 'ar'
              ? `أرغب في إصلاح مشاكل موقعي بناءً على تقرير فحص مختبر أثر${resultAr}: https://${host}`
              : `I would like to fix my website based on the Athar Lab audit${resultEn}: https://${host}`
          );
        }
        localStorage.removeItem('athar_prefill');
      }
    } catch (err) {
      console.error('Error parsing athar_prefill:', err);
    }

    return () => window.removeEventListener('athar_estimate_selected', handleEstimateSelected);
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone) {
      alert(lang === 'ar' ? 'الرجاء إدخال الاسم ورقم الجوال للتواصل.' : 'Please enter your name and phone number.');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, projectType, details, lang, source: 'contact-form' }),
      });
      if (!res.ok) throw new Error('request_failed');

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');

      // تفريغ البيانات بعد 10 ثوانٍ وإغلاق التنبيه
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
      }, 10000);
    } catch {
      setError(
        lang === 'ar'
          ? 'تعذّر إرسال الطلب، يرجى المحاولة عبر الواتساب.'
          : 'Could not send your request, please try via WhatsApp.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = () => {
    if (!name || !phone) {
      alert(lang === 'ar' ? 'الرجاء إدخال الاسم ورقم الجوال للتواصل عبر الواتساب.' : 'Please enter your name and phone number first.');
      return;
    }
    
    // تنسيق الرسالة المرسلة للواتساب
    const message = lang === 'ar' 
      ? `السلام عليكم وكالة أثر، أنا ${name}، رقم جوالي: ${phone}. أرغب في استشارة حول مشروع: ${projectType === 'web' ? 'موقع تعريفي' : 'متجر إلكتروني'}. تفاصيل المشروع: ${details}`
      : `Hello Athar Agency, I am ${name}, my phone is: ${phone}. I want a consultation for a ${projectType === 'web' ? 'Website' : 'E-store'}. Details: ${details}`;
      
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('contact.title')}</h2>
          <p className={styles.subtitle}>{t('contact.subtitle')}</p>
        </div>

        {/* نموذج الاتصال */}
        <div className={styles.formWrapper}>
          {submitted && (
            <div className={styles.successAlert}>
              {t('contact.success')}
            </div>
          )}
          {error && (
            <div className={styles.successAlert} style={{ background: 'var(--color-coral)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* الاسم */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-name">{t('contact.name')} *</label>
              <input 
                type="text" 
                id="contact-name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={lang === 'ar' ? 'أحمد محمد' : 'John Doe'}
                required
                className={styles.input}
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-email">{t('contact.email')}</label>
              <input 
                type="email" 
                id="contact-email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="info@athar.agency"
                className={styles.input}
              />
            </div>

            {/* رقم الجوال */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-phone">{t('contact.phone')} *</label>
              <input 
                type="tel" 
                id="contact-phone"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+966 50 000 0000"
                required
                className={styles.input}
              />
            </div>

            {/* نوع المشروع */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-project-type">{t('contact.projectType')}</label>
              <select 
                id="contact-project-type"
                value={projectType} 
                onChange={(e) => setProjectType(e.target.value)}
                className={styles.select}
              >
                <option value="web">{t('calculator.typeWeb')}</option>
                <option value="store">{t('calculator.typeStore')}</option>
              </select>
            </div>

            {/* التفاصيل */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="contact-details">{t('contact.details')}</label>
              <textarea 
                id="contact-details"
                value={details} 
                onChange={(e) => setDetails(e.target.value)} 
                placeholder={lang === 'ar' ? 'اكتب تفاصيل فكرتك أو الباقة التي اخترتها...' : 'Describe your project idea or selected package...'}
                className={styles.textarea}
              />
            </div>

            {/* أزرار الإجراءات */}
            <button type="submit" className={styles.submitBtn} id="contact-submit-btn" disabled={sending}>
              {sending ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : t('contact.submit')}
            </button>

            <button 
              type="button" 
              className={styles.whatsappBtn} 
              onClick={handleWhatsApp}
              id="contact-whatsapp-btn"
            >
              <span>{t('contact.whatsapp')}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
