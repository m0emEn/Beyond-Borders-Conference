import { prisma } from "@/lib/prisma";
import EmergencyClient from "./EmergencyClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function EmergencyContactsPage() {
  await enforcePermission();
  
  // Fetch delegates who are approved or checked-in, and have an emergency contact
  const delegates = await prisma.registration.findMany({
    where: {
      status: { in: ["APPROVED", "CHECKED_IN"] },
      emergencyName: { not: "" },
      emergencyPhone: { not: "" },
    },
    orderBy: { fullName: "asc" },
  });

  return <EmergencyClient initialDelegates={delegates} />;
}
