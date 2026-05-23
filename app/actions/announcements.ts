"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { PostType, PostStatus } from "@prisma/client";

const announcementAction = createRoleProtectedActionClient(undefined, ["DXP", "MKT"]);

const createSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  type: z.nativeEnum(PostType),
  pinned: z.boolean(),
  status: z.nativeEnum(PostStatus).default("PUBLISHED"),
});

const toggleSchema = z.object({
  id: z.string(),
  pinned: z.boolean().optional(),
  status: z.nativeEnum(PostStatus).optional(),
});

export const createAnnouncement = announcementAction
  .schema(createSchema)
  .action(async ({ parsedInput: { title, content, type, pinned, status } }) => {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        pinned,
        status,
      },
    });

    revalidatePath("/admin/announcements");
    return { success: true, post };
  });

export const toggleAnnouncement = announcementAction
  .schema(toggleSchema)
  .action(async ({ parsedInput: { id, pinned, status } }) => {
    const data: any = {};
    if (pinned !== undefined) data.pinned = pinned;
    if (status !== undefined) data.status = status;

    const post = await prisma.post.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/announcements");
    return { success: true, post };
  });
