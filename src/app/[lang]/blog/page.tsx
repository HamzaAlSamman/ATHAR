import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import Header from "@/components/Header";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/blog", {
    ar: { title: "مدونة أثر | مقالات عن سرعة المواقع والسيو والتجارة الإلكترونية", description: "مقالات عملية عن سرعة المواقع وأمانها والسيو والتجارة الإلكترونية لمساعدتك على النمو." },
    en: { title: "ATHR Blog | Website speed, SEO and e-commerce", description: "Practical articles on website speed, security, SEO and e-commerce to help your business grow." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/blog">) {
  await params;
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Blog />
      </main>
      <Footer />
    </>
  );
}
