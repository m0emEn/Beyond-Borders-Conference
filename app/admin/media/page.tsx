import { prisma } from "@/lib/prisma";
import MediaClient from "./MediaClient";

export const dynamic = "force-dynamic";

export default async function MediaTrackerPage() {
  const media = await prisma.galleryMedia.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MediaClient initialMedia={media} />;
}
