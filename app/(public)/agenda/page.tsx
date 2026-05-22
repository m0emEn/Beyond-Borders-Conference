import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Agenda" };

export default function AgendaPage() {
  return (
    <>
      <PageHeader
        title="Conference Agenda"
        description="Day-by-day timeline with sessions, facilitators, and locations."
      />
      <ComingSoon
        title="Agenda coming soon"
        description="The full multi-day timeline with bookmarking and calendar export will be available in Phase 2."
      />
    </>
  );
}
