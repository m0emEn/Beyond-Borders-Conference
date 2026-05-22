import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionsPreview } from "@/components/sections/SessionsPreview";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsPage() {
  return (
    <>
      <PageHeader
        title="Sessions"
        description="Explore workshops, keynotes, and activities across the conference."
      />
      <SessionsPreview />
    </>
  );
}
