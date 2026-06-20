import Header from "@/components/Header";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

export const metadata = {
  title: "مدونة أثر المعرفية | مقالات ونصائح برمجية وتسويقية - أثر",
  description: "نشارك معك مقالات متخصصة في التجارة الإلكترونية، السيو المحلي، وتطوير الويب السريع لمساعدتك على التفوق الرقمي.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto", paddingTop: "80px" }}>
        <Blog />
      </main>
      <Footer />
    </>
  );
}
