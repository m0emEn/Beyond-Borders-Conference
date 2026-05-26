"use client";

import { useState } from "react";
import { Target, Handshake, User, FileCheck, ChevronRight, ChevronLeft, PlusCircle, Edit2, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sponsor, SponsorStatus, SponsorPackage } from "@prisma/client";
import { updateSponsorStatus, createSponsor, updateSponsor, deleteSponsor } from "@/app/actions/sponsors";
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

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sponsorshipPackage, setSponsorshipPackage] = useState<SponsorPackage>("BRONZE");
  const [contributionAmount, setContributionAmount] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [brandingObligations, setBrandingObligations] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setCompanyName("");
    setContactPerson("");
    setEmail("");
    setPhone("");
    setSponsorshipPackage("BRONZE");
    setContributionAmount("");
    setDeliverables("");
    setBrandingObligations("");
    setNotes("");
  };

  const { execute: executeStatusUpdate } = useAction(updateSponsorStatus, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update sponsor status"),
  });

  const { execute: executeCreate, status: createStatus } = useAction(createSponsor, {
    onSuccess: () => { toast.success("Sponsor added to pipeline"); resetForm(); },
    onError: (err) => toast.error(err.error?.serverError || "Failed to create sponsor"),
  });

  const { execute: executeUpdate, status: updateStatus } = useAction(updateSponsor, {
    onSuccess: () => { toast.success("Sponsor updated"); resetForm(); },
    onError: (err) => toast.error(err.error?.serverError || "Failed to update sponsor"),
  });

  const { execute: executeDelete } = useAction(deleteSponsor, {
    onSuccess: () => toast.success("Sponsor deleted"),
    onError: (err) => toast.error(err.error?.serverError || "Failed to delete sponsor"),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      executeDelete({ id });
    }
  };

  const handleMove = (id: string, currentStatus: SponsorStatus, direction: 1 | -1) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      executeStatusUpdate({ id, status: statusOrder[nextIndex] });
    }
  };

  const handleEdit = (s: Sponsor) => {
    setEditingId(s.id);
    setShowForm(true);
    setCompanyName(s.companyName);
    setContactPerson(s.contactPerson);
    setEmail(s.email || "");
    setPhone(s.phone || "");
    setSponsorshipPackage(s.sponsorshipPackage);
    setContributionAmount(s.contributionAmount.toString());
    setDeliverables(s.deliverables.join(", "));
    setBrandingObligations(s.brandingObligations || "");
    setNotes(s.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

// Duplicate handleDelete removed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      sponsorshipPackage,
      contributionAmount: parseFloat(contributionAmount) || 0,
      deliverables: deliverables.split(",").map(d => d.trim()).filter(Boolean),
      brandingObligations: brandingObligations.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (editingId) {
      executeUpdate({ id: editingId, ...data });
    } else {
      executeCreate(data);
    }
  };

  const isBusy = createStatus === "executing" || updateStatus === "executing";

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
        <Button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="gap-2">
          {showForm ? <><X size={16} /> Cancel</> : <><PlusCircle size={16} /> Add Sponsor</>}
        </Button>
      </div>

      {/* COMPOSER FORM */}
      {showForm && (
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 space-y-4">
          <div className="border-b border-white/5 pb-3 flex justify-between items-start">
            <div>
              <h3 className="font-display font-semibold text-text-primary text-base">
                {editingId ? "Edit Sponsor" : "Add New Sponsor"}
              </h3>
              <p className="text-xs text-text-muted">Fill in the corporate partner details below.</p>
            </div>
            {editingId && (
              <button onClick={resetForm} className="text-text-muted hover:text-white transition">
                <X size={16} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Company Name</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Contact Person</label>
                <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Package</label>
                <select value={sponsorshipPackage} onChange={(e) => setSponsorshipPackage(e.target.value as SponsorPackage)} className="bg-surface-2 border border-white/10 rounded-xl px-2.5 py-2.5 outline-none cursor-pointer">
                  <option value="BRONZE">Bronze</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="PLATINUM">Platinum</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Contribution (TND)</label>
                <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="e.g. 2000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none font-mono focus:border-accent-purple/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Deliverables</label>
                <input type="text" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Comma-separated" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Branding Obligations</label>
                <input type="text" value={brandingObligations} onChange={(e) => setBrandingObligations(e.target.value)} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Notes</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-accent-purple/60" />
              </div>
            </div>

            <Button type="submit" disabled={isBusy} className="w-full justify-center h-10 mt-2 gap-2 md:w-auto md:px-8">
              <PlusCircle size={16} />
              {editingId
                ? (isBusy ? "Updating..." : "Update Sponsor")
                : (isBusy ? "Adding..." : "Add to Pipeline")}
            </Button>
          </form>
        </Card>
      )}

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

                    {/* Action buttons */}
                    <div className="flex justify-between gap-1.5 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(s.id, s.outreachStatus, -1)}
                          className={`text-[10px] flex items-center ${status === "CONTACTED" ? "invisible" : "text-text-secondary hover:text-white"}`}
                          title="Move back"
                        >
                          <ChevronLeft size={14} /> Back
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(s)} className="p-1 text-text-muted hover:text-white hover:bg-white/5 rounded-md transition" title="Edit">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition" title="Delete">
                          <Trash2 size={12} />
                        </button>
                        <button
                          onClick={() => handleMove(s.id, s.outreachStatus, 1)}
                          className={`text-[10px] flex items-center ${status === "CONFIRMED" ? "invisible" : "text-accent-purple hover:underline"}`}
                          title="Move forward"
                        >
                          Advance <ChevronRight size={14} />
                        </button>
                      </div>
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
