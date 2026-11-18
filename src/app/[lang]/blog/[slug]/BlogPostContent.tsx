'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { localized, type BlogPost } from '@/content/posts';
import styles from '../../article.module.css';

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const { lang, t, path } = useLanguage();

  return (
    <article className={`container ${styles.wrapper}`}>
      <nav className={styles.breadcrumb}>
        <Link href={path('/')}>{t('nav.home')}</Link>
        <span>/</span>
        <Link href={path('/blog')}>{t('nav.blog')}</Link>
      </nav>

      <span className={styles.category}>{localized(post.category, lang)}</span>
      <h1 className={styles.title}>{localized(post.title, lang)}</h1>
      <div className={styles.meta}>
        <span>{localized(post.date, lang)}</span>
        <span>•</span>
        <span>{localized(post.time, lang)}</span>
      </div>

      <p className={styles.lead}>{localized(post.excerpt, lang)}</p>

      {post.blocks.map((block, i) => (
        <section key={i} className={styles.block}>
          <h2 className={styles.blockHeading}>{localized(block.heading, lang)}</h2>
          <p className={styles.blockBody}>{localized(block.body, lang)}</p>
        </section>
      ))}

      <div className={styles.ctaBox}>
        <h3 className={styles.ctaTitle}>
          {lang === 'ar'
            ? 'جاهز لتطبيق هذا على مشروعك؟'
            : 'Ready to apply this to your project?'}
        </h3>
        <Link href={path('/contact')} className={styles.ctaBtn}>
          {t('hero.cta')}
        </Link>
      </div>
    </article>
  );
}
