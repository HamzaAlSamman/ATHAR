import type { Metadata } from "next";
import Header from "@/components/Header";
import TechLab from "@/components/TechLab";
import Footer from "@/components/Footer";
import { isLocale, pageMetadata } from "@/lib/i18n";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function targetFrom(searchParams: SearchParams): Promise<string> {
  const value = (await searchParams).url;
  const raw = Array.isArray(value) ? value[0] : value;
  // يُعرض في العنوان ويُرسل للفحص: نقصّ الطول ونحذف ما ليس جزءاً من رابط.
  return (raw ?? "").trim().slice(0, 200).replace(/[\s<>"'`]/g, "");
}

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/tech-lab">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = pageMetadata(lang, "/tech-lab", {
    ar: {
      title: "افحص موقعك مجاناً: السرعة والأمان والسيو | مختبر أثر",
      description:
        "فحص مجاني وحقيقي لموقعك: سرعة التحميل، شهادة التشفير وترويسات الأمان، والظهور في غوغل. تقرير بدرجة واضحة مع شرح كل مشكلة وطريقة إصلاحها.",
    },
    en: {
      title: "Free website audit: speed, security & SEO | ATHR Lab",
      description:
        "A free, real audit of your website: load speed, TLS certificate and security headers, and Google visibility. A clear grade with every issue explained and how to fix it.",
    },
  });

  const target = await targetFrom(searchParams as SearchParams);
  if (!target) return base;
  const host = target.replace(/^https?:\/\//i, "").split("/")[0];
  return {
    ...base,
    title: lang === "ar" ? `تقرير فحص ${host} | مختبر أثر` : `Audit report for ${host} | ATHR Lab`,
    description:
      lang === "ar"
        ? `نتيجة فحص السرعة والأمان والسيو لموقع ${host}.`
        : `Speed, security and SEO audit results for ${host}.`,
    // تقارير المواقع روابط لا نهائية: لا نريدها في فهرس غوغل.
    robots: { index: false, follow: true },
  };
}

export default async function TechLabPage({ searchParams }: PageProps<"/[lang]/tech-lab">) {
  const target = await targetFrom(searchParams as SearchParams);
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        {/* key: رابط تقرير مختلف يبدأ فحصاً جديداً بحالة نظيفة. */}
        <TechLab key={target} initialUrl={target} />
      </main>
      <Footer />
    </>
  );
}
