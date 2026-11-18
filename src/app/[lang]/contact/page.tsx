import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/contact", {
    ar: { title: "تواصل معنا | أثر", description: "أرسل طلبك أو تقرير فحص موقعك، ونعود إليك بخطة إصلاح وسعر ثابت خلال يوم عمل." },
    en: { title: "Contact us | ATHR", description: "Send your request or your site's audit report, and we will reply with a fix plan and a fixed price within one business day." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
