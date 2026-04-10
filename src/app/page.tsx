import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickNav from "@/components/QuickNav";
import FeaturedListings from "@/components/FeaturedListings";
import TrustSection from "@/components/TrustSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickNav />
        <FeaturedListings />
        <TrustSection />
        <Newsletter />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
