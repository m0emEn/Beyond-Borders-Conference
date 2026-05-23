import { prisma } from "@/lib/prisma";
import FacilitatorsClient from "./FacilitatorsClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function FacilitatorsVettingPage() {
  await enforcePermission();
  
  const apps = await prisma.facilitatorApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <FacilitatorsClient initialApps={apps} />;
}

