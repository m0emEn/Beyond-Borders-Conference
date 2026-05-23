"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Risk, OCMember } from "@prisma/client";
import { toggleRisk, createRisk } from "@/app/actions/risks";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type RiskWithOwner = Risk & { owner: OCMember | null };

interface RisksClientProps {
  initialRisks: RiskWithOwner[];
  members: OCMember[];
}

export default function RisksClient({ initialRisks, members }: RisksClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // New Risk Form
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<Risk["category"]>("LOGISTICS");
  const [prob, setProb] = useState(2);
  const [imp, setImp] = useState(3);
  const [prev, setPrev] = useState("");
  const [cont, setCont] = useState("");
  const [ownerId, setOwnerId] = useState("UNASSIGNED");

  const { execute: executeToggle } = useAction(toggleRisk, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update risk status"),
  });

  const { execute: executeCreate, status: createStatus } = useAction(createRisk, {
    onSuccess: () => {
      toast.success("Risk registered successfully");
      setModalOpen(false);
      setTitle("");
      setPrev("");
      setCont("");
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to create risk"),
  });

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    executeCreate({
      title: title.trim(),
      category: cat,
      probability: prob,
      impact: imp,
      preventionStrategy: prev || "None documented",
      contingencyPlan: cont || "None documented",
      ownerId: ownerId,
    });
  };

  const handleMitigate = (id: string, currentMitigated: boolean) => {
    executeToggle({ id, mitigated: !currentMitigated });
  };

  const getRiskScore = (r: Risk) => r.probability * r.impact;
  const getScoreColor = (score: number) => {
    if (score >= 15) return "text-red-400 font-bold";
    if (score >= 8) return "text-accent-amber font-semibold";
    return "text-accent-teal font-medium";
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Operations Vetting
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Operational Risk Matrix
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track potential logistical, program, or financial bottlenecks, defining active mitigation plans.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5">
          <Plus size={16} />
          Register Risk
        </Button>
      </div>

      {/* HEATMAP MATRIX & RISKS OVERVIEW */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* INTERACTIVE 5x5 HEATMAP MATRIX */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display font-semibold text-text-primary text-base">5x5 Risk Heatmap</h3>
            <p className="text-xs text-text-muted">Probability (X) vs Impact (Y) distribution.</p>
          </div>

          <div className="grid grid-cols-6 gap-1 relative py-2">
            {/* Axis labels */}
            <span className="text-[8px] font-mono text-text-muted absolute -left-4 top-1/2 -translate-y-1/2 transform -rotate-90">
              IMPACT
            </span>

            {/* Matrix grid cells */}
            {Array.from({ length: 5 }).map((_, rIdx) => {
              const impactLevel = 5 - rIdx; // Y-axis: 5 down to 1
              return (
                <div key={rIdx} className="contents">
                  <span className="text-3xs text-text-muted flex items-center justify-center font-semibold font-mono w-4">
                    {impactLevel}
                  </span>
                  {Array.from({ length: 5 }).map((_, cIdx) => {
                    const probLevel = cIdx + 1; // X-axis: 1 to 5
                    const score = impactLevel * probLevel;
                    
                    // Filter matching risks in this heat grid coordinate
                    const matchingRisks = initialRisks.filter(r => r.probability === probLevel && r.impact === impactLevel && !r.mitigated);

                    let bgCell = "bg-green-500/10 hover:bg-green-500/20 border-green-500/10";
                    if (score >= 15) bgCell = "bg-red-500/20 hover:bg-red-500/35 border-red-500/20";
                    else if (score >= 8) bgCell = "bg-yellow-500/15 hover:bg-yellow-500/25 border-yellow-500/15";

                    return (
                      <div
                        key={cIdx}
                        className={`h-11 border rounded-lg ${bgCell} transition flex items-center justify-center relative group cursor-help`}
                      >
                        {matchingRisks.length > 0 && (
                          <span className="h-5 w-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold font-mono text-white animate-pulse">
                            {matchingRisks.length}
                          </span>
                        )}

                        {/* Custom tooltip panel displaying matched risk titles */}
                        {matchingRisks.length > 0 && (
                          <div className="absolute bottom-12 bg-surface-3 border border-white/15 px-2.5 py-1.5 rounded-lg text-3xs text-text-secondary w-36 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                            {matchingRisks.map(m => (
                              <div key={m.id} className="border-b border-white/5 py-0.5 last:border-0 truncate font-semibold">
                                {m.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Bottom X-axis labels */}
            <div className="col-start-2 col-span-5 grid grid-cols-5 text-center text-3xs text-text-muted mt-2 font-mono font-semibold">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <span className="col-start-2 col-span-5 text-center text-[8px] font-mono text-text-muted uppercase mt-1 tracking-wider">
              PROBABILITY
            </span>
          </div>
        </Card>

        {/* RISK LEDGER DETAILS */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 lg:col-span-2 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Registered Risks & Strategies</h3>
            <p className="text-xs text-text-muted">Prevention and contingency roadmap details.</p>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
            {initialRisks.length === 0 && (
              <div className="text-center text-text-muted text-xs p-4">No risks registered.</div>
            )}
            {initialRisks.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${
                  r.mitigated
                    ? "bg-surface-2/10 border-white/5 opacity-50"
                    : "bg-surface-2/30 border-white/10"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={r.mitigated ? "text-text-muted" : "text-accent-amber"} size={16} />
                    <span className={`text-xs font-semibold text-text-primary ${r.mitigated ? "line-through" : ""}`}>{r.title}</span>
                  </div>

                  <Badge className="text-4xs uppercase tracking-widest bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                    {r.category.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid gap-3 grid-cols-2 text-xs p-3 bg-surface-3/30 border border-white/5 rounded-lg">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-muted">Prevention Plan</span>
                    <p className="text-text-secondary leading-normal mt-0.5">{r.preventionStrategy}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-muted">Contingency</span>
                    <p className="text-text-secondary leading-normal mt-0.5">{r.contingencyPlan}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-2xs">
                  <span className="text-text-muted">Owner: {r.owner?.fullName || "Unassigned"}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted">Risk Value: <span className={getScoreColor(getRiskScore(r))}>{getRiskScore(r)}</span></span>
                    <button
                      onClick={() => handleMitigate(r.id, r.mitigated)}
                      className={`px-2.5 py-1 rounded-lg text-3xs font-semibold border transition ${
                        r.mitigated
                          ? "bg-accent-teal/15 text-accent-teal border-accent-teal/30"
                          : "bg-white/5 text-text-secondary border-white/10 hover:border-white/20"
                      }`}
                    >
                      {r.mitigated ? "Mitigated" : "Resolve"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CREATE RISK MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-card border border-white/10 bg-surface-1 p-6 space-y-4 shadow-2xl rounded-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-display font-semibold text-text-primary text-base">Register Operational Risk</h3>
                <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddRisk} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-text-secondary font-medium">Risk Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead program speaker has power outage"
                    className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs"
                    required
                  />
                </div>

                <div className="grid gap-4 grid-cols-3">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-text-secondary font-medium">Category</label>
                    <select
                      value={cat}
                      onChange={(e) => setCat(e.target.value as any)}
                      className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                    >
                      <option value="LOGISTICS">Logistics</option>
                      <option value="FINANCIAL">Financial</option>
                      <option value="OPERATIONAL">Operational</option>
                      <option value="TECHNICAL">Technical Equipment</option>
                      <option value="EXPERIENCE_DELIVERY">Experience Delivery</option>
                      <option value="SAFETY">Safety / Emergency</option>
                      <option value="LOW_REGISTRATIONS">Low Registrations</option>
                      <option value="FACILITATOR_CANCELLATION">Facilitator Cancellation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-secondary font-medium">Owner</label>
                    <select
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                    >
                      <option value="UNASSIGNED">Unassigned</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-secondary font-medium">Probability (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={prob}
                      onChange={(e) => setProb(Number(e.target.value))}
                      className="glass-card bg-surface-2 border border-white/10 px-3 py-2 rounded-xl outline-none font-bold text-center text-accent-purple"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-text-secondary font-medium">Impact (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={imp}
                      onChange={(e) => setImp(Number(e.target.value))}
                      className="glass-card bg-surface-2 border border-white/10 px-3 py-2 rounded-xl outline-none font-bold text-center text-accent-pink"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-text-secondary font-medium">Prevention Strategy</label>
                  <textarea
                    rows={2}
                    value={prev}
                    onChange={(e) => setPrev(e.target.value)}
                    placeholder="Steps to prevent this risk from happening..."
                    className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-text-secondary font-medium">Contingency Plan</label>
                  <textarea
                    rows={2}
                    value={cont}
                    onChange={(e) => setCont(e.target.value)}
                    placeholder="Steps to recover if this risk happens..."
                    className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs resize-none"
                    required
                  />
                </div>

                <Button type="submit" disabled={createStatus === "executing"} className="w-full justify-center gap-2 h-10 mt-2">
                  {createStatus === "executing" ? "Committing..." : "Commit Risk Plan"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
