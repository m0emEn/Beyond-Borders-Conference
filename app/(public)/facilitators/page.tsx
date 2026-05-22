import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FacilitatorsPreview } from "@/components/sections/FacilitatorsPreview";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Facilitators" };

export default function FacilitatorsPage() {
  return (
    <>
      <PageHeader
        title="Facilitators"
        description="Meet session leaders and apply to facilitate your own workshop."
      />
      <div className="section-container pb-20 text-center">
        <p className="text-text-secondary">
          Facilitator applications with PDF upload and admin review — coming in
          Phase 2.
        </p>
        <Button href="/contact" className="mt-6" variant="outline">
          Contact us to apply early
        </Button>
      </div>
      <FacilitatorsPreview />
    </>
  );
}
