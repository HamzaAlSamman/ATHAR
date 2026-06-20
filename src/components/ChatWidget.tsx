'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ChatWidget.module.css';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting =
    lang === 'ar'
      ? 'مرحباً! أنا مساعد أثر الذكي 👋 أخبرني عن فكرة موقعك أو متجرك وسأقترح لك الأنسب.'
      : "Hi! I'm Athar's AI assistant 👋 Tell me about your website or store idea and I'll suggest the best fit.";

  useEffect(() => {
    // رسالة ترحيب تُعاد بلغة الواجهة طالما لم يبدأ المستخدم المحادثة.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- مزامنة الترحيب مع تغيّر اللغة
    setMessages((prev) =>
      prev.length === 0 || (prev.length === 1 && prev[0].role === 'assistant')
        ? [{ role: 'assistant', content: greeting }]
        : prev
    );
  }, [lang, greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        (lang === 'ar' ? 'تعذّر الرد حالياً، جرّب لاحقاً.' : 'Could not reply right now, try later.');
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            lang === 'ar' ? 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.' : 'Connection error, please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Athar AI assistant">
          <div className={styles.header}>
            <span className={styles.headerDot} />
            <div>
              <div className={styles.headerTitle}>{lang === 'ar' ? 'مساعد أثر الذكي' : 'Athar Assistant'}</div>
              <div className={styles.headerSub}>{lang === 'ar' ? 'يرد عادة خلال ثوانٍ' : 'Usually replies in seconds'}</div>
            </div>
          </div>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.user : styles.bot}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className={styles.typing}>{lang === 'ar' ? '...يكتب' : 'typing...'}</div>}
          </div>

          <div className={styles.inputBar}>
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
              aria-label={lang === 'ar' ? 'رسالة' : 'message'}
            />
            <button className={styles.send} onClick={send} disabled={loading || !input.trim()}>
              {lang === 'ar' ? 'إرسال' : 'Send'}
            </button>
          </div>
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label={lang === 'ar' ? 'افتح مساعد أثر' : 'Open Athar assistant'}
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}
