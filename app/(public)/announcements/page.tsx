import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pin, Megaphone, Bell, AlertTriangle, Star, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { PostType } from "@prisma/client";

export const metadata: Metadata = { title: "Announcements" };

export const revalidate = 60;

const typeConfig: Record<PostType, { label: string; variant: "purple" | "teal" | "amber" | "pink" | "red" | "default"; icon: typeof Megaphone }> = {
  ANNOUNCEMENT: { label: "Announcement", variant: "purple", icon: Megaphone },
  PROMO: { label: "Promo", variant: "pink", icon: Sparkles },
  SPEAKER_SPOTLIGHT: { label: "Speaker Spotlight", variant: "teal", icon: Star },
  COUNTDOWN: { label: "Countdown", variant: "amber", icon: Clock },
  UPDATE: { label: "Update", variant: "default", icon: Bell },
  REMINDER: { label: "Reminder", variant: "amber", icon: Bell },
  EMERGENCY: { label: "Emergency", variant: "red", icon: AlertTriangle },
};

export default async function AnnouncementsPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Conference feed with live updates, reactions, and pinned posts."
      />

      <section className="py-16 md:py-24 bg-bg">
        <div className="section-container max-w-3xl">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-surface-1/30 p-12 text-center">
              <Megaphone className="h-12 w-12 text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text-primary">No announcements yet</h3>
              <p className="mt-2 text-text-secondary max-w-md">
                Stay tuned — the organizing committee will share updates, reminders, and spotlights here as the conference approaches.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => {
                const config = typeConfig[post.type];
                const Icon = config.icon;

                return (
                  <Card key={post.id} className={post.pinned ? "border-accent-amber/30 bg-gradient-to-br from-accent-amber/5 to-transparent" : ""}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-text-muted flex-shrink-0" />
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      {post.pinned && (
                        <div className="flex items-center gap-1 text-accent-amber">
                          <Pin size={14} />
                          <span className="text-xs font-medium">Pinned</span>
                        </div>
                      )}
                    </div>

                    {post.title && (
                      <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">
                        {post.title}
                      </h3>
                    )}

                    <p className="mt-2 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-xs text-text-muted bg-surface-2/50 rounded-full px-2 py-0.5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-4 text-xs text-text-muted">
                      {format(new Date(post.createdAt), "MMM d, yyyy · h:mm a")}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
