import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="Photos and videos from Beyond Borders and past AIESEC moments."
      />
      <ComingSoon
        title="Gallery coming soon"
        description="Featured media from delegates and the OC team will appear here after launch."
      />
    </>
  );
}
