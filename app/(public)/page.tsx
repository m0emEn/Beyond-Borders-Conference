import { About } from "@/components/sections/About";
import { CulturalNightTeaser } from "@/components/sections/CulturalNightTeaser";
import { FacilitatorsPreview } from "@/components/sections/FacilitatorsPreview";
import { FAQ } from "@/components/sections/FAQ";
import { FeedPreview } from "@/components/sections/FeedPreview";
import { Hero } from "@/components/sections/Hero";
import { SessionsPreview } from "@/components/sections/SessionsPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <SessionsPreview />
      <FeedPreview />
      <FacilitatorsPreview />
      <CulturalNightTeaser />
      <FAQ />
    </>
  );
}
