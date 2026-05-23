import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "./rbac";
import { OCRole, OCDepartment } from "@prisma/client";

// Base client for actions that don't require authentication (e.g., public endpoints)
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return e.message || "An unexpected error occurred.";
  },
});

// Authenticated client for general admin actions (any logged in OC member)
export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  return next({ ctx: { user } });
});

/**
 * Creates an action client that requires specific roles or departments.
 * Usage: `const financeAction = createRoleProtectedActionClient(undefined, ['FINANCE']);`
 */
export const createRoleProtectedActionClient = (
  allowedRoles?: OCRole[],
  allowedDepartments?: OCDepartment[]
) => {
  return authActionClient.use(async ({ ctx, next }) => {
    const { user } = ctx;

    // OCP bypasses all restrictions
    if (user.role === OCRole.OCP) {
      return next({ ctx });
    }

    const roleAllowed = allowedRoles ? allowedRoles.includes(user.role) : true;
    const departmentAllowed = allowedDepartments ? allowedDepartments.includes(user.department) : true;

    if (!roleAllowed || !departmentAllowed) {
      throw new Error("Forbidden: You lack clearance for this action.");
    }

    return next({ ctx });
  });
};
