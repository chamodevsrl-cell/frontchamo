import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import TrustInfoBar from "@/components/TrustInfoBar";
import CategoriesGrid from "@/components/CategoriesGrid";
import FeaturedOffers from "@/components/FeaturedOffers";
import BrandsCarousel from "@/components/BrandsCarousel";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f7f9fb]">
      <Navbar />
      <HeroSlider />
      <Reveal>
        <BrandsCarousel />
      </Reveal>
      <Reveal delayMs={80}>
        <TrustInfoBar />
      </Reveal>
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-14 px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <Reveal>
          <CategoriesGrid />
        </Reveal>
        <Reveal delayMs={80}>
          <FeaturedOffers />
        </Reveal>
      </main>
    </div>
  );
}
