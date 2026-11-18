import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { posts } from "@/content/posts";
import { publishedProjects } from "@/content/projects";
import { localePath } from "@/lib/i18n";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

// كل صفحة تظهر بنسختيها مع روابط hreflang بينهما.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const pages: { path: string; priority: number; freq: Freq }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/tech-lab", priority: 0.95, freq: "monthly" },
    { path: "/pricing", priority: 0.9, freq: "monthly" },
    { path: "/services", priority: 0.8, freq: "monthly" },
    { path: "/calculator", priority: 0.6, freq: "monthly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/blog", priority: 0.7, freq: "weekly" },
    { path: "/contact", priority: 0.7, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.6, freq: "monthly" as Freq })),
  ];
  if (publishedProjects.length > 0) {
    pages.push({ path: "/portfolio", priority: 0.7, freq: "monthly" });
    pages.push(...publishedProjects.map((p) => ({ path: `/portfolio/${p.slug}`, priority: 0.5, freq: "monthly" as Freq })));
  }

  return pages.flatMap(({ path, priority, freq }) =>
    (["ar", "en"] as const).map((lang) => ({
      url: `${base}${localePath(lang, path)}`,
      lastModified: now,
      changeFrequency: freq,
      priority: lang === "ar" ? priority : Math.max(0.1, priority - 0.05),
      alternates: {
        languages: {
          ar: `${base}${localePath("ar", path)}`,
          en: `${base}${localePath("en", path)}`,
        },
      },
    }))
  );
}
