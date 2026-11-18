import type { Metadata } from "next";
import { isLocale, pageMetadata } from "@/lib/i18n";
import ServicesPageContent from "./ServicesPageContent";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/services", {
    ar: { title: "خدمات البرمجة | مواقع، أنظمة، تطبيقات جوال، أتمتة - أثر", description: "نبرمج مواقع ومتاجر، تطبيقات ويب وأنظمة إدارة (حجوزات، CRM، مخزون)، تطبيقات آيفون وأندرويد، وربطاً وأتمتة بالذكاء الاصطناعي." },
    en: { title: "Software services | Websites, systems, mobile apps, automation - ATHR", description: "We build websites and stores, web apps and business systems (bookings, CRM, inventory), iPhone and Android apps, and AI-powered integrations and automation." },
  });
}

export default async function Page({ params }: PageProps<"/[lang]/services">) {
  await params;
  return <ServicesPageContent />;
}
