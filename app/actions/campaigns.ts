"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { MarketingPlatform, CampaignStatus } from "@prisma/client";

const mktAction = createRoleProtectedActionClient(undefined, ["MKT"]);

export type CampaignRow = {
  id: string;
  title: string;
  platform: MarketingPlatform;
  status: CampaignStatus;
  reach: number;
  clicks: number;
  conversions: number;
  ownerName: string | null;
};

export async function getCampaigns(): Promise<CampaignRow[]> {
  const rows = await prisma.campaign.findMany({
    include: { owner: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((c) => ({
    id: c.id,
    title: c.title,
    platform: c.platform,
    status: c.status,
    reach: c.reach,
    clicks: c.clicks,
    conversions: c.conversions,
    ownerName: c.owner?.fullName ?? null,
  }));
}

export const createCampaign = mktAction
  .schema(
    z.object({
      title: z.string().min(1),
      platform: z.nativeEnum(MarketingPlatform),
      reach: z.number().int().min(0).default(0),
      clicks: z.number().int().min(0).default(0),
      conversions: z.number().int().min(0).default(0),
    })
  )
  .action(async ({ parsedInput }) => {
    const campaign = await prisma.campaign.create({ data: parsedInput });
    revalidatePath("/admin/marketing");
    return { success: true, campaign };
  });

export const updateCampaignMetrics = mktAction
  .schema(
    z.object({
      id: z.string().min(1),
      reach: z.number().int().min(0),
      clicks: z.number().int().min(0),
      conversions: z.number().int().min(0),
    })
  )
  .action(async ({ parsedInput: { id, ...data } }) => {
    await prisma.campaign.update({ where: { id }, data });
    revalidatePath("/admin/marketing");
    return { success: true };
  });
