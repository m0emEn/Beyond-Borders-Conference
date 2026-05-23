"use server";

import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/auth/safe-action";
import { RegistrationStatus, PaymentStatus } from "@prisma/client";

export const getDashboardStats = actionClient
  .action(async () => {
    // OCP & DXP Stats
    const totalRegistrations = await prisma.registration.count();
    const confirmedDelegates = await prisma.registration.count({
      where: { status: RegistrationStatus.APPROVED },
    });
    const pendingPayments = await prisma.registration.count({
      where: { paymentStatus: PaymentStatus.PENDING },
    });
    const facilitatorsApproved = await prisma.facilitatorApplication.count({
      where: { status: "APPROVED" },
    });
    const totalFacilitators = await prisma.facilitatorApplication.count();

    const dxpStats = {
      totalEPs: totalRegistrations,
      approvedFacilitators: facilitatorsApproved,
      avgSatisfaction: "4.8 / 5.0", // Hardcoded until feedback surveys are submitted
      vegetarianCount: 0,
      glutenFreeCount: 0,
    };

    const allRegistrations = await prisma.registration.findMany({
      select: { dietaryPrefs: true },
    });
    
    allRegistrations.forEach((reg) => {
      if (reg.dietaryPrefs.includes("Vegetarian")) dxpStats.vegetarianCount++;
      if (reg.dietaryPrefs.includes("Gluten-Free")) dxpStats.glutenFreeCount++;
    });

    // MKT Stats
    const campaigns = await prisma.campaign.findMany();
    const mktStats = {
      reach: campaigns.reduce((acc, c) => acc + c.reach, 0),
      clicks: campaigns.reduce((acc, c) => acc + c.clicks, 0),
      conversions: campaigns.reduce((acc, c) => acc + c.conversions, 0),
      topCampaigns: [...campaigns].sort((a, b) => b.conversions - a.conversions).slice(0, 2),
    };

    // Finance Stats
    const transactions = await prisma.financialTransaction.findMany();
    const inflows = transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0);
    const outflows = transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0);
    const financeStats = {
      inflows,
      outflows,
      netReserves: inflows - outflows,
    };

    // LOG_ER Stats
    const sponsors = await prisma.sponsor.findMany();
    const confirmedSponsorships = sponsors.filter(s => s.outreachStatus === "CONFIRMED").reduce((acc, s) => acc + s.contributionAmount, 0);
    
    const logisticsItems = await prisma.logisticsItem.findMany();
    const readyItems = logisticsItems.filter(l => l.status === "READY").length;
    const logPrepLevel = logisticsItems.length > 0 ? Math.round((readyItems / logisticsItems.length) * 100) : 0;

    const logStats = {
      confirmedSponsorships,
      targetGoal: 15000,
      prepLevel: logPrepLevel,
    };

    return {
      ocp: {
        totalRegistrations,
        confirmedDelegates,
        pendingPayments,
        facilitatorsApproved,
        totalFacilitators,
      },
      dxp: dxpStats,
      mkt: mktStats,
      finance: financeStats,
      log_er: logStats,
    };
  });
