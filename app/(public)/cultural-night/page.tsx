import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CulturalNightTeaser } from "@/components/sections/CulturalNightTeaser";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Cultural Night" };

export default function CulturalNightPage() {
  return (
    <>
      <PageHeader
        title="One Global Night"
        description="An immersive cultural experience with country booths and global stories."
      />
      <CulturalNightTeaser />
      <ComingSoon
        title="Interactive world map"
        description="Mapbox-powered country booths with music, food highlights, and delegate submissions — coming in Phase 5."
        ctaHref="/contact"
        ctaLabel="Contact the OC"
      />
    </>
  );
}
