import { prisma } from "@/lib/prisma";
import RisksClient from "./RisksClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function RiskMitigationPage() {
  await enforcePermission();
  
  const risks = await prisma.risk.findMany({
    include: {
      owner: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const members = await prisma.oCMember.findMany({
    orderBy: { fullName: "asc" },
  });

  return <RisksClient initialRisks={risks} members={members} />;
}
