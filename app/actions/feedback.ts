"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/auth/safe-action";

const feedbackSchema = z.object({
  delegateSatisfaction: z.number().min(1).max(5),
  sessionRating: z.number().min(1).max(5),
  facilitatorRating: z.number().min(1).max(5),
  logisticsRating: z.number().min(1).max(5),
  overallScore: z.number().min(1).max(5),
  comments: z.string().optional(),
});

export const submitFeedback = actionClient
  .schema(feedbackSchema)
  .action(async ({ parsedInput }) => {
    const feedback = await prisma.feedbackSurvey.create({
      data: parsedInput,
    });

    return { success: true, id: feedback.id };
  });
