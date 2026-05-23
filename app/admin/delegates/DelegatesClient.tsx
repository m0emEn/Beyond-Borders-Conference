"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  X,
  Phone,
  Utensils,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Registration } from "@prisma/client";
import { updateDelegateStatus, updatePaymentStatus } from "@/app/actions/delegates";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

interface DelegatesClientProps {
  initialDelegates: Registration[];
}

export default function DelegatesClient({ initialDelegates }: DelegatesClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  // Selected Delegate for detail drawer overlay
  const [selectedDelegate, setSelectedDelegate] = useState<Registration | null>(null);

  const { execute: executeStatusUpdate } = useAction(updateDelegateStatus, {
    onSuccess: () => {
      toast.success("Delegate status updated successfully.");
      setSelectedDelegate(null);
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to update status"),
  });

  const { execute: executePaymentUpdate } = useAction(updatePaymentStatus, {
    onSuccess: () => {
      toast.success("Payment status updated successfully.");
      setSelectedDelegate(null);
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to update payment"),
  });

  // Search/Filter matching
  const filtered = initialDelegates.filter((d) => {
    const searchLower = search.toLowerCase();
    const searchMatch =
      d.fullName.toLowerCase().includes(searchLower) ||
      d.email.toLowerCase().includes(searchLower) ||
      d.delegateId.toLowerCase().includes(searchLower) ||
      d.nationality.toLowerCase().includes(searchLower);

    const statusMatch = statusFilter === "ALL" || d.status === statusFilter;
    const paymentMatch = paymentFilter === "ALL" || d.paymentStatus === paymentFilter;

    return searchMatch && statusMatch && paymentMatch;
  });

  const handleStatusUpdate = (id: string, nextStatus: any) => {
    executeStatusUpdate({ id, status: nextStatus });
  };

  const handlePaymentUpdate = (id: string, nextPayment: any) => {
    executePaymentUpdate({ id, paymentStatus: nextPayment });
  };

  // Mock Export files triggers
  const triggerExport = (format: "CSV" | "PDF" | "Excel") => {
    alert(`Successfully generated and exported delegates registry as ${format}.`);
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "APPROVED": return <Badge variant="teal">Approved</Badge>;
      case "CHECKED_IN": return <Badge variant="teal">Checked In</Badge>;
      case "PENDING": return <Badge variant="amber">Pending</Badge>;
      case "REJECTED": return <Badge variant="pink">Rejected</Badge>;
      default: return <Badge variant="default">{s}</Badge>;
    }
  };

  const getPaymentBadge = (p: string) => {
    switch (p) {
      case "CONFIRMED": return <span className="text-accent-teal font-semibold">Confirmed</span>;
      case "UPLOADED": return <span className="text-accent-amber font-semibold">Uploaded</span>;
      case "PENDING": return <span className="text-text-muted">Awaiting</span>;
      case "REJECTED": return <span className="text-red-400 font-semibold">Failed</span>;
      default: return <span className="text-text-muted">{p}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Registrations
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Delegate Registry Database
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Vet motivations, verify manual bank receipts, and assign logistics resources.
          </p>
        </div>

        {/* Exports tools */}
        <div className="flex items-center gap-2">
          <Button onClick={() => triggerExport("CSV")} size="sm" variant="outline" className="flex items-center gap-1.5">
            <Download size={14} />
            CSV
          </Button>
          <Button onClick={() => triggerExport("PDF")} size="sm" variant="outline" className="flex items-center gap-1.5">
            <Download size={14} />
            PDF
          </Button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-1/40 p-4 border border-white/5 rounded-2xl">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, country, or email..."
            className="w-full glass-card bg-surface-2 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2 pl-10 rounded-xl text-xs"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            <span className="text-xs text-text-secondary font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-2 text-text-primary text-xs px-2.5 py-1.5 outline-none border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-surface-2 text-text-primary text-xs px-2.5 py-1.5 outline-none border border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition"
            >
              <option value="ALL">All Payments</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="UPLOADED">Uploaded proof</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <Card className="glass-card border border-white/10 bg-surface-1/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface-2/40 text-text-muted font-semibold">
                <th className="p-4">Delegate ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Room Block</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted text-sm">
                    No delegates found matching the filters.
                  </td>
                </tr>
              )}
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-white/5 transition">
                  <td className="p-4 font-mono font-bold text-accent-pink">{d.delegateId}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-primary">{d.fullName}</span>
                      <span className="text-[10px] text-text-muted mt-0.5">{d.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary font-medium">{d.nationality}</td>
                  <td className="p-4">{getStatusBadge(d.status)}</td>
                  <td className="p-4">{getPaymentBadge(d.paymentStatus)}</td>
                  <td className="p-4 text-text-muted font-mono">{"Unassigned"}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedDelegate(d)}
                      className="p-1.5 text-accent-purple hover:text-accent-pink hover:bg-white/5 rounded-lg transition"
                      title="View Profile Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PROFILE DETAIL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedDelegate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-end z-50">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-lg bg-[#0a0b1e] border-l border-white/10 h-screen overflow-y-auto p-8 relative flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center font-display font-bold text-accent-purple">
                      {selectedDelegate.fullName.split(" ").map((w: string) => w[0]).join("")}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-display font-semibold text-text-primary text-sm">{selectedDelegate.fullName}</h4>
                      <span className="text-3xs font-mono font-bold text-accent-pink tracking-tight">{selectedDelegate.delegateId}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDelegate(null)} className="p-2 text-text-muted hover:text-text-primary">
                    <X size={20} />
                  </button>
                </div>

                {/* Profile detail details */}
                <div className="grid gap-4 grid-cols-2 text-xs">
                  <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-text-muted block font-semibold tracking-wider uppercase">Email</span>
                    <span className="text-text-primary mt-1 block font-medium truncate">{selectedDelegate.email}</span>
                  </div>
                  <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-text-muted block font-semibold tracking-wider uppercase">Phone</span>
                    <span className="text-text-primary mt-1 block font-medium truncate">{selectedDelegate.phone}</span>
                  </div>
                  <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-text-muted block font-semibold tracking-wider uppercase">Nationality</span>
                    <span className="text-text-primary mt-1 block font-medium">{selectedDelegate.nationality}</span>
                  </div>
                  <div className="p-3 bg-surface-2/20 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-text-muted block font-semibold tracking-wider uppercase">Room assignment</span>
                    <span className="text-text-primary mt-1 block font-mono font-semibold">{"Unassigned"}</span>
                  </div>
                </div>

                {/* Dietary selections */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Dietary Preferences</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDelegate.dietaryPrefs.map((pref: string) => (
                      <Badge key={pref} variant="purple" className="text-3xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Motivations */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Motivation Statement</span>
                  <div className="p-4 bg-surface-2/30 border border-white/5 rounded-2xl text-xs text-text-secondary leading-relaxed">
                    &quot;{selectedDelegate.motivation}&quot;
                  </div>
                </div>

                {/* Uploaded Receipt slip */}
                {selectedDelegate.paymentProof && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Payment Receipt Slip</span>
                    <div className="rounded-xl overflow-hidden border border-white/10 relative h-32 w-full bg-surface-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedDelegate.paymentProof} className="object-cover w-full h-full" alt="Manual Slip" />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer bottom actions */}
              <div className="border-t border-white/10 pt-4 flex gap-3">
                {selectedDelegate.paymentStatus !== "CONFIRMED" && (
                  <Button
                    onClick={() => handlePaymentUpdate(selectedDelegate.id, "CONFIRMED")}
                    size="sm"
                    className="flex-1 justify-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Confirm Payment
                  </Button>
                )}
                {selectedDelegate.status !== "APPROVED" && (
                  <Button
                    onClick={() => handleStatusUpdate(selectedDelegate.id, "APPROVED")}
                    size="sm"
                    className="flex-1 justify-center"
                    variant="glass"
                  >
                    Approve Delegate
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
