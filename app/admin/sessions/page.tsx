import { getSessions } from "@/app/actions/sessions";
import SessionSchedulerClient from "./SessionSchedulerClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SessionSchedulerPage() {
  const sessions = await getSessions();
  const facilitators = await prisma.facilitator.findMany({
    orderBy: { fullName: "asc" },
  });
  return <SessionSchedulerClient sessions={sessions} facilitators={facilitators} />;
}
