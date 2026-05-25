import { getCampaigns } from "@/app/actions/campaigns";
import MarketingTrackerClient from "./MarketingTrackerClient";

export const dynamic = "force-dynamic";

export default async function MarketingTrackerPage() {
  const campaigns = await getCampaigns();
  return <MarketingTrackerClient campaigns={campaigns} />;
}
