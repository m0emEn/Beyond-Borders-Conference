import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, RegistrationStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      nationality,
      gender,
      universityOccupation,
      emergencyName,
      emergencyPhone,
      dietaryPrefs,
      arrivalDate,
      departureDate,
      motivation,
      paymentProof,
      termsAccepted,
    } = body;

    // 1. Basic validation
    if (!fullName || !email || !phone || !nationality || !gender || !motivation) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the terms and conditions." },
        { status: 400 }
      );
    }

    // 2. Check for duplicate email
    const existing = await prisma.registration.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A registration with this email already exists." },
        { status: 409 }
      );
    }

    // 3. Generate unique sequential delegate ID (e.g. BBC-2026-0042)
    const count = await prisma.registration.count();
    const sequence = String(count + 1).padStart(4, "0");
    const delegateId = `BBC-2026-${sequence}`;

    // 4. Save to database
    const registration = await prisma.registration.create({
      data: {
        delegateId,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        nationality,
        gender,
        universityOccupation: universityOccupation?.trim() || "",
        emergencyName: emergencyName?.trim() || "",
        emergencyPhone: emergencyPhone?.trim() || "",
        dietaryPrefs: dietaryPrefs || [],
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        departureDate: departureDate ? new Date(departureDate) : null,
        motivation: motivation.trim(),
        paymentStatus: paymentProof ? PaymentStatus.UPLOADED : PaymentStatus.PENDING,
        paymentProof: paymentProof || null,
        status: RegistrationStatus.PENDING,
        termsAccepted: true,
      },
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
