import Header from "@/components/Header";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export const metadata = {
  title: "باقاتنا وأسعارنا | شفافية ومرونة بدون اشتراكات - أثر",
  description: "نوفر أسعاراً وخططاً شفافة ومدروسة تناسب مختلف أحجام المشاريع: الباقة التعريفية، الباقة الاحترافية، وباقة الأنظمة الخاصة.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
