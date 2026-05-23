"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { LogisticsStatus } from "@prisma/client";

// Only LOG_ER and OCP
const logisticsAction = createRoleProtectedActionClient(undefined, ["LOG_ER"]);

const toggleSchema = z.object({
  id: z.string(),
  currentStatus: z.nativeEnum(LogisticsStatus),
});

export const toggleLogisticsItem = logisticsAction
  .schema(toggleSchema)
  .action(async ({ parsedInput: { id, currentStatus } }) => {
    const nextStatus = currentStatus === "READY" ? "PENDING" : "READY";
    
    const item = await prisma.logisticsItem.update({
      where: { id },
      data: { status: nextStatus },
    });

    revalidatePath("/admin/logistics");
    return { success: true, item };
  });
