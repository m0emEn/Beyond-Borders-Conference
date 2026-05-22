import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Beyond Borders"
        description="A premium international youth conference by AIESEC in Bizerte."
      />
      <About />
    </>
  );
}
