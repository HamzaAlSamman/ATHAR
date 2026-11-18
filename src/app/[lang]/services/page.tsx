import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import ServicesPageContent from "./ServicesPageContent";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/services", {
    ar: { title: "خدماتنا | تطوير المواقع والمتاجر والسيو - أثر", description: "تصميم وتطوير مواقع ومتاجر إلكترونية، تحسين السرعة والأمان، السيو التقني، وتصميم واجهات المستخدم." },
    en: { title: "Services | Websites, stores and SEO - ATHR", description: "Website and online store development, speed and security improvements, technical SEO and UI/UX design." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/services">) {
  await params;
  return <ServicesPageContent />;
}
