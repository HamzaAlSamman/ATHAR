import Header from "@/components/Header";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";

export const metadata = {
  title: "حاسبة تكلفة المشاريع | تقدير فوري للسعر والمدة - أثر",
  description: "احسب تكلفة ومدة تنفيذ موقعك أو متجرك الإلكتروني فوراً عبر حاسبة أثر التفاعلية، وفقاً لأسعار السوق الحالية.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Calculator />
      </main>
      <Footer />
    </>
  );
}
