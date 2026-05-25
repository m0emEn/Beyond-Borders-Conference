import { getCurrentUser } from "@/lib/auth/rbac";
import { getDashboardStatsRaw } from "@/app/actions/dashboard";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const stats = await getDashboardStatsRaw();

  return <DashboardClient role={user.role} stats={stats} />;
}
