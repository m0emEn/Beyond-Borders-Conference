import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const facilitatorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  nationality: z.string().min(1, "Nationality is required"),
  experience: z.string().min(1, "Experience is required"),
  sessionTitle: z.string().min(1, "Session title is required"),
  sessionCategory: z.string().min(1, "Session category is required"),
  sessionObjectives: z.string().min(1, "Objectives are required"),
  duration: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  interactiveMethods: z.string().min(1, "Interactive methods are required"),
  materialsNeeded: z.string().optional(),
  motivation: z.string().min(1, "Motivation is required"),
  sessionPlanUrl: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Zod validation
    const parsed = facilitatorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // 2. Save to database
    const application = await prisma.facilitatorApplication.create({
      data: {
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        nationality: data.nationality.trim(),
        experience: data.experience.trim(),
        sessionTitle: data.sessionTitle.trim(),
        sessionCategory: data.sessionCategory,
        sessionObjectives: data.sessionObjectives.trim(),
        duration: data.duration,
        interactiveMethods: data.interactiveMethods.trim(),
        materialsNeeded: data.materialsNeeded?.trim() || null,
        motivation: data.motivation.trim(),
        sessionPlanUrl: data.sessionPlanUrl || null,
        status: ApplicationStatus.PENDING,
      },
    });

    // 4. Return success
    return NextResponse.json({
      data: {
        id: application.id,
        fullName: application.fullName,
        sessionTitle: application.sessionTitle,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("API facilitator application error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing application." },
      { status: 500 }
    );
  }
}
