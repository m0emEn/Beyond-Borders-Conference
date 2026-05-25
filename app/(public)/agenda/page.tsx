import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Agenda" };

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const DAY_COLORS: Record<number, string> = {
  1: "text-accent-purple border-accent-purple/30 bg-accent-purple/10",
  2: "text-accent-teal border-accent-teal/30 bg-accent-teal/10",
  3: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  4: "text-accent-pink border-accent-pink/30 bg-accent-pink/10",
};

const DAY_DIVIDERS: Record<number, string> = {
  1: "from-accent-purple/30 via-accent-purple/10 to-transparent",
  2: "from-accent-teal/30 via-accent-teal/10 to-transparent",
  3: "from-accent-amber/30 via-accent-amber/10 to-transparent",
  4: "from-accent-pink/30 via-accent-pink/10 to-transparent",
};

export default async function AgendaPage() {
  const items = await prisma.agendaItem.findMany({
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  // Group by day
  const byDay = items.reduce<Record<number, typeof items>>((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  const days = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);

  const hasData = items.length > 0;

  return (
    <>
      <PageHeader
        title="Conference Agenda"
        description="Day-by-day timeline with sessions, facilitators, and locations."
      />

      <section className="section-container pb-24 space-y-12">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <Calendar className="text-accent-purple" size={28} />
            </div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Agenda not published yet
            </h2>
            <p className="text-sm text-text-secondary max-w-sm">
              The full multi-day programme will appear here once finalized. Check back soon.
            </p>
          </div>
        ) : (
          days.map((day) => {
            const colorClass =
              DAY_COLORS[day] ?? "text-text-secondary border-white/20 bg-white/5";
            const dividerClass =
              DAY_DIVIDERS[day] ?? "from-white/20 via-white/5 to-transparent";

            return (
              <div key={day} className="space-y-4">
                {/* Day header */}
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-widest border ${colorClass}`}
                  >
                    Day {day}
                  </span>
                  <div
                    className={`flex-1 h-px bg-gradient-to-r ${dividerClass}`}
                  />
                </div>

                {/* Timeline items */}
                <div className="relative pl-6 space-y-3">
                  {/* Vertical line */}
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-white/15 to-transparent" />

                  {byDay[day].map((item) => (
                    <Card
                      key={item.id}
                      className="relative border border-white/10 bg-surface-1/30 p-5 space-y-3"
                    >
                      {/* Connector dot */}
                      <div className="absolute -left-[18px] top-6 w-2.5 h-2.5 rounded-full bg-accent-purple border-2 border-bg" />

                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-text-primary text-sm leading-snug">
                          {item.title}
                        </h3>
                        {item.category && (
                          <Badge variant="purple" className="text-[10px] shrink-0">
                            <Tag size={9} className="mr-1" />
                            {item.category}
                          </Badge>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                          <Clock size={12} className="text-accent-teal shrink-0" />
                          {formatTime(item.startTime)} – {formatTime(item.endTime)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
                          <MapPin size={12} className="text-accent-amber shrink-0" />
                          {item.location}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </>
  );
}
