import Cta from "@/components/home/cta";
import FeaturedProperties from "@/components/home/featured-properties";
import Hero from "@/components/home/hero";
import PropertyTypes from "@/components/home/property-types";
import WhyChooseUs from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProperties />
      <PropertyTypes />
      <WhyChooseUs />
      <Cta />
    </main>
  );
}
