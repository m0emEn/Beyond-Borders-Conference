"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { LogisticsStatus, LogisticsCategory } from "@prisma/client";

// Only LOG_ER and OCP
const logisticsAction = createRoleProtectedActionClient(undefined, ["LOG_ER"]);

const toggleSchema = z.object({
  id: z.string(),
  currentStatus: z.nativeEnum(LogisticsStatus),
});

const statusCycle: LogisticsStatus[] = ["PENDING", "ORDERED", "RECEIVED", "READY"];

export const toggleLogisticsItem = logisticsAction
  .schema(toggleSchema)
  .action(async ({ parsedInput: { id, currentStatus } }) => {
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    const item = await prisma.logisticsItem.update({
      where: { id },
      data: { status: nextStatus },
    });

    revalidatePath("/admin/logistics");
    return { success: true, item };
  });

const createSchema = z.object({
  item: z.string().min(1),
  category: z.nativeEnum(LogisticsCategory),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
});

export const createLogisticsItem = logisticsAction
  .schema(createSchema)
  .action(async ({ parsedInput }) => {
    const item = await prisma.logisticsItem.create({
      data: parsedInput,
    });

    revalidatePath("/admin/logistics");
    return { success: true, item };
  });
