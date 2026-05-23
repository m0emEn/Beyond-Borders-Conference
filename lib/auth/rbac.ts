import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { OCRole, OCDepartment, OCMember } from "@prisma/client";

/**
 * Gets the current authenticated user from the admin_session cookie
 */
export async function getCurrentUser(): Promise<OCMember | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    
    // We should ideally have the user's ID in the session, but currently the project
    // might just be storing basic info. Let's fetch the actual user from the DB using email.
    if (sessionData && sessionData.email) {
      const user = await prisma.oCMember.findUnique({
        where: { email: sessionData.email }
      });
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error parsing session cookie:", error);
    return null;
  }
}

/**
 * Centralized Role-Based Access Control logic
 * @param user The current authenticated user
 * @param allowedRoles Array of allowed roles, or undefined to allow any role
 * @param allowedDepartments Array of allowed departments, or undefined to allow any department
 * @returns true if user has permission, false otherwise
 */
export function canUser(
  user: OCMember,
  allowedRoles?: OCRole[],
  allowedDepartments?: OCDepartment[]
): boolean {
  // OCP has ultimate global permission
  if (user.role === OCRole.OCP) return true;

  const roleAllowed = allowedRoles ? allowedRoles.includes(user.role) : true;
  const departmentAllowed = allowedDepartments ? allowedDepartments.includes(user.department) : true;

  return roleAllowed && departmentAllowed;
}

import { redirect } from "next/navigation";

/**
 * Use this in server actions to enforce authorization.
 * Redirects to login if user is not authenticated or lacks permission.
 */
export async function enforcePermission(
  allowedRoles?: OCRole[],
  allowedDepartments?: OCDepartment[]
): Promise<OCMember> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!canUser(user, allowedRoles, allowedDepartments)) {
    redirect("/admin"); // Or some forbidden page, but redirecting to admin dashboard is fine, or throw an error
  }

  return user;
}
