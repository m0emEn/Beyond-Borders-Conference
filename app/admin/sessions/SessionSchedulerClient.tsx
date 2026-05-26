"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Users, Check, Calendar, Trash2, Edit2, PlusCircle, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { publishSession, createSession, updateSession, deleteSession, type SessionRow } from "@/app/actions/sessions";
import { useAction } from "next-safe-action/hooks";
import { SessionCategory, Facilitator } from "@prisma/client";

type Props = { sessions: SessionRow[], facilitators: Facilitator[] };

export default function SessionSchedulerClient({ sessions, facilitators }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const days = Array.from(new Set(sessions.map((s) => s.day))).sort();
  const [activeDay, setActiveDay] = useState(days[0] ?? 1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SessionCategory>("KEYNOTE");
  const [day, setDay] = useState<number>(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [facilitatorId, setFacilitatorId] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("KEYNOTE");
    setDay(1);
    setStartTime("");
    setEndTime("");
    setLocation("");
    setCapacity("");
    setFacilitatorId("");
  };

  const { execute: executeCreate, status: createStatus } = useAction(createSession, {
    onSuccess: () => { toast.success("Session created"); resetForm(); router.refresh(); },
    onError: (err) => toast.error(err.error?.serverError || "Failed to create session"),
  });
  const { execute: executeUpdate, status: updateStatus } = useAction(updateSession, {
    onSuccess: () => { toast.success("Session updated"); resetForm(); router.refresh(); },
    onError: (err) => toast.error(err.error?.serverError || "Failed to update session"),
  });
  const { execute: executeDelete } = useAction(deleteSession, {
    onSuccess: () => { toast.success("Session deleted"); router.refresh(); },
    onError: (err) => toast.error(err.error?.serverError || "Failed to delete session"),
  });

  const handleEdit = (s: SessionRow) => {
    setEditingId(s.id);
    setTitle(s.title);
    setDescription(s.description);
    setCategory(s.category);
    setDay(s.day);
    setStartTime(s.startTime.slice(0, 16));
    setEndTime(s.endTime.slice(0, 16));
    setLocation(s.location);
    setCapacity(s.capacity ? String(s.capacity) : "");
    setFacilitatorId(s.facilitatorId || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      executeDelete({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      category,
      day,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      location: location.trim(),
      capacity: capacity ? parseInt(capacity, 10) : undefined,
      facilitatorId: facilitatorId || undefined,
    };

    if (editingId) {
      executeUpdate({ id: editingId, ...data });
    } else {
      executeCreate(data);
    }
  };

  const filtered = sessions.filter((s) => s.day === activeDay);

  const handlePublish = (id: string) => {
    startTransition(async () => {
      const result = await publishSession({ id });
      if (result?.data?.success) {
        toast.success("Session published.");
        router.refresh();
      } else {
        toast.error("Failed to publish session.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            Program Operations
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Conference Session Scheduler
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Map sessions to rooms, audit capacity caps, and verify facilitator assignments.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* COMPOSER */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 h-fit space-y-4 lg:col-span-1">
          <div className="border-b border-white/5 pb-3 flex justify-between items-start">
            <div>
              <h3 className="font-display font-semibold text-text-primary text-base">
                {editingId ? "Edit Session" : "Schedule Session"}
              </h3>
            </div>
            {editingId && (
              <button onClick={resetForm} className="text-text-muted hover:text-white transition">
                <X size={16} />
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as SessionCategory)} className="bg-surface-2 border border-white/10 rounded-xl px-2.5 py-2.5 outline-none cursor-pointer">
                  <option value="KEYNOTE">Keynote</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="PANEL">Panel</option>
                  <option value="NETWORKING">Networking</option>
                  <option value="ACTIVITY">Activity</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Day</label>
                <input type="number" min="1" value={day} onChange={(e) => setDay(parseInt(e.target.value))} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Start Time</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">End Time</label>
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Capacity</label>
                <input type="number" placeholder="Optional" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Assign Facilitator</label>
              <select value={facilitatorId} onChange={(e) => setFacilitatorId(e.target.value)} className="bg-surface-2 border border-white/10 rounded-xl px-4 py-2.5 outline-none cursor-pointer">
                <option value="">Unassigned</option>
                {facilitators.map((f) => (
                  <option key={f.id} value={f.id}>{f.fullName}</option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={createStatus === "executing" || updateStatus === "executing"} className="w-full justify-center h-10 mt-2 gap-2">
              <PlusCircle size={16} />
              {editingId ? "Update Session" : "Create Session"}
            </Button>
          </form>
        </Card>

        {/* FEED */}
        <div className="lg:col-span-2 space-y-4">

      {sessions.length === 0 ? (
        <Card className="glass-card border border-white/10 p-12 bg-surface-1/25 flex flex-col items-center justify-center text-center space-y-3">
          <Calendar className="text-text-muted" size={36} />
          <p className="text-text-secondary text-sm">No sessions added yet.</p>
          <p className="text-text-muted text-xs">Create sessions in the database to see them here.</p>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 bg-surface-1/40 p-2.5 border border-white/5 rounded-2xl w-fit">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-6 py-2 rounded-xl text-xs font-semibold border transition ${
                  activeDay === d
                    ? "bg-gradient-cta text-white border-accent-purple/30 shadow-glow-purple"
                    : "bg-surface-2 text-text-secondary border-white/5 hover:border-white/20"
                }`}
              >
                Day {d} Timeline
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-text-muted text-sm py-8 text-center">
              No sessions scheduled for Day {activeDay}.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((s) => (
                <Card
                  key={s.id}
                  className="glass-card border border-white/10 p-6 bg-surface-1/25 relative overflow-hidden flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <Badge variant="purple" className="uppercase text-4xs font-bold tracking-widest">
                        {s.category.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        className={`text-4xs uppercase tracking-widest border ${
                          s.status === "PUBLISHED"
                            ? "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
                            : s.status === "CANCELLED"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : "text-text-muted bg-white/5 border-white/10"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <h3 className="font-display font-semibold text-text-primary text-base leading-snug">
                      {s.title}
                    </h3>
                    {s.facilitatorName && (
                      <p className="text-xs text-accent-purple font-medium flex items-center gap-1.5">
                        <Users size={12} />
                        {s.facilitatorName}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 grid-cols-2 text-xs pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <MapPin className="text-accent-purple shrink-0" size={14} />
                      <span className="truncate">{s.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Clock className="text-accent-teal shrink-0" size={14} />
                      <span>{s.timeSlot}</span>
                    </div>
                  </div>

                  {s.capacity != null && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-4xs font-mono text-text-muted">
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          Capacity
                        </span>
                        <span className="text-text-secondary">{s.capacity} max</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-accent-teal h-1.5 rounded-full w-0" />
                      </div>
                    </div>
                  )}

                  {s.status === "PUBLISHED" ? (
                    <div className="flex justify-end pt-2 border-t border-white/5 gap-2">
                      <Button
                        onClick={() => handleEdit(s)}
                        size="xs"
                        variant="outline"
                        className="flex items-center gap-1.5 text-text-secondary"
                      >
                        <Edit2 size={12} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(s.id)}
                        size="xs"
                        variant="outline"
                        className="flex items-center gap-1.5 text-red-400 hover:bg-red-500/10 border-red-500/20"
                      >
                        <Trash2 size={12} />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-2 border-t border-white/5 gap-2">
                      <Button
                        onClick={() => handleEdit(s)}
                        size="xs"
                        variant="outline"
                        className="flex items-center gap-1.5 text-text-secondary"
                      >
                        <Edit2 size={12} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handlePublish(s.id)}
                        size="xs"
                        className="flex items-center gap-1.5"
                        disabled={isPending}
                      >
                        <Check size={12} />
                        Publish Schedule
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
}
