import LandingNavbar from "@/components/landing/landing-navbar";
import HeroSection from "@/components/landing/hero-section";
import LandingFooter from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
      </main>
      <LandingFooter />
    </div>
  );
}
