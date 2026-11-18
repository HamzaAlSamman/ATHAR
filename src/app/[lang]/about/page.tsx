import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import AboutPageContent from "./AboutPageContent";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/about", {
    ar: { title: "من نحن | وكالة أثر لتطوير المواقع", description: "تعرّف على أثر: فريق يبني مواقع ومتاجر سريعة وآمنة، ويبدأ كل مشروع بفحص حقيقي وسعر ثابت." },
    en: { title: "About ATHR | Web development agency", description: "Meet ATHR: a team building fast, secure websites and stores, starting every project with a real audit and a fixed price." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/about">) {
  await params;
  return <AboutPageContent />;
}
