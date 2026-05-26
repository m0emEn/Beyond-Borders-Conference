"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { ApplicationStatus } from "@prisma/client";

const facilitatorAction = createRoleProtectedActionClient();

const reviewSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(ApplicationStatus),
  score: z.number().optional(),
  reviewNotes: z.string().optional(),
});

export const updateFacilitatorStatus = facilitatorAction
  .schema(reviewSchema)
  .action(async ({ parsedInput: { id, status, score, reviewNotes } }) => {
    const app = await prisma.facilitatorApplication.update({
      where: { id },
      data: {
        status,
        score,
        reviewNotes,
        reviewedAt: new Date(),
      },
    });

    if (status === "APPROVED") {
      await prisma.facilitator.upsert({
        where: { email: app.email },
        update: {
          fullName: app.fullName,
          nationality: app.nationality,
          bio: app.experience,
          applicationId: app.id,
        },
        create: {
          fullName: app.fullName,
          email: app.email,
          nationality: app.nationality,
          bio: app.experience,
          applicationId: app.id,
        },
      });
    }

    // Send Resend Email logic
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || "noreply@beyondbordersconference.tn";

    if (resendApiKey && (status === "APPROVED" || status === "REJECTED")) {
      try {
        const subject = status === "APPROVED" 
          ? "Session Proposal Approved - Beyond Borders Conference" 
          : "Update on your Session Proposal - Beyond Borders Conference";
          
        const htmlContent = status === "APPROVED"
          ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1a1f5e;">
              <h2 style="color: #14b8a6; text-align: center; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">Proposal Approved</h2>
              <p>Dear <strong>${app.fullName}</strong>,</p>
              <p>Congratulations! Your session proposal for the Beyond Borders Conference has been <strong>approved</strong>.</p>
              <p>Our organizing committee was highly impressed by your plan. We will be reaching out soon with logistics and scheduling details for your session.</p>
              <p>Welcome to the facilitators lineup!</p>
              <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea; padding-top: 15px;">
                Organized by AIESEC in Bizerte
              </p>
            </div>`
          : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1a1f5e;">
              <h2 style="color: #f43f5e; text-align: center; border-bottom: 2px solid #f43f5e; padding-bottom: 10px;">Proposal Update</h2>
              <p>Dear <strong>${app.fullName}</strong>,</p>
              <p>Thank you for submitting your session proposal for the Beyond Borders Conference.</p>
              <p>After careful review, we regret to inform you that we will not be moving forward with your session for this edition. Due to limited slots, we had to make some very tough choices.</p>
              <p>We deeply appreciate your interest and effort, and we hope to collaborate with you in future events.</p>
              <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea; padding-top: 15px;">
                Organized by AIESEC in Bizerte
              </p>
            </div>`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `Beyond Borders <${emailFrom}>`,
            to: app.email,
            subject,
            html: htmlContent,
          }),
        });
      } catch (error) {
        console.error("Failed to send status update email:", error);
      }
    }

    revalidatePath("/admin/facilitators");
    return { success: true, app };
  });
