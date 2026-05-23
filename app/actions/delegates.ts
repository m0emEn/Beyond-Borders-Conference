"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { RegistrationStatus, PaymentStatus } from "@prisma/client";

// Ensure only DXP and OCP can mutate delegates
const dxpAction = createRoleProtectedActionClient(undefined, ["DXP"]);

const idSchema = z.object({ id: z.string() });

const statusUpdateSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(RegistrationStatus),
});

const paymentUpdateSchema = z.object({
  id: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus),
});

export const updateDelegateStatus = dxpAction
  .schema(statusUpdateSchema)
  .action(async ({ parsedInput: { id, status } }) => {
    const delegate = await prisma.registration.update({
      where: { id },
      data: { status },
    });
    
    // Send Resend Email logic
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || "noreply@beyondbordersconference.tn";

    if (resendApiKey && (status === "APPROVED" || status === "REJECTED")) {
      try {
        const subject = status === "APPROVED" 
          ? "Registration Approved - Beyond Borders Conference" 
          : "Update on your Registration - Beyond Borders Conference";
          
        const htmlContent = status === "APPROVED"
          ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1a1f5e;">
              <h2 style="color: #14b8a6; text-align: center; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">Registration Approved</h2>
              <p>Dear <strong>${delegate.fullName}</strong>,</p>
              <p>Congratulations! Your registration for the Beyond Borders Conference has been <strong>approved</strong>.</p>
              <p>You can access your personalized check-in ticket containing your secure QR code using the link below. Please present it at the check-in desk upon arrival.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beyondbordersconference.tn'}/ticket/${delegate.qrToken}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View My Ticket</a>
              </div>
              <p>We look forward to seeing you there!</p>
              <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea; padding-top: 15px;">
                Organized by AIESEC in Bizerte
              </p>
            </div>`
          : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1a1f5e;">
              <h2 style="color: #f43f5e; text-align: center; border-bottom: 2px solid #f43f5e; padding-bottom: 10px;">Registration Update</h2>
              <p>Dear <strong>${delegate.fullName}</strong>,</p>
              <p>Thank you for your interest in the Beyond Borders Conference.</p>
              <p>Unfortunately, after reviewing your application, we regret to inform you that we are unable to approve your registration at this time. Due to limited capacity or unmet requirements, we cannot accommodate your application.</p>
              <p>We appreciate your interest in AIESEC and hope to see you in our future events.</p>
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
            to: delegate.email,
            subject,
            html: htmlContent,
          }),
        });
      } catch (error) {
        console.error("Failed to send status update email:", error);
      }
    }

    revalidatePath("/admin/delegates");
    return { success: true, delegate };
  });

export const updatePaymentStatus = dxpAction
  .schema(paymentUpdateSchema)
  .action(async ({ parsedInput: { id, paymentStatus } }) => {
    // If payment is confirmed, we auto-approve the delegate (as was the logic in the client)
    const newStatus = paymentStatus === "CONFIRMED" ? RegistrationStatus.APPROVED : undefined;
    
    const data: any = { paymentStatus };
    if (newStatus) data.status = newStatus;

    const delegate = await prisma.registration.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/delegates");
    return { success: true, delegate };
  });

export const deleteDelegate = dxpAction
  .schema(idSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.registration.delete({ where: { id } });
    revalidatePath("/admin/delegates");
    return { success: true };
  });
