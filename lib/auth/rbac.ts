import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { OCRole, OCDepartment, OCMember } from "@prisma/client";
import { verifyAdminJWT } from "./jwt";
import { redirect } from "next/navigation";

export async function getCurrentUser(): Promise<OCMember | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie?.value) return null;

  const payload = await verifyAdminJWT(sessionCookie.value);
  if (!payload?.memberId) return null;

  try {
    return await prisma.oCMember.findUnique({
      where: { id: payload.memberId },
    });
  } catch {
    return null;
  }
}

export function canUser(
  user: OCMember,
  allowedRoles?: OCRole[],
  allowedDepartments?: OCDepartment[]
): boolean {
  if (user.role === OCRole.OCP) return true;

  const roleAllowed = allowedRoles ? allowedRoles.includes(user.role) : true;
  const departmentAllowed = allowedDepartments
    ? allowedDepartments.includes(user.department)
    : true;

  return roleAllowed && departmentAllowed;
}

export async function enforcePermission(
  allowedRoles?: OCRole[],
  allowedDepartments?: OCDepartment[]
): Promise<OCMember> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!canUser(user, allowedRoles, allowedDepartments)) {
    redirect("/admin");
  }

  return user;
}
