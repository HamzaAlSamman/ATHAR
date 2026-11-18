import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/calculator">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/calculator", {
    ar: { title: "حاسبة تكلفة الموقع والمتجر | تقدير فوري - أثر", description: "احسب التكلفة والمدة التقريبية لموقعك أو متجرك الإلكتروني خلال ثوانٍ." },
    en: { title: "Website & store cost calculator | Instant estimate - ATHR", description: "Estimate the cost and timeline of your website or online store in seconds." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/calculator">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Calculator />
      </main>
      <Footer />
    </>
  );
}
