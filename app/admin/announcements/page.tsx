import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function AnnouncementsCMSPage() {
  await enforcePermission();
  
  const posts = await prisma.post.findMany({
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" }
    ],
  });

  return <AnnouncementsClient initialPosts={posts} />;
}

