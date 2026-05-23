"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Star, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FacilitatorApplication } from "@prisma/client";
import { updateFacilitatorStatus } from "@/app/actions/facilitators";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface FacilitatorsClientProps {
  initialApps: FacilitatorApplication[];
}

export default function FacilitatorsClient({ initialApps }: FacilitatorsClientProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Review states
  const [reviewNotes, setReviewNotes] = useState("");
  const [score, setScore] = useState<number>(8);

  const { execute } = useAction(updateFacilitatorStatus, {
    onSuccess: () => {
      toast.success("Application updated successfully");
      setReviewNotes("");
      setExpandedAppId(null);
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to update application"),
  });

  const handleStatusChange = (id: string, nextStatus: FacilitatorApplication["status"]) => {
    execute({ id, status: nextStatus, score, reviewNotes });
  };

  const filtered = initialApps.filter((a) => {
    return activeCategory === "ALL" || a.sessionCategory === activeCategory;
  });

  const getStatusColor = (s: FacilitatorApplication["status"]) => {
    switch (s) {
      case "APPROVED": return "text-accent-teal bg-accent-teal/10 border-accent-teal/20";
      case "UNDER_REVIEW": return "text-accent-purple bg-accent-purple/10 border-accent-purple/20";
      case "PENDING": return "text-accent-amber bg-accent-amber/10 border-accent-amber/20";
      case "REJECTED": return "text-red-400 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Vetting Portal
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Facilitator Applications Tracker
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Review proposed session outlines, score facilitator profiles, and assign statuses.
          </p>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-2 bg-surface-1/40 p-3 border border-white/5 rounded-2xl">
        {["ALL", "LEADERSHIP", "CULTURAL_EXCHANGE", "PERSONAL_DEVELOPMENT", "REFLECTION", "NETWORKING", "WORKSHOP", "KEYNOTE", "ACTIVITY"].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeCategory === cat
                ? "bg-gradient-cta text-white border-accent-purple/40 shadow-glow-purple"
                : "bg-surface-2 text-text-secondary border-white/5 hover:border-white/20"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* APPLICATIONS LIST */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-text-muted text-xs p-10 bg-surface-1/25 rounded-2xl border border-white/5">
            No applications found for this category.
          </div>
        )}
        {filtered.map((a) => {
          const isExpanded = expandedAppId === a.id;
          return (
            <Card key={a.id} className="glass-card border border-white/10 p-6 bg-surface-1/30 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center font-display font-bold text-accent-purple uppercase">
                    {a.fullName.split(" ").map(w => w[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text-primary text-sm">{a.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-3xs text-text-muted">
                      <span>{a.nationality}</span>
                      <span>•</span>
                      <span>{a.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge className={`uppercase text-3xs tracking-widest border ${getStatusColor(a.status)}`}>
                    {a.status.replace("_", " ")}
                  </Badge>
                  <button
                    onClick={() => {
                      if (!isExpanded) {
                        setReviewNotes(a.reviewNotes || "");
                        setScore(a.score || 8);
                      }
                      setExpandedAppId(isExpanded ? null : a.id);
                    }}
                    className="p-1 text-text-muted hover:text-text-primary rounded-lg border border-white/5 hover:bg-white/5 transition"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Basic Session details */}
              <div className="grid gap-4 sm:grid-cols-3 text-xs pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Proposed Workshop</span>
                  <span className="font-semibold text-text-primary mt-0.5 block">{a.sessionTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Category Theme</span>
                  <span className="font-mono text-accent-purple mt-0.5 block uppercase">{a.sessionCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase block">Proposed Duration</span>
                  <span className="font-medium text-text-secondary mt-0.5 block">{a.duration} Minutes</span>
                </div>
              </div>

              {/* Expanded reviews sections */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden pt-4 border-t border-white/5 text-xs"
                  >
                    {/* Objectives & Methods */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-surface-2/20 border border-white/5 rounded-xl space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-muted">Learning Objectives</span>
                        <p className="text-text-secondary leading-relaxed">{a.sessionObjectives}</p>
                      </div>
                      <div className="p-4 bg-surface-2/20 border border-white/5 rounded-xl space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-muted">Interactive Methods</span>
                        <p className="text-text-secondary leading-relaxed">{a.interactiveMethods}</p>
                      </div>
                      <div className="md:col-span-2 p-4 bg-surface-2/20 border border-white/5 rounded-xl space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-text-muted">Motivation & Materials</span>
                        <p className="text-text-secondary leading-relaxed"><strong className="text-text-primary">Motivation:</strong> {a.motivation}</p>
                        <p className="text-text-secondary leading-relaxed"><strong className="text-text-primary">Materials:</strong> {a.materialsNeeded || "None specified"}</p>
                        {a.sessionPlanUrl && (
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <a href={a.sessionPlanUrl} target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:underline font-semibold text-xs inline-flex items-center gap-1.5">
                              📄 View Session Plan Document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vetting details form */}
                    <div className="p-5 bg-surface-2/30 border border-white/10 rounded-2xl space-y-4">
                      <h4 className="font-display font-semibold text-text-primary">Internal Score & Review notes</h4>
                      
                      <div className="grid gap-4 sm:grid-cols-3 items-end">
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-text-muted text-[10px] uppercase font-bold">Vetting Evaluation Notes</label>
                          <input
                            type="text"
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="e.g. Needs more focus on audience roleplay."
                            className="w-full glass-card bg-surface-3/55 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-text-muted text-[10px] uppercase font-bold">Vetting Score (1-10)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={score}
                              onChange={(e) => setScore(Number(e.target.value))}
                              className="w-16 glass-card bg-surface-3/55 outline-none border border-white/10 px-3 py-2 rounded-xl text-center text-xs font-mono font-bold text-accent-purple"
                            />
                            <div className="flex items-center text-accent-amber">
                              <Star size={14} fill="currentColor" />
                              <span className="text-2xs font-semibold ml-1">Avg Score</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Approval buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        <Button
                          onClick={() => handleStatusChange(a.id, "APPROVED")}
                          size="xs"
                          className="flex items-center gap-1.5"
                        >
                          <CheckCircle size={12} />
                          Approve Session
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(a.id, "UNDER_REVIEW")}
                          size="xs"
                          variant="glass"
                          className="flex items-center gap-1.5"
                        >
                          Mark Under Review
                        </Button>
                        <Button
                          onClick={() => handleStatusChange(a.id, "REJECTED")}
                          size="xs"
                          variant="outline"
                          className="flex items-center gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle size={12} />
                          Reject Proposal
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
