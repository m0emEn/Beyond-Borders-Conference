import { getSessions } from "@/app/actions/sessions";
import SessionSchedulerClient from "./SessionSchedulerClient";

export const dynamic = "force-dynamic";

export default async function SessionSchedulerPage() {
  const sessions = await getSessions();
  return <SessionSchedulerClient sessions={sessions} />;
}
