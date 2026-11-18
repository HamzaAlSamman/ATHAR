import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioPageContent from "./PortfolioPageContent";
import { publishedProjects } from "@/content/projects";
import { isLocale, pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata(lang, "/portfolio", {
    ar: { title: "أعمالنا | أثر", description: "مشاريع نفّذتها أثر لعملائها مع التحدي والحل والنتائج." },
    en: { title: "Our work | ATHR", description: "Projects ATHR delivered for clients, with the challenge, solution and results." },
  });
}

// لا نعرض صفحة أعمال فارغة أو بمشاريع غير موثّقة.
export default async function PortfolioPage({ params }: PageProps<"/[lang]/portfolio">) {
  await params;
  if (publishedProjects.length === 0) notFound();
  return <PortfolioPageContent />;
}
