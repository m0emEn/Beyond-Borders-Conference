import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeedPreview } from "@/components/sections/FeedPreview";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Announcements"
        description="Conference feed with live updates, reactions, and pinned posts."
      />
      <FeedPreview />
    </>
  );
}
