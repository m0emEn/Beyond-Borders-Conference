"use server";

import { prisma } from "@/lib/prisma";
import { OCRole, OCDepartment } from "@prisma/client";

export type OCMemberPerformance = {
  id: string;
  name: string;
  role: OCRole;
  department: OCDepartment;
  tasksCompleted: number;
  tasksPending: number;
  efficiency: number;
};

export async function getOCPerformance(): Promise<OCMemberPerformance[]> {
  const members = await prisma.oCMember.findMany({
    include: {
      tasksAssigned: { select: { status: true } },
    },
    orderBy: { role: "asc" },
  });

  return members.map((m) => {
    const completed = m.tasksAssigned.filter((t) => t.status === "COMPLETED").length;
    const pending = m.tasksAssigned.filter(
      (t) => t.status === "PENDING" || t.status === "IN_PROGRESS"
    ).length;
    const total = m.tasksAssigned.length;
    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: m.id,
      name: m.fullName,
      role: m.role,
      department: m.department,
      tasksCompleted: completed,
      tasksPending: pending,
      efficiency,
    };
  });
}
