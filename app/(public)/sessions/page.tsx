import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Sessions" };

export const revalidate = 60; // Cache for 60 seconds

export default async function SessionsPage() {
  const sessions = await prisma.session.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { day: "asc" },
      { startTime: "asc" }
    ]
  });

  return (
    <>
      <PageHeader
        title="Sessions"
        description="Explore workshops, keynotes, and activities across the conference."
      />
      
      <section className="py-16 md:py-24 bg-bg">
        <div className="section-container">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-surface-1/30 p-12 text-center">
              <Calendar className="h-12 w-12 text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text-primary">No sessions announced yet</h3>
              <p className="mt-2 text-text-secondary max-w-md">
                We are currently building our exciting agenda. Check back soon for updates on keynotes, workshops, and activities.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <Card key={session.id} className="flex flex-col h-full">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="purple">{session.category.replace(/_/g, " ")}</Badge>
                    <Badge variant="default" className="text-xs">Day {session.day}</Badge>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-text-primary mb-2 line-clamp-2">
                    {session.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary mb-6 flex-grow line-clamp-3">
                    {session.description}
                  </p>
                  
                  <div className="space-y-3 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <Clock size={16} className="text-accent-teal flex-shrink-0" />
                      <span>
                        {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <MapPin size={16} className="text-accent-pink flex-shrink-0" />
                      <span>{session.location}</span>
                    </div>

                    {session.capacity && (
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <Users size={16} className="text-accent-amber flex-shrink-0" />
                        <span>Capacity: {session.capacity} delegates</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
