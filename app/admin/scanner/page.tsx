import ScannerClient from "./ScannerClient";
import { enforcePermission } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function ScannerPage() {
  await enforcePermission(undefined, ["DXP"]);
  return (
    <div className="space-y-6">
      <ScannerClient />
    </div>
  );
}
