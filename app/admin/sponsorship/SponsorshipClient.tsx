"use client";

import { useState } from "react";
import { Target, Handshake, User, FileCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sponsor, SponsorStatus } from "@prisma/client";
import { updateSponsorStatus } from "@/app/actions/sponsors";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface SponsorshipClientProps {
  initialSponsors: Sponsor[];
}

const statusOrder: SponsorStatus[] = ["CONTACTED", "MEETING_SCHEDULED", "NEGOTIATING", "CONFIRMED"];

export default function SponsorshipClient({ initialSponsors }: SponsorshipClientProps) {
  const totalSponsorshipGoal = 15000;
  const confirmedSponsorship = initialSponsors.filter(s => s.outreachStatus === "CONFIRMED").reduce((acc, c) => acc + c.contributionAmount, 0);
  const targetPercent = Math.min((confirmedSponsorship / totalSponsorshipGoal) * 100, 100);

  const { execute } = useAction(updateSponsorStatus, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update sponsor status"),
  });

  const handleMove = (id: string, currentStatus: SponsorStatus, direction: 1 | -1) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      execute({ id, status: statusOrder[nextIndex] });
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Corporate Partnerships
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Sponsorship & Partnerships CRM
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Centrally track outreach status, corporate funding goals, and branding obligation checks.
          </p>
        </div>
      </div>

      {/* PIPELINE STATISTICS WIDGETS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Funding Goal Target
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-purple tracking-tight">
              {totalSponsorshipGoal.toLocaleString()} TND
            </h3>
          </div>
          <div className="p-3.5 bg-accent-purple/10 rounded-xl border border-accent-purple/20 text-accent-purple">
            <Target size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Confirmed Corporate Funding
            </span>
            <h3 className="text-2xl font-bold font-mono text-accent-teal tracking-tight">
              {confirmedSponsorship.toLocaleString()} TND
            </h3>
          </div>
          <div className="p-3.5 bg-accent-teal/10 rounded-xl border border-accent-teal/20 text-accent-teal">
            <Handshake size={20} />
          </div>
        </Card>

        <Card className="glass-card p-6 border border-white/10 bg-surface-1/30 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-3xs uppercase tracking-wider text-text-muted font-bold block">
              Outreach Conversion Ratio
            </span>
            <span className="font-mono text-xs font-bold text-accent-pink">{targetPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent-pink h-1.5 rounded-full" style={{ width: `${targetPercent}%` }} />
          </div>
        </Card>
      </div>

      {/* PIPELINE KANBAN BOARD */}
      <div className="grid gap-6 md:grid-cols-4">
        {statusOrder.map((status) => {
          const colSponsors = initialSponsors.filter(s => s.outreachStatus === status);
          return (
            <div key={status} className="space-y-4">
              <div className="flex justify-between items-center bg-surface-1/40 px-4 py-2.5 border border-white/5 rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary">
                  {status.replace("_", " ")}
                </span>
                <Badge variant={status === "CONFIRMED" ? "teal" : "purple"}>
                  {colSponsors.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[350px] p-2 bg-surface-1/10 rounded-2xl border border-white/5 border-dashed">
                {colSponsors.length === 0 && (
                  <div className="text-center text-text-muted text-xs p-4">Empty</div>
                )}
                {colSponsors.map((s) => (
                  <Card key={s.id} className="glass-card border border-white/10 hover:border-white/20 p-4 space-y-3 bg-surface-1/30">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-text-primary leading-snug">{s.companyName}</span>
                      <Badge className="text-4xs uppercase tracking-widest bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                        {s.sponsorshipPackage}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-3xs text-text-muted">
                      <User size={12} />
                      <span>{s.contactPerson}</span>
                    </div>

                    {s.deliverables.length > 0 && (
                      <div className="flex items-center gap-1.5 text-3xs text-text-muted">
                        <FileCheck size={12} className="text-accent-teal shrink-0" />
                        <span className="truncate">{s.deliverables[0]}...</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Value:</span>
                      <span className="font-mono text-xs font-bold text-accent-teal">{s.contributionAmount.toLocaleString()} TND</span>
                    </div>

                    {/* Action quick toggle */}
                    <div className="flex justify-between gap-1.5 pt-1">
                      <button
                        onClick={() => handleMove(s.id, s.outreachStatus, -1)}
                        className={`text-[10px] flex items-center ${status === "CONTACTED" ? "invisible" : "text-text-secondary hover:text-white"}`}
                        title="Move back"
                      >
                        <ChevronLeft size={14} /> Back
                      </button>
                      <button
                        onClick={() => handleMove(s.id, s.outreachStatus, 1)}
                        className={`text-[10px] flex items-center ${status === "CONFIRMED" ? "invisible" : "text-accent-purple hover:underline"}`}
                        title="Move forward"
                      >
                        Advance <ChevronRight size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
