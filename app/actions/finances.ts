"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoleProtectedActionClient } from "@/lib/auth/safe-action";
import { TransactionType, TransactionCategory } from "@prisma/client";

// Only FINANCE and OCP
const financeAction = createRoleProtectedActionClient(undefined, ["FINANCE"]);

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  amount: z.number().positive(),
  description: z.string().optional(),
});

export const createTransaction = financeAction
  .schema(transactionSchema)
  .action(async ({ parsedInput: { type, category, amount, description } }) => {
    const transaction = await prisma.financialTransaction.create({
      data: {
        type,
        category,
        amount,
        description,
      },
    });

    revalidatePath("/admin/finances");
    return { success: true, transaction };
  });

const updateTransactionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  amount: z.number().positive(),
  description: z.string().optional(),
});

export const updateTransaction = financeAction
  .schema(updateTransactionSchema)
  .action(async ({ parsedInput: { id, type, category, amount, description } }) => {
    const transaction = await prisma.financialTransaction.update({
      where: { id },
      data: {
        type,
        category,
        amount,
        description,
      },
    });

    revalidatePath("/admin/finances");
    return { success: true, transaction };
  });

const deleteTransactionSchema = z.object({
  id: z.string(),
});

export const deleteTransaction = financeAction
  .schema(deleteTransactionSchema)
  .action(async ({ parsedInput: { id } }) => {
    await prisma.financialTransaction.delete({
      where: { id },
    });

    revalidatePath("/admin/finances");
    return { success: true };
  });
