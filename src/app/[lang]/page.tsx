import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Packages from "@/components/Packages";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Trust from "@/components/Trust";
import Pricing from "@/components/Pricing";
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
      title: "أثر (ATHR) | افحص موقعك مجاناً ونصلح لك السرعة والأمان والسيو",
      description:
        "فحص مجاني وحقيقي لسرعة موقعك وأمانه وظهوره في غوغل، ثم إصلاح بسعر ثابت. وكالة أثر لتصميم وتطوير المواقع والمتاجر الإلكترونية.",
    },
    en: {
      title: "ATHR | Free website audit, then fixed-price speed, security & SEO fixes",
      description:
        "A free, real audit of your site's speed, security and Google visibility, followed by fixes at a fixed price. ATHR builds websites and online stores.",
    },
  });
}

// الترتيب يتبع رحلة البيع: افحص ← افهم الخطوات ← شاهد السعر ← ما نقدمه أيضاً ← تواصل.
export default async function Home({ params }: PageProps<"/[lang]">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto" }}>
        <Hero />
        <HowItWorks />
        <Packages />
        <Services />
        {publishedProjects.length > 0 && <Portfolio />}
        <Pricing />
        <Trust />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
