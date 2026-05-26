"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/lib/auth/safe-action";
import { MediaType } from "@prisma/client";

export const createGalleryMedia = authActionClient
  .schema(
    z.object({
      url: z.string().url(),
      type: z.nativeEnum(MediaType),
      caption: z.string().optional(),
    })
  )
  .action(async ({ parsedInput }) => {
    const media = await prisma.galleryMedia.create({
      data: parsedInput,
    });
    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    return { success: true, media };
  });

export const deleteGalleryMedia = authActionClient
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id } }) => {
    await prisma.galleryMedia.delete({
      where: { id },
    });
    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    return { success: true };
  });

export const toggleFeaturedMedia = authActionClient
  .schema(z.object({ id: z.string().min(1), featured: z.boolean() }))
  .action(async ({ parsedInput: { id, featured } }) => {
    const media = await prisma.galleryMedia.update({
      where: { id },
      data: { featured },
    });
    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    return { success: true, media };
  });
