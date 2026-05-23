import { prisma } from "@/lib/prisma";
import FinancesClient from "./FinancesClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function FinancesTrackerPage() {
  await enforcePermission();
  
  const transactions = await prisma.financialTransaction.findMany({
    orderBy: { date: "desc" },
  });

  return <FinancesClient initialTransactions={transactions} />;
}

