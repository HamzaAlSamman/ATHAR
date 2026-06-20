import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuoteSection from "@/components/QuoteSection";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Calculator from "@/components/Calculator";
import About from "@/components/About";
import Trust from "@/components/Trust";
import Pricing from "@/components/Pricing";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto" }}>
        <Hero />
        <QuoteSection />
        <Services />
        <Portfolio />
        <Calculator />
        <About />
        <Trust />
        <Pricing />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
