"use client";

import { useState } from "react";
import { Camera, CheckSquare, Film, ListPlus, Send, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Deliverable = {
  id: string;
  title: string;
  category: "PHOTO" | "VIDEO" | "RECAP";
  assignedTo: string;
  status: "PENDING" | "EDITING" | "PUBLISHED";
  deadline: string;
};

const INITIAL_MEDIAS: Deliverable[] = [
  { id: "1", title: "Day 1 Leadership Opening Reel", category: "VIDEO", assignedTo: "Ahmed Bizerte", status: "PUBLISHED", deadline: "2026-07-15" },
  { id: "2", title: "One Global Night Challenge Shots", category: "PHOTO", assignedTo: "Sarra VP", status: "EDITING", deadline: "2026-07-16" },
  { id: "3", title: "Beyond Borders Official Recap Film", category: "RECAP", assignedTo: "Moemen OCP", status: "PENDING", deadline: "2026-07-20" },
];

export default function MediaTrackerPage() {
  const [medias, setMedias] = useState<Deliverable[]>(INITIAL_MEDIAS);

  const toggleStatus = (id: string) => {
    setMedias(medias.map(m => {
      if (m.id === id) {
        const next = m.status === "PENDING" ? "EDITING" : m.status === "EDITING" ? "PUBLISHED" : "PENDING";
        return { ...m, status: next };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Media Operations
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Content & Media Deliverables
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track videography checklists, editor workloads, photo drives, and official recaps.
          </p>
        </div>
      </div>

      {/* DELIVERABLES PIPELINE CARD */}
      <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-display font-semibold text-text-primary text-base">Media Checklist & Pipeline</h3>
          <p className="text-xs text-text-muted">Commit content editing and publishing deadlines. Click status to cycle states.</p>
        </div>

        <div className="space-y-3">
          {medias.map((m) => (
            <div key={m.id} className="p-4 bg-surface-2/20 border border-white/5 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
                  {m.category === "VIDEO" ? <Film size={18} /> : <Camera size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-text-primary">{m.title}</span>
                  <span className="text-[10px] text-text-muted mt-0.5">Editor: {m.assignedTo} | Due: {m.deadline}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleStatus(m.id)}
                  className="flex items-center gap-1 text-[10px] text-accent-teal hover:underline font-semibold bg-surface-3/50 px-2.5 py-1.5 border border-white/5 rounded-lg transition"
                >
                  <RefreshCw size={10} className="animate-spin-slow" />
                  Cycle Status
                </button>

                <Badge className={`text-4xs uppercase tracking-widest border ${
                  m.status === "PUBLISHED"
                    ? "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
                    : m.status === "EDITING"
                    ? "text-accent-amber bg-accent-amber/10 border-accent-amber/20 animate-pulse"
                    : "text-text-muted bg-white/5 border-white/10"
                }`}>
                  {m.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
