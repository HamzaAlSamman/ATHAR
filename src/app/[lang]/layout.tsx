import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cairo, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/config";
import { isLocale, locales, pageMetadata } from "@/lib/i18n";
import JsonLd from "@/components/JsonLd";
import ChatWidget from "@/components/ChatWidget";

// الخطوط تُستضاف مع الموقع نفسه: بدون طلب خارجي لغوغل يعطّل العرض، وبدون قفزة في التخطيط.
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700"], variable: "--font-cairo", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"], variable: "--font-plex-arabic", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jakarta", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// أي بادئة غير ar/en تعطي 404 بدل صفحة فارغة.
export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#1C2833",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    metadataBase: new URL(siteConfig.url),
    ...pageMetadata(lang, "/", {
      ar: {
        title: "أثر (ATHR) | افحص موقعك مجاناً ونصلح لك السرعة والأمان والسيو",
        description:
          "فحص مجاني وحقيقي لسرعة موقعك وأمانه وظهوره في غوغل، ثم إصلاح بسعر ثابت. وكالة أثر لتصميم وتطوير المواقع والمتاجر الإلكترونية.",
      },
      en: {
        title: "ATHR | Free website audit, then fixed-price speed, security & SEO fixes",
        description:
          "A free, real audit of your site's speed, security and Google visibility, followed by fixes at a fixed price. ATHR builds websites and online stores.",
      },
    }),
    applicationName: "ATHR",
    icons: { icon: "/favicon.ico" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${plexArabic.variable} ${jakarta.variable}`}
    >
      <body>
        <JsonLd lang={lang} />
        <LanguageProvider lang={lang}>
          {children}
          <ChatWidget />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
