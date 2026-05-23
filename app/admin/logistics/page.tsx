import { prisma } from "@/lib/prisma";
import LogisticsClient from "./LogisticsClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function LogisticsDashboardPage() {
  await enforcePermission();
  
  const items = await prisma.logisticsItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <LogisticsClient initialItems={items} />;
}

