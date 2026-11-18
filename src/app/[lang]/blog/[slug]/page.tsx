import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostContent from "./BlogPostContent";
import { posts, getPost } from "@/content/posts";
import { isLocale, locales, pageMetadata } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!isLocale(lang) || !post) return {};
  const base = pageMetadata(lang, `/blog/${post.slug}`, {
    ar: { title: `${post.title.ar} | مدونة أثر`, description: post.excerpt.ar },
    en: { title: `${post.title.en} | ATHR Blog`, description: post.excerpt.en },
  });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", images: [{ url: post.cover }] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <BlogPostContent post={post} />
      </main>
      <Footer />
    </>
  );
}
