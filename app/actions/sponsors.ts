"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { SponsorStatus, SponsorPackage } from "@prisma/client";

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

const sponsorSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  sponsorshipPackage: z.nativeEnum(SponsorPackage),
  contributionAmount: z.number().min(0),
  deliverables: z.array(z.string()).default([]),
  brandingObligations: z.string().optional(),
  notes: z.string().optional(),
});

export const createSponsor = sponsorAction
  .schema(sponsorSchema)
  .action(async ({ parsedInput }) => {
    const sponsor = await prisma.sponsor.create({
      data: {
        ...parsedInput,
        email: parsedInput.email || null,
      },
    });

    revalidatePath("/admin/sponsorship");
    return { success: true, sponsor };
  });

export const updateSponsor = sponsorAction
  .schema(sponsorSchema.extend({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id, ...data } }) => {
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        ...data,
        email: data.email || null,
      },
    });

    revalidatePath("/admin/sponsorship");
    return { success: true, sponsor };
  });

export const deleteSponsor = sponsorAction
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.sponsor.delete({ where: { id } });

    revalidatePath("/admin/sponsorship");
    return { success: true };
  });
