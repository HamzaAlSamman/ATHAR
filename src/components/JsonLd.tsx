import { siteConfig, type Locale } from "@/lib/config";
import { localePath } from "@/lib/i18n";

// بيانات منظّمة (Schema.org): تعرّف غوغل بالوكالة وبأداة الفحص المجانية.
export default function JsonLd({ lang }: { lang: Locale }) {
  const ar = lang === "ar";
  const sameAs = [siteConfig.social.x, siteConfig.social.linkedin, siteConfig.social.instagram, siteConfig.social.facebook].filter(
    (u) => u && u !== "#"
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: ar ? "أثر (ATHR)" : "ATHR",
        alternateName: ar ? "ATHR" : "أثر",
        url: `${siteConfig.url}${localePath(lang)}`,
        logo: `${siteConfig.url}/logo.png`,
        description: ar
          ? "شركة برمجة: مواقع ومتاجر، تطبيقات ويب وأنظمة إدارة، تطبيقات جوال، وأتمتة بالذكاء الاصطناعي."
          : "Software studio: websites and stores, web apps and business systems, mobile apps, and AI automation.",
        email: siteConfig.contactEmail,
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: ar ? "أثر (ATHR)" : "ATHR",
        inLanguage: ["ar", "en"],
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "WebApplication",
        name: ar ? "مختبر أثر: فحص المواقع المجاني" : "ATHR Lab: free website audit",
        url: `${siteConfig.url}${localePath(lang, "/tech-lab")}`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        inLanguage: lang,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify لا يهرّب "<"، فنهرّبه يدوياً حتى لا يغلق نص ما وسم السكربت.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
