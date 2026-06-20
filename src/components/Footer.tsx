'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const targetPath = id === 'home' ? '/' : `/${id}`;
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

  const socialLinks = [
    {
      name: 'X',
      url: siteConfig.social.x,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: siteConfig.social.linkedin,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: siteConfig.social.instagram,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: siteConfig.social.facebook,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* عمود شعار الشركة والوصف */}
        <div className={styles.infoCol}>
          <div className={styles.logoContainer} onClick={handleLogoClick}>
            <Image
              src="/logo_white.png"
              alt="ATHR Logo"
              width={400}
              height={400}
              className={styles.logoImage}
            />
          </div>
          <p className={styles.desc}>
            {t('footer.text')}
          </p>
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} className={styles.socialIcon} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* عمود روابط سريعة */}
        <div className={styles.linksCol}>
          <h4 className={styles.title}>{t('nav.home')}</h4>
          <ul className={styles.linksList}>
            <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={styles.link}>{t('nav.home')}</a></li>
            <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')} className={styles.link}>{t('nav.services')}</a></li>
            <li><a href="#portfolio" onClick={(e) => handleNavClick(e, 'portfolio')} className={styles.link}>{t('nav.portfolio')}</a></li>
            <li><a href="#tech-lab" onClick={(e) => handleNavClick(e, 'tech-lab')} className={styles.link}>{t('nav.techLab')}</a></li>
          </ul>
        </div>

        {/* عمود خدمات وروابط فرعية */}
        <div className={styles.linksCol}>
          <h4 className={styles.title}>{t('nav.services')}</h4>
          <ul className={styles.linksList}>
            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={styles.link}>{t('nav.about')}</a></li>
            <li><a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className={styles.link}>{t('nav.pricing')}</a></li>
            <li><a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className={styles.link}>{t('nav.blog')}</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className={styles.link}>{t('nav.contact')}</a></li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p className={styles.copyright}>
          {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
