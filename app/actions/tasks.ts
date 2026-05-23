"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { TaskStatus, TaskPriority, OCDepartment } from "@prisma/client";

// Any OC member can update tasks, but we'll use a general action client
const taskAction = createRoleProtectedActionClient();

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(TaskStatus),
});

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  deadline: z.string(),
  department: z.nativeEnum(OCDepartment),
  priority: z.nativeEnum(TaskPriority),
  assignedToId: z.string().optional(),
});

export const updateTaskStatus = taskAction
  .schema(updateStatusSchema)
  .action(async ({ parsedInput: { id, status } }) => {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/timeline");
    return { success: true, task };
  });

export const createTask = taskAction
  .schema(createTaskSchema)
  .action(async ({ parsedInput: { title, deadline, department, priority, assignedToId } }) => {
    const task = await prisma.task.create({
      data: {
        title,
        deadline: new Date(deadline),
        department,
        priority,
        assignedToId: assignedToId === "UNASSIGNED" ? null : assignedToId,
      },
    });

    revalidatePath("/admin/timeline");
    return { success: true, task };
  });
