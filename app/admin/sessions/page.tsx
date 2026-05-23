"use client";

import { useState } from "react";
import { Clock, MapPin, Users, Award, ShieldAlert, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type SessionObj = {
  id: string;
  title: string;
  category: string;
  day: number;
  timeSlot: string;
  location: string;
  capacity: number;
  enrolled: number;
  facilitator: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
};

const INITIAL_SESSIONS: SessionObj[] = [
  { id: "1", title: "Leading Across Borders", category: "LEADERSHIP", day: 1, timeSlot: "10:00 - 11:30", location: "Grand Ballroom", capacity: 100, enrolled: 96, facilitator: "Dr. Elena Rostova", status: "PUBLISHED" },
  { id: "2", title: "Cultural Intelligence Workshop", category: "CULTURAL_EXCHANGE", day: 2, timeSlot: "14:00 - 15:30", location: "Auditorium A", capacity: 50, enrolled: 54, facilitator: "Moemen Sfaxi", status: "PUBLISHED" }, // Overcapacity alert
  { id: "3", title: "Future-Ready Mindset", category: "PERSONAL_DEVELOPMENT", day: 3, timeSlot: "11:00 - 12:00", location: "Seminar Room B", capacity: 40, enrolled: 30, facilitator: "Yassine Jlassi", status: "DRAFT" },
];

export default function SessionSchedulerPage() {
  const [sessions, setSessions] = useState<SessionObj[]>(INITIAL_SESSIONS);
  const [activeDay, setActiveDay] = useState(1);

  const handlePublish = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, status: "PUBLISHED" } : s));
  };

  const filtered = sessions.filter(s => s.day === activeDay);

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
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

      {/* DAY TOGGLES */}
      <div className="flex gap-2 bg-surface-1/40 p-2.5 border border-white/5 rounded-2xl w-fit">
        {[1, 2, 3].map(d => (
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

      {/* SESSION CARD SCHEDULER */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((s) => {
          const isOverCapacity = s.enrolled > s.capacity;
          return (
            <Card key={s.id} className="glass-card border border-white/10 p-6 bg-surface-1/25 relative overflow-hidden flex flex-col justify-between space-y-4">
              
              {/* Top Meta info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <Badge variant="purple" className="uppercase text-4xs font-bold tracking-widest">
                    {s.category.replace("_", " ")}
                  </Badge>
                  <Badge className={`text-4xs uppercase tracking-widest border ${s.status === "PUBLISHED" ? "text-accent-teal bg-accent-teal/10 border-accent-teal/20" : "text-text-muted bg-white/5 border-white/10"}`}>
                    {s.status}
                  </Badge>
                </div>

                <h3 className="font-display font-semibold text-text-primary text-base leading-snug">
                  {s.title}
                </h3>
              </div>

              {/* Warnings and errors alert */}
              {isOverCapacity && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-2 text-3xs text-red-300">
                  <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={14} />
                  <span>Capacity overload error: Enrolled EPs ({s.enrolled}) exceeds room capacity ({s.capacity}). Reallocate room immediately.</span>
                </div>
              )}

              {/* Room details */}
              <div className="grid gap-3 grid-cols-3 text-xs pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <MapPin className="text-accent-purple shrink-0" size={14} />
                  <span className="truncate">{s.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Clock className="text-accent-teal shrink-0" size={14} />
                  <span>{s.timeSlot}</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <Award className="text-accent-pink shrink-0" size={14} />
                  <span className="truncate">{s.facilitator}</span>
                </div>
              </div>

              {/* Capacity visual gauges */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-4xs font-mono text-text-muted">
                  <span>Enrolled delegates</span>
                  <span className={isOverCapacity ? "text-red-400 font-semibold" : "text-text-secondary"}>
                    {s.enrolled} / {s.capacity} Max
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${isOverCapacity ? "bg-red-400" : "bg-accent-teal"}`}
                    style={{ width: `${Math.min((s.enrolled / s.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick operations actions */}
              {s.status === "DRAFT" && (
                <div className="flex justify-end pt-2 border-t border-white/5">
                  <Button onClick={() => handlePublish(s.id)} size="xs" className="flex items-center gap-1.5">
                    <Check size={12} />
                    Publish Schedule
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
