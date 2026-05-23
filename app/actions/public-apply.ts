"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/auth/safe-action";

const applySchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  nationality: z.string().min(1, "Nationality is required"),
  experience: z.string().min(1, "Experience is required"),
  sessionTitle: z.string().min(1, "Session title is required"),
  sessionCategory: z.string().min(1, "Session category is required"),
  sessionObjectives: z.string().min(1, "Session objectives are required"),
  duration: z.coerce.number().min(10, "Duration must be at least 10 minutes"),
  interactiveMethods: z.string().min(1, "Interactive methods are required"),
  materialsNeeded: z.string().optional(),
  motivation: z.string().min(1, "Motivation is required"),
  sessionPlanUrl: z.string().optional(),
});

export const applyAsFacilitator = actionClient
  .schema(applySchema)
  .action(async ({ parsedInput }) => {
    // Check if email already exists
    const existing = await prisma.facilitatorApplication.findFirst({
      where: { email: parsedInput.email },
    });

    if (existing) {
      throw new Error("An application with this email has already been submitted.");
    }

    const application = await prisma.facilitatorApplication.create({
      data: parsedInput,
    });

    return { success: true, applicationId: application.id };
  });
