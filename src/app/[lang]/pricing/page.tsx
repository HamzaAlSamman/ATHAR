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
    ar: { title: "الأسعار | برمجة المواقع والأنظمة والتطبيقات - أثر", description: "أسعار معلنة لبرمجة المواقع والمتاجر، وسعر ثابت مكتوب للأنظمة وتطبيقات الجوال، وباقات لتحسين المواقع القائمة." },
    en: { title: "Pricing | Websites, systems and apps - ATHR", description: "Published prices for websites and stores, a written fixed price for systems and mobile apps, and packages to improve existing sites." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/pricing">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Pricing />
        <Packages />
      </main>
      <Footer />
    </>
  );
}
