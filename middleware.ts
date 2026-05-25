import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJWT } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");
    const loginUrl = new URL("/admin/login", request.url);

    if (!session?.value) {
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAdminJWT(session.value);
    if (!payload) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
