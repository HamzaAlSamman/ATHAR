import Header from "@/components/Header";
import TechLab from "@/components/TechLab";
import Footer from "@/components/Footer";

export const metadata = {
  title: "مختبر أثر التقني | فحص سرعة وأداء المواقع الإلكترونية",
  description: "أدوات برمجية تفاعلية مجانية لقياس كفاءة وسرعة تحميل موقعك واكتشاف نقاط الضعف الفنية والأكواد الزائدة.",
};

export default function TechLabPage() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <TechLab />
      </main>
      <Footer />
    </>
  );
}
