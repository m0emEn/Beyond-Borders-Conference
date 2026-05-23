import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Clearance coordinates required." },
        { status: 400 }
      );
    }

    // 1. Query the AIESEC OC member in database
    const user = await prisma.oCMember.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Security clearance denied. Coordinates mismatch." },
        { status: 401 }
      );
    }

    // 2. Cryptographic comparison of password hashes
    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        { error: "Security clearance denied. Passcode invalid." },
        { status: 401 }
      );
    }

    // 3. Return session package and set secure cookie
    const response = NextResponse.json({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });

    response.cookies.set("admin_session", JSON.stringify({ email: user.email, role: user.role }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("API Auth login error:", error);
    return NextResponse.json(
      { error: "Internal security vault error occurred." },
      { status: 500 }
    );
  }
}
