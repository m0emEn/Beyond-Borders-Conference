"use client";

import { Layers, CheckSquare, Truck, Utensils, Box, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogisticsItem } from "@prisma/client";
import { toggleLogisticsItem } from "@/app/actions/logistics";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface LogisticsClientProps {
  initialItems: LogisticsItem[];
}

export default function LogisticsClient({ initialItems }: LogisticsClientProps) {
  const { execute } = useAction(toggleLogisticsItem, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update item status"),
  });

  const toggleItem = (id: string, currentStatus: any) => {
    execute({ id, currentStatus });
  };

  const readyCount = initialItems.filter(i => i.status === "READY").length;
  const progressPercent = initialItems.length > 0 ? (readyCount / initialItems.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Operations Logistics
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Logistics & Inventory Readiness
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track visual printing, caterer inventory, transport shuttle paths, and equipment.
          </p>
        </div>
      </div>

      {/* CORE LOGISTICS GAUGE */}
      <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-secondary font-medium">Logistical Preparedness Level</span>
          <span className="font-mono font-bold text-accent-teal">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <div className="bg-accent-teal h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      {/* INVENTORY CHECKLIST */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CHECKLIST */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Logistics Checklist</h3>
            <p className="text-xs text-text-muted">Commit equipment and printing materials checklist status.</p>
          </div>

          <ul className="space-y-2">
            {initialItems.length === 0 && (
              <li className="p-4 text-center text-text-muted text-xs">No logistics items found.</li>
            )}
            {initialItems.map((i) => {
              const isReady = i.status === "READY";
              return (
                <li
                  key={i.id}
                  onClick={() => toggleItem(i.id, i.status)}
                  className="p-3 bg-surface-2/20 border border-white/5 hover:bg-surface-2/45 rounded-xl flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isReady}
                      readOnly
                      className="h-4 w-4 bg-surface-2 accent-accent-teal border-white/10 rounded cursor-pointer"
                    />
                    <span className={`text-xs font-semibold text-text-primary ${isReady ? "line-through opacity-50" : ""}`}>
                      {i.item} (x{i.quantity})
                    </span>
                  </div>
                  <Badge variant="purple" className="text-4xs uppercase tracking-widest">
                    {i.category.replace("_", " ")}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* SHUTTLES & MEALS METRICS */}
        <div className="space-y-6">
          <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Truck className="text-accent-teal" size={18} />
              <h4 className="font-display font-semibold text-text-primary text-sm">Transport Shuttles</h4>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Route A (Tunis Airport - Hotel)</span>
                <Badge variant="teal">Ready</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Route B (Bizerte Station - Hotel)</span>
                <Badge variant="teal">Ready</Badge>
              </div>
            </div>
          </Card>

          <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Utensils className="text-accent-pink" size={18} />
              <h4 className="font-display font-semibold text-text-primary text-sm">Meal Log Totals</h4>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Gluten-Free Portions</span>
                <span className="font-bold text-text-primary font-mono">14 Daily</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Vegetarian Portions</span>
                <span className="font-bold text-text-primary font-mono">22 Daily</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Standard Halal Portions</span>
                <span className="font-bold text-text-primary font-mono">106 Daily</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
