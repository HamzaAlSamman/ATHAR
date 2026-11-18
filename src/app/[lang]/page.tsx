import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import LabShowcase from "@/components/LabShowcase";
import Trust from "@/components/Trust";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { publishedProjects } from "@/content/projects";
import { isLocale, pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/", {
    ar: {
      title: "أثر (ATHR) | برمجة مواقع، أنظمة، وتطبيقات جوال بسعر ثابت",
      description:
        "شركة برمجة تبني مواقع الشركات والمتاجر، تطبيقات الويب وأنظمة الإدارة، تطبيقات آيفون وأندرويد، والأتمتة بالذكاء الاصطناعي. سعر ثابت قبل البدء والكود ملكك.",
    },
    en: {
      title: "ATHR | Websites, business systems and mobile apps at a fixed price",
      description:
        "A software studio building company websites and stores, web apps and business systems, iPhone and Android apps, and AI automation. Fixed price up front, and the code is yours.",
    },
  });
}

// الترتيب يتبع قرار الزبون: ماذا تبرمجون ← كيف تشتغلون ← كم السعر ← دليل على الجودة ← تواصل.
export default async function Home({ params }: PageProps<"/[lang]">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto" }}>
        <Hero />
        <Services />
        <HowItWorks />
        {publishedProjects.length > 0 && <Portfolio />}
        <Pricing />
        <LabShowcase />
        <Trust />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
