import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signAdminJWT } from "@/lib/auth/jwt";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 login attempts per 60 seconds per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limiter = rateLimit(`login:${ip}`, { maxRequests: 5, windowSeconds: 60 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${limiter.resetInSeconds}s.` },
        { status: 429, headers: { "Retry-After": String(limiter.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Clearance coordinates required." },
        { status: 400 }
      );
    }
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
