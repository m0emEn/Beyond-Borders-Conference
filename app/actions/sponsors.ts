"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { SponsorStatus } from "@prisma/client";

const sponsorAction = createRoleProtectedActionClient(undefined, ["LOG_ER", "FINANCE"]);

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(SponsorStatus),
});

export const updateSponsorStatus = sponsorAction
  .schema(updateStatusSchema)
  .action(async ({ parsedInput: { id, status } }) => {
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: { outreachStatus: status },
    });

    revalidatePath("/admin/sponsorship");
    return { success: true, sponsor };
  });
