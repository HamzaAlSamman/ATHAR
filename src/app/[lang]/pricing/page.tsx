import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import Header from "@/components/Header";
import Packages from "@/components/Packages";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/pricing", {
    ar: { title: "الأسعار | إصلاح السرعة والأمان والسيو وبناء المواقع - أثر", description: "أسعار ثابتة ومعلنة: إصلاح سرعة الموقع، تأمينه، تهيئة السيو، اشتراك الرعاية الشهري، وبناء مواقع ومتاجر جديدة." },
    en: { title: "Pricing | Speed, security & SEO fixes and new websites - ATHR", description: "Fixed, published prices: speed fixes, security hardening, technical SEO, a monthly care plan, and new websites and stores." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/pricing">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Packages />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
