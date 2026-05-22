import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      nationality,
      experience,
      sessionTitle,
      sessionCategory,
      sessionObjectives,
      duration,
      interactiveMethods,
      materialsNeeded,
      motivation,
      sessionPlanUrl,
    } = body;

    // 1. Basic validation
    if (
      !fullName ||
      !email ||
      !nationality ||
      !experience ||
      !sessionTitle ||
      !sessionCategory ||
      !sessionObjectives ||
      !duration ||
      !interactiveMethods ||
      !motivation
    ) {
      return NextResponse.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    // 2. Parse duration
    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration)) {
      return NextResponse.json(
        { error: "Session duration must be a valid number." },
        { status: 400 }
      );
    }

    // 3. Save to database
    const application = await prisma.facilitatorApplication.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        nationality: nationality.trim(),
        experience: experience.trim(),
        sessionTitle: sessionTitle.trim(),
        sessionCategory: sessionCategory,
        sessionObjectives: sessionObjectives.trim(),
        duration: parsedDuration,
        interactiveMethods: interactiveMethods.trim(),
        materialsNeeded: materialsNeeded?.trim() || null,
        motivation: motivation.trim(),
        sessionPlanUrl: sessionPlanUrl || null,
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
