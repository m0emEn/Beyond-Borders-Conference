import { prisma } from "@/lib/prisma";
import DelegatesClient from "./DelegatesClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function DelegateRegistryPage() {
  // Ensure the user has access. Even though layout blocks rendering, it's good to enforce here.
  // Actually, layout handles it, but let's just fetch safely.
  await enforcePermission();
  
  const delegates = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <DelegatesClient initialDelegates={delegates} />;
}

