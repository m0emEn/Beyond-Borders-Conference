import { prisma } from "@/lib/prisma";
import TimelineClient from "./TimelineClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function TimelineTrackerPage() {
  await enforcePermission();
  
  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const members = await prisma.oCMember.findMany({
    orderBy: { fullName: "asc" },
  });

  return <TimelineClient initialTasks={tasks} members={members} />;
}
