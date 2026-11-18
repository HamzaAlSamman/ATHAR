'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { stripLocale } from '@/lib/i18n';
import styles from './Header.module.css';

// روابط حقيقية (وليست #أقسام) حتى تتبعها محركات البحث وتعمل بفتح تبويب جديد.
const NAV_ITEMS = [
  { key: 'services', href: '/services' },
  { key: 'pricing', href: '/pricing' },
  { key: 'techLab', href: '/tech-lab' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const { lang, toggleLanguage, t, path } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const current = stripLocale(usePathname() ?? '/');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القائمة بزر Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const close = () => setMobileMenuOpen(false);
  const isActive = (href: string) => current === href || current.startsWith(`${href}/`);
  const otherLang = lang === 'ar' ? 'English' : 'العربية';

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navbar}`}>
        <Link href={path('/')} className={styles.logoContainer} onClick={close} aria-label={lang === 'ar' ? 'أثر — الرئيسية' : 'ATHR — Home'}>
          <Image src="/logo_transparent.png" alt="" width={444} height={456} priority className={styles.logoImage} />
        </Link>

        <nav aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
          <ul className={styles.navLinks}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={path(item.href)}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.langToggle} onClick={toggleLanguage} lang={lang === 'ar' ? 'en' : 'ar'}>
            {otherLang}
          </button>
          <Link href={path('/tech-lab')} className={styles.consultBtn}>
            {t('nav.cta')}
          </Link>
        </div>

        <button
          type="button"
          className={`${styles.menuToggle} ${mobileMenuOpen ? styles.menuOpen : ''}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={lang === 'ar' ? 'القائمة' : 'Menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="mobile-menu"
          className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile menu'}
          inert={!mobileMenuOpen}
        >
          <ul className={styles.mobileLinks}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={path(item.href)}
                  className={`${styles.mobileLink} ${isActive(item.href) ? styles.active : ''}`}
                  onClick={close}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.langToggle}
              onClick={() => {
                close();
                toggleLanguage();
              }}
            >
              {otherLang}
            </button>
            <Link href={path('/tech-lab')} className={styles.consultBtn} onClick={close}>
              {t('nav.cta')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
