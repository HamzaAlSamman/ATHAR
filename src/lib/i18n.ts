// اللغات والروابط: كل صفحة عامة لها رابطان (/ar/... و /en/...) حتى يفهرس غوغل النسختين.
import type { Metadata } from "next";
import { siteConfig, type Locale } from "./config";

export const locales: readonly Locale[] = ["ar", "en"] as const;
export const defaultLocale: Locale = "ar";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

/** يضيف بادئة اللغة لمسار داخلي: ("en", "/pricing") → "/en/pricing". */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** يزيل بادئة اللغة: "/en/pricing" → "/pricing". */
export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  return stripped || "/";
}

interface PageText {
  title: string;
  description: string;
}

/**
 * metadata موحّدة لكل صفحة: عنوان ووصف بلغة الصفحة، رابط أساسي، وروابط hreflang للغة الأخرى.
 * `path` بدون بادئة اللغة، مثل "/pricing".
 */
export function pageMetadata(
  lang: Locale,
  path: string,
  text: Record<Locale, PageText>,
  extra: Partial<Metadata> = {}
): Metadata {
  const { title, description } = text[lang];
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: localePath("ar", path),
        en: localePath("en", path),
        "x-default": localePath(defaultLocale, path),
      },
    },
    openGraph: {
      type: "website",
      siteName: lang === "ar" ? "أثر (ATHR)" : "ATHR",
      locale: lang === "ar" ? "ar_SA" : "en_US",
      url: `${siteConfig.url}${url}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    ...extra,
  };
}
