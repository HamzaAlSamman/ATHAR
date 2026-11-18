import type { Metadata } from "next";
import Header from "@/components/Header";
import TechLab from "@/components/TechLab";
import Footer from "@/components/Footer";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function targetFrom(searchParams: SearchParams): Promise<string> {
  const value = (await searchParams).url;
  const raw = Array.isArray(value) ? value[0] : value;
  // يُعرض في العنوان ويُرسل للفحص: نقصّ الطول ونحذف ما ليس جزءاً من رابط.
  return (raw ?? "").trim().slice(0, 200).replace(/[\s<>"'`]/g, "");
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const target = await targetFrom(searchParams);
  if (!target) {
    return {
      title: "افحص موقعك مجاناً: السرعة والأمان والسيو | مختبر أثر",
      description:
        "فحص مجاني وحقيقي لموقعك: سرعة التحميل، شهادة التشفير وترويسات الأمان، والظهور في غوغل. تقرير بدرجة واضحة مع شرح كل مشكلة وطريقة إصلاحها.",
      alternates: { canonical: "/tech-lab" },
    };
  }
  const host = target.replace(/^https?:\/\//i, "").split("/")[0];
  return {
    title: `تقرير فحص ${host} | مختبر أثر`,
    description: `نتيجة فحص السرعة والأمان والسيو لموقع ${host}.`,
    // تقارير المواقع روابط لا نهائية: لا نريدها في فهرس غوغل.
    robots: { index: false, follow: true },
    alternates: { canonical: "/tech-lab" },
  };
}

export default async function TechLabPage({ searchParams }: { searchParams: SearchParams }) {
  const target = await targetFrom(searchParams);
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        {/* key: رابط تقرير مختلف يبدأ فحصاً جديداً بحالة نظيفة. */}
        <TechLab key={target} initialUrl={target} />
      </main>
      <Footer />
    </>
  );
}
