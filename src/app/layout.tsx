import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { siteConfig, LANG_COOKIE, normalizeLocale } from "@/lib/config";
import JsonLd from "@/components/JsonLd";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "أثر (ATHR) | وكالة تصميم وتطوير مواقع ومتاجر إلكترونية فاخرة",
  description: "نصنع بوابتك الرقمية التي تضاعف مبيعاتك وتعزز ثقة عملائك. تصاميم هندسية مخصصة، سرعة فائقة أقل من 1.2 ثانية، وأمان متكامل يحمي استثمارك الرقمي.",
  keywords: ["أثر", "ATHR", "تصميم مواقع", "تطوير متاجر", "سلة", "زد", "Next.js", "تطوير ويب", "سيو", "UIUX"],
  authors: [{ name: "أثر الرقمية" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "أثر (ATHR)",
    title: "أثر (ATHR) | وكالة تصميم وتطوير مواقع ومتاجر إلكترونية فاخرة",
    description: "نصنع بوابتك الرقمية التي تضاعف مبيعاتك وتعزز ثقة عملائك بأداء فائق وأمان متكامل.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "أثر ATHR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أثر (ATHR) | وكالة تصميم وتطوير مواقع ومتاجر إلكترونية فاخرة",
    description: "نصنع بوابتك الرقمية التي تضاعف مبيعاتك وتعزز ثقة عملائك.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // قراءة لغة المستخدم من الكوكي على الخادم لضبط <html lang/dir> قبل الترطيب (hydration).
  const cookieStore = await cookies();
  const lang = normalizeLocale(cookieStore.get(LANG_COOKIE)?.value);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body>
        <JsonLd />
        <LanguageProvider initialLang={lang}>
          {children}
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
