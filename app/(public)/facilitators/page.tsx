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
          We are now accepting session proposals. Submit your detailed session plan to join the Beyond Borders speakers lineup.
        </p>
        <Button href="/facilitators/apply" className="mt-6">
          Apply to Facilitate
        </Button>
      </div>
      <FacilitatorsPreview />
    </>
  );
}
