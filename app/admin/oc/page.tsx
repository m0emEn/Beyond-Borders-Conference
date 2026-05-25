import { getOCPerformance } from "@/app/actions/oc";
import OCPerformanceClient from "./OCPerformanceClient";

export const dynamic = "force-dynamic";

export default async function OCPerformancePage() {
  const members = await getOCPerformance();
  return <OCPerformanceClient members={members} />;
}
