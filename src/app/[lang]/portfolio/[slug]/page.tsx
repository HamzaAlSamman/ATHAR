import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectContent from "./ProjectContent";
import { publishedProjects, getProject } from "@/content/projects";
import { isLocale, locales, pageMetadata } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) => publishedProjects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(lang) || !project) return {};
  const base = pageMetadata(lang, `/portfolio/${project.slug}`, {
    ar: { title: `${project.title.ar} | أثر`, description: project.desc.ar },
    en: { title: `${project.title.en} | ATHR`, description: project.desc.en },
  });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", images: [{ url: project.cover }] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/portfolio/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <ProjectContent project={project} />
      </main>
      <Footer />
    </>
  );
}
