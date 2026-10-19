import { Bestsellers } from "@/components/home/Bestsellers";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner />
      <Bestsellers />
      <BrandStory />
      <TestimonialSection />
      <NewsletterForm />
    </>
  );
}
