import { prisma } from "@/lib/prisma";
import SponsorshipClient from "./SponsorshipClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function SponsorshipCRMPage() {
  await enforcePermission();
  
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <SponsorshipClient initialSponsors={sponsors} />;
}

