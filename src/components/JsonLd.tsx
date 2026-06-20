import { siteConfig } from "@/lib/config";

// بيانات منظّمة (Schema.org) لتعزيز ظهور أثر في نتائج البحث — يخدم وعد الـ SEO للوكالة.
export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "أثر (ATHR)",
        alternateName: "Athar Digital Agency",
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description:
          "وكالة تصميم وتطوير مواقع ومتاجر إلكترونية فاخرة للرياديين والشركات الناشئة في السوق العربي.",
        email: siteConfig.contactEmail,
        sameAs: [
          siteConfig.social.x,
          siteConfig.social.linkedin,
          siteConfig.social.instagram,
          siteConfig.social.facebook,
        ].filter((u) => u && u !== "#"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: "أثر (ATHR)",
        inLanguage: ["ar", "en"],
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        name: "أثر (ATHR)",
        image: `${siteConfig.url}/logo.png`,
        url: siteConfig.url,
        priceRange: "$$",
        areaServed: "MENA",
        serviceType: [
          "تصميم وتطوير مواقع الويب",
          "تطوير المتاجر الإلكترونية",
          "تحسين محركات البحث (SEO)",
          "تصميم تجربة وواجهة المستخدم (UI/UX)",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
