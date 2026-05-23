"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";

const scannerAction = createRoleProtectedActionClient(undefined, ["DXP"]);

const scanSchema = z.object({
  qrToken: z.string().min(1),
});

export const checkInDelegate = scannerAction
  .schema(scanSchema)
  .action(async ({ parsedInput: { qrToken } }) => {
    const delegate = await prisma.registration.findUnique({
      where: { qrToken },
    });

    if (!delegate) {
      throw new Error("Invalid QR Code. Delegate not found.");
    }

    if (delegate.status === "CHECKED_IN") {
      throw new Error("Delegate is already checked in.");
    }

    if (delegate.paymentStatus !== "CONFIRMED") {
      throw new Error("Payment is not confirmed for this delegate.");
    }

    const updated = await prisma.registration.update({
      where: { id: delegate.id },
      data: {
        status: "CHECKED_IN",
        checkInAt: new Date(),
      },
    });

    revalidatePath("/admin/delegates");
    return { success: true, delegate: updated };
  });
