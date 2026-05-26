import { cookies } from "next/headers";
import { verifyAdminJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import AdminLayoutClient, { UserProfile } from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session")?.value;
  let userProfile: UserProfile | null = null;

  if (session) {
    try {
      const decoded = await verifyAdminJWT(session);
      if (decoded && decoded.memberId) {
        const member = await prisma.oCMember.findUnique({
          where: { id: decoded.memberId }
        });
        if (member) {
          userProfile = {
            name: member.fullName,
            role: member.role
              .replace("OCVP_", "VP ")
              .replace("OC_", "")
              .replace("_MEMBER", " Member")
              .replace("LOG_ER", "LOG & ER"),
            dept: member.department,
            clearance: member.role
          };
        }
      }
    } catch (e) {
      // Invalid token, userProfile remains null
    }
  }

  return <AdminLayoutClient userProfile={userProfile}>{children}</AdminLayoutClient>;
}
