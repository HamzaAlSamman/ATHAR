import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: "تواصل معنا واصنع أثرك الرقمي | استشارة مجانية - أثر",
  description: "ابدأ جلستك الاستشارية المجانية اليوم مع مهندسي وكالة أثر، وسيتواصل معك خبراؤنا التقنيون لمناقشة فكرتك وتحقيقها.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
