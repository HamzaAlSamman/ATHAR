'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: { key: string, id: string }) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetPath = item.key === 'home' ? '/' : `/${item.id}`;
    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push(targetPath);
    }
  };

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const navItems = [
    { key: 'home', id: 'home' },
    { key: 'services', id: 'services' },
    { key: 'portfolio', id: 'portfolio' },
    { key: 'techLab', id: 'tech-lab' },
    { key: 'calculator', id: 'calculator' },
    { key: 'about', id: 'about' },
    { key: 'pricing', id: 'pricing' },
    { key: 'blog', id: 'blog' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navbar}`}>
        {/* شعار أثر الرسمي */}
        <div className={styles.logoContainer} onClick={handleLogoClick}>
          <Image
            src="/logo_transparent.png"
            alt="ATHR Logo"
            width={444}
            height={456}
            priority
            className={styles.logoImage}
          />
        </div>

        {/* روابط التنقل للشاشات الكبيرة */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={`#${item.id}`}
                className={styles.navLink}
                onClick={(e) => handleNavClick(e, item)}
              >
                {t(`nav.${item.key}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* الإجراءات: تبديل اللغة وطلب الاستشارة */}
        <div className={styles.actions}>
          <button className={styles.langToggle} onClick={toggleLanguage}>
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <a
            href="#contact"
            className={styles.consultBtn}
            onClick={(e) => handleNavClick(e, { key: 'contact', id: 'contact' })}
          >
            {t('nav.contact')}
          </a>
        </div>

        {/* زر القائمة للجوال */}
        <button
          className={`${styles.menuToggle} ${mobileMenuOpen ? styles.menuOpen : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* القائمة للجوال */}
        <nav className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <ul className={styles.mobileLinks}>
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={`#${item.id}`}
                  className={styles.mobileLink}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {t(`nav.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <button className={styles.langToggle} onClick={toggleLanguage}>
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <a
              href="#contact"
              className={styles.consultBtn}
              onClick={(e) => handleNavClick(e, { key: 'contact', id: 'contact' })}
            >
              {t('nav.contact')}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
