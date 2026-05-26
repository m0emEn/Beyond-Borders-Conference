import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, RegistrationStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  gender: z.string().min(1, "Gender is required"),
  universityOccupation: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  dietaryPrefs: z.array(z.string()).optional(),
  arrivalDate: z.string().nullable().optional(),
  departureDate: z.string().nullable().optional(),
  motivation: z.string().min(1, "Motivation is required"),
  paymentProof: z.string().nullable().optional(),
  termsAccepted: z.literal(true, {
    error: "You must accept the terms and conditions."
  })
});

export async function POST(request: Request) {
  try {
    // Rate limit: 3 registrations per 60 seconds per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limiter = rateLimit(`register:${ip}`, { maxRequests: 3, windowSeconds: 60 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${limiter.resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(limiter.resetInSeconds) } }
      );
    }

    // 1. Check Registration Window
    const openDateStr = process.env.NEXT_PUBLIC_REGISTRATION_OPEN_DATE;
    const closeDateStr = process.env.NEXT_PUBLIC_REGISTRATION_CLOSE_DATE;
    
    if (openDateStr && closeDateStr) {
      const now = new Date();
      const openDate = new Date(openDateStr);
      const closeDate = new Date(closeDateStr);
      
      if (now < openDate) {
        return NextResponse.json({ error: "Registration has not opened yet." }, { status: 403 });
      }
      if (now > closeDate) {
        return NextResponse.json({ error: "Registration is closed." }, { status: 403 });
      }
    }

    const body = await request.json();

    // 2. Zod Validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // 3. Check for duplicate email
    const existing = await prisma.registration.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A registration with this email already exists." },
        { status: 409 }
      );
    }

    // 4. Generate unique sequential delegate ID and Save (Transaction to avoid race condition)
    const registration = await prisma.$transaction(async (tx) => {
      const lastReg = await tx.registration.findFirst({
        orderBy: { delegateId: 'desc' },
      });
      
      let nextSeq = 1;
      if (lastReg && lastReg.delegateId.startsWith('BBC-2026-')) {
        const lastNum = parseInt(lastReg.delegateId.replace('BBC-2026-', ''), 10);
        if (!isNaN(lastNum)) {
          nextSeq = lastNum + 1;
        }
      }
      
      const delegateId = `BBC-2026-${String(nextSeq).padStart(4, "0")}`;

      return tx.registration.create({
        data: {
          delegateId,
          fullName: data.fullName.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          nationality: data.nationality,
          gender: data.gender,
          universityOccupation: data.universityOccupation?.trim() || "",
          emergencyName: data.emergencyName?.trim() || "",
          emergencyPhone: data.emergencyPhone?.trim() || "",
          dietaryPrefs: data.dietaryPrefs || [],
          arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
          departureDate: data.departureDate ? new Date(data.departureDate) : null,
          motivation: data.motivation.trim(),
          paymentStatus: data.paymentProof ? PaymentStatus.UPLOADED : PaymentStatus.PENDING,
          paymentProof: data.paymentProof || null,
          status: RegistrationStatus.PENDING,
          termsAccepted: true,
        },
      });
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });

    // 5. Send confirmation email using Resend REST API (gracefully handles failure)
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || "noreply@beyondbordersconference.tn";

    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `Beyond Borders <${emailFrom}>`,
            to: registration.email,
            subject: `Registration Received - ${registration.delegateId}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1a1f5e;">
                <h2 style="color: #7c3aed; text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Beyond Borders Conference 2026</h2>
                <p>Dear <strong>${registration.fullName}</strong>,</p>
                <p>Thank you for registering for the <strong>Beyond Borders Conference</strong>, organized by AIESEC in Bizerte!</p>
                <p>We have successfully received your application. Below are your registration details for your records:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eaeaea;">Internal Delegate ID</td>
                    <td style="padding: 10px; color: #db2777; font-weight: bold; border: 1px solid #eaeaea; font-family: monospace;">${registration.delegateId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eaeaea;">Nationality</td>
                    <td style="padding: 10px; border: 1px solid #eaeaea;">${registration.nationality}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eaeaea;">Registration Status</td>
                    <td style="padding: 10px; border: 1px solid #eaeaea; font-weight: bold; color: #d97706;">AWAITING CONFIRMATION</td>
                  </tr>
                </table>
                <p><strong>Next Steps:</strong></p>
                <ol style="line-height: 1.6;">
                  <li>The Organizing Committee will review your registration and motivation statement.</li>
                  <li>Our finance tracking team will verify your payment details if uploaded, or contact you regarding payment confirmation.</li>
                  <li>Once approved, you will receive your check-in ticket and QR code to access all sessions, workshops, and the One Global Night.</li>
                </ol>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea; padding-top: 15px;">
                  Organized by AIESEC in Bizerte · Tunisia<br>
                  Leadership. Culture. Growth. Without limits.
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.text();
          console.warn("Resend email delivery failed:", errData);
        }
      } catch (emailError) {
        console.error("Failed to dispatch confirmation email:", emailError);
      }
    } else {
      console.warn("Resend API Key is missing. Skipping email delivery.");
    }

    // 6. Return response to public frontend
    return NextResponse.json({
      data: {
        id: registration.id,
        delegateId: registration.delegateId,
        qrToken: registration.qrToken,
      },
    });
  } catch (error) {
    console.error("API registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing registration." },
      { status: 500 }
    );
  }
}
