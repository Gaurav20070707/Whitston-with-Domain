import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { FeatureCards } from "@/components/home/FeatureCards";
import { StockGameTeaser } from "@/components/home/StockGameTeaser";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FeatureCards />
      <StockGameTeaser />
      <Contact />
    </>
  );
}
