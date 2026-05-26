"use client";

import { useState } from "react";
import { Layers, CheckSquare, Truck, Utensils, Box, ShieldCheck, PlusCircle, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LogisticsItem, LogisticsCategory } from "@prisma/client";
import { toggleLogisticsItem, createLogisticsItem } from "@/app/actions/logistics";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface LogisticsClientProps {
  initialItems: LogisticsItem[];
}

const statusCycle = ["PENDING", "ORDERED", "RECEIVED", "READY"];

export default function LogisticsClient({ initialItems }: LogisticsClientProps) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState<LogisticsCategory>("MATERIALS");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  const { execute: executeToggle } = useAction(toggleLogisticsItem, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update item status"),
  });

  const { execute: executeCreate, status: createStatus } = useAction(createLogisticsItem, {
    onSuccess: () => {
      toast.success("Logistics item added.");
      setItem("");
      setQuantity("1");
      setNotes("");
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to add logistics item"),
  });

  const toggleItem = (id: string, currentStatus: any) => {
    executeToggle({ id, currentStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) return;
    executeCreate({
      item: item.trim(),
      category,
      quantity: parseInt(quantity) || 1,
      notes: notes.trim() || undefined,
    });
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

      <div className="grid gap-6 md:grid-cols-3">
        {/* ADD ITEM FORM */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 h-fit space-y-4 md:col-span-1">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Add Inventory</h3>
            <p className="text-xs text-text-muted">Register a new logistical requirement.</p>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Item Name</label>
              <input type="text" value={item} onChange={(e) => setItem(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" placeholder="e.g. A3 Posters" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as LogisticsCategory)} className="bg-surface-2 border border-white/10 rounded-xl px-2.5 py-2.5 outline-none cursor-pointer">
                  <option value="MATERIALS">Materials</option>
                  <option value="TECHNICAL_EQUIPMENT">Equipment</option>
                  <option value="VENUE_SETUP">Venue Setup</option>
                  <option value="MEALS">Meals</option>
                  <option value="TRANSPORTATION">Transport</option>
                  <option value="ACCOMMODATION">Accommodation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Notes</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional details..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
            </div>

            <Button type="submit" disabled={createStatus === "executing"} className="w-full justify-center h-10 mt-2 gap-2">
              <PlusCircle size={16} />
              {createStatus === "executing" ? "Adding..." : "Add to Inventory"}
            </Button>
          </form>
        </Card>

        {/* INVENTORY CHECKLIST */}
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-display font-semibold text-text-primary text-base">Inventory Checklist</h3>
                <p className="text-xs text-text-muted">Click an item to advance its status.</p>
              </div>
            </div>

            <ul className="space-y-3">
              {initialItems.length === 0 && (
                <li className="p-4 text-center text-text-muted text-xs">No logistics items found.</li>
              )}
              {initialItems.map((i) => {
                const currentIdx = statusCycle.indexOf(i.status);
                const isReady = i.status === "READY";
                
                return (
                  <li
                    key={i.id}
                    onClick={() => toggleItem(i.id, i.status)}
                    className="p-4 bg-surface-2/20 border border-white/5 hover:border-white/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition select-none group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className={isReady ? "text-accent-teal" : "text-text-muted"} size={16} />
                        <span className={`text-sm font-semibold text-text-primary ${isReady ? "opacity-50" : ""}`}>
                          {i.item} (x{i.quantity})
                        </span>
                        <Badge variant="purple" className="text-4xs uppercase tracking-widest ml-2">
                          {i.category.replace("_", " ")}
                        </Badge>
                      </div>
                      {i.notes && (
                        <p className="text-xs text-text-secondary pl-6">{i.notes}</p>
                      )}
                    </div>
                    
                    {/* Stepper UI */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        {statusCycle.map((s, idx) => (
                          <div 
                            key={s} 
                            title={s}
                            className={`h-2 w-8 rounded-full transition-colors ${
                              idx <= currentIdx 
                                ? isReady ? "bg-accent-teal" : "bg-accent-purple" 
                                : "bg-white/10"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isReady ? "text-accent-teal" : "text-text-muted group-hover:text-text-secondary"}`}>
                        {i.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
