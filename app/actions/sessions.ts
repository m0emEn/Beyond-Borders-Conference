"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/lib/auth/safe-action";
import { SessionCategory, SessionStatus } from "@prisma/client";

export type SessionRow = {
  id: string;
  title: string;
  description: string;
  category: SessionCategory;
  day: number;
  timeSlot: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number | null;
  status: SessionStatus;
  facilitatorId: string | null;
  facilitatorName?: string | null;
};

function fmt(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export async function getSessions(): Promise<SessionRow[]> {
  const rows = await prisma.session.findMany({
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
    include: { facilitator: true },
  });
  return rows.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    day: s.day,
    timeSlot: `${fmt(s.startTime)} - ${fmt(s.endTime)}`,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    location: s.location,
    capacity: s.capacity,
    status: s.status,
    facilitatorId: s.facilitatorId,
    facilitatorName: s.facilitator?.fullName,
  }));
}

export const publishSession = authActionClient
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.session.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
    revalidatePath("/admin/sessions");
    return { success: true };
  });

export const createSession = authActionClient
  .schema(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.nativeEnum(SessionCategory),
      day: z.number().int().min(1),
      startTime: z.string(),
      endTime: z.string(),
      location: z.string().min(1),
      capacity: z.number().int().positive().optional(),
      facilitatorId: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await prisma.session.create({
      data: {
        ...parsedInput,
        objectives: [],
        tags: [],
        startTime: new Date(parsedInput.startTime),
        endTime: new Date(parsedInput.endTime),
      },
    });
    revalidatePath("/admin/sessions");
    return { success: true, session };
  });

export const updateSession = authActionClient
  .schema(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.nativeEnum(SessionCategory),
      day: z.number().int().min(1),
      startTime: z.string(),
      endTime: z.string(),
      location: z.string().min(1),
      capacity: z.number().int().positive().optional(),
      facilitatorId: z.string().optional(),
    })
  )
  .action(async ({ parsedInput: { id, ...data } }) => {
    const session = await prisma.session.update({
      where: { id },
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
    revalidatePath("/admin/sessions");
    return { success: true, session };
  });

export const deleteSession = authActionClient
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.session.delete({
      where: { id },
    });
    revalidatePath("/admin/sessions");
    return { success: true };
  });
