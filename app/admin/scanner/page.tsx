import ScannerClient from "./ScannerClient";
import { enforcePermission } from "@/lib/auth/rbac";

export default function ScannerPage() {
  // Only OCP and DXP can access the scanner
  enforcePermission(["OCVP_DXP"]);

  return (
    <div className="space-y-6">
      <ScannerClient />
    </div>
  );
}
