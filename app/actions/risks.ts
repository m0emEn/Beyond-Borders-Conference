"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { RiskCategory } from "@prisma/client";

const riskAction = createRoleProtectedActionClient();

const toggleRiskSchema = z.object({
  id: z.string(),
  mitigated: z.boolean(),
});

const createRiskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.nativeEnum(RiskCategory),
  probability: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  preventionStrategy: z.string().min(1, "Prevention strategy is required"),
  contingencyPlan: z.string().min(1, "Contingency plan is required"),
  ownerId: z.string().optional(),
});

export const toggleRisk = riskAction
  .schema(toggleRiskSchema)
  .action(async ({ parsedInput: { id, mitigated } }) => {
    const risk = await prisma.risk.update({
      where: { id },
      data: { mitigated },
    });

    revalidatePath("/admin/risks");
    return { success: true, risk };
  });

export const createRisk = riskAction
  .schema(createRiskSchema)
  .action(async ({ parsedInput: { title, category, probability, impact, preventionStrategy, contingencyPlan, ownerId } }) => {
    const risk = await prisma.risk.create({
      data: {
        title,
        category,
        probability,
        impact,
        preventionStrategy,
        contingencyPlan,
        ownerId: ownerId === "UNASSIGNED" ? null : ownerId,
      },
    });

    revalidatePath("/admin/risks");
    return { success: true, risk };
  });
