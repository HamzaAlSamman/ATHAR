'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { posts, localized } from '@/content/posts';
import styles from './Blog.module.css';

export default function Blog() {
  const { t, lang, path } = useLanguage();

  return (
    <section id="blog" className={styles.blog}>
      <div className="container">
        {/* رأس القسم */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>{t('blog.title')}</h2>
          <p className={styles.subtitle}>{t('blog.subtitle')}</p>
        </div>

        {/* شبكة المقالات */}
        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.card}>
              <span className={styles.tag}>{localized(post.category, lang)}</span>
              <h3 className={styles.postTitle}>{localized(post.title, lang)}</h3>
              <p className={styles.excerpt}>{localized(post.excerpt, lang)}</p>

              <Link
                href={path(`/blog/${post.slug}`)}
                className={styles.readMoreBtn}
                id={`blog-read-more-${post.slug}`}
              >
                <span>{t('blog.readMore')}</span>
                <span>{lang === 'ar' ? '←' : '→'}</span>
              </Link>

              <div className={styles.meta}>
                <span>{localized(post.date, lang)}</span>
                <span>{localized(post.time, lang)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
