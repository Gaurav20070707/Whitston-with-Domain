import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { ProgramDetails } from "@/components/home/ProgramDetails";
import { FeatureCards } from "@/components/home/FeatureCards";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ProgramDetails />
      <FeatureCards />
      <Contact />
    </>
  );
}
