import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminJWT } from "@/lib/auth/jwt";

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
    console.log(email,password)
    const user = await prisma.oCMember.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Security clearance denied. Coordinates mismatch." },
        { status: 401 }
      );
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        { error: "Security clearance denied. Passcode invalid." },
        { status: 401 }
      );
    }

    const token = await signAdminJWT({
      memberId: user.id,
      role: user.role,
      department: user.department,
    });

    const response = NextResponse.json({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal security vault error occurred." },
      { status: 500 }
    );
  }
}
