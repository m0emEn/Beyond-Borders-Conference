"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Users, ShieldAlert, Check, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { publishSession, type SessionRow } from "@/app/actions/sessions";

type Props = { sessions: SessionRow[] };

export default function SessionSchedulerClient({ sessions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const days = Array.from(new Set(sessions.map((s) => s.day))).sort();
  const [activeDay, setActiveDay] = useState(days[0] ?? 1);

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

                  {s.status === "DRAFT" && (
                    <div className="flex justify-end pt-2 border-t border-white/5">
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
  );
}
