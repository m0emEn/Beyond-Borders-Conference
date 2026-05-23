"use client";

import { useState } from "react";
import { Pin, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Post, PostType, PostStatus } from "@prisma/client";
import { createAnnouncement, toggleAnnouncement } from "@/app/actions/announcements";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface AnnouncementsClientProps {
  initialPosts: Post[];
}

export default function AnnouncementsClient({ initialPosts }: AnnouncementsClientProps) {
  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("ANNOUNCEMENT");
  const [pinned, setPinned] = useState(false);

  const { execute: executeToggle } = useAction(toggleAnnouncement, {
    onError: (err) => toast.error(err.error?.serverError || "Failed to update announcement"),
  });

  const { execute: executeCreate, status: createStatus } = useAction(createAnnouncement, {
    onSuccess: () => {
      toast.success("Announcement published successfully");
      setTitle("");
      setContent("");
      setPinned(false);
    },
    onError: (err) => toast.error(err.error?.serverError || "Failed to publish announcement"),
  });

  const handlePublish = (id: string) => {
    executeToggle({ id, status: "PUBLISHED" });
  };

  const handlePinToggle = (id: string, currentPinned: boolean) => {
    executeToggle({ id, pinned: !currentPinned });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    executeCreate({
      title: title.trim(),
      content: content.trim(),
      type,
      pinned,
      status: "PUBLISHED",
    });
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">
            CMS Publisher
          </Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Announcements & Updates CMS
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Dispatch urgent updates, schedule speaker countdown promotions, and pin core reminders.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* PUBLISHER COMPOSER FORM */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 h-fit space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Composer</h3>
            <p className="text-xs text-text-muted">Draft and dispatch updates to public timeline feeds.</p>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Announcement Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Day 2 shuttle adjustments"
                className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary font-medium">Alert Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PostType)}
                  className="bg-surface-2 text-text-primary text-xs px-2.5 py-2.5 outline-none border border-white/10 rounded-xl cursor-pointer"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="REMINDER">Reminder</option>
                  <option value="UPDATE">Update</option>
                  <option value="PROMO">Promo</option>
                  <option value="SPEAKER_SPOTLIGHT">Speaker Spotlight</option>
                  <option value="COUNTDOWN">Countdown</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5 select-none">
                <input
                  type="checkbox"
                  id="pin"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="h-4 w-4 bg-surface-2 accent-accent-purple border-white/10 rounded cursor-pointer"
                />
                <label htmlFor="pin" className="text-xs text-text-secondary font-medium cursor-pointer">
                  Pin to Top
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium">Content Details</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full announcement content..."
                className="w-full glass-card bg-white/5 outline-none border border-white/10 focus:border-accent-purple/60 px-4 py-2.5 rounded-xl text-xs resize-none leading-relaxed"
                required
              />
            </div>

            <Button type="submit" disabled={createStatus === "executing"} className="w-full justify-center gap-2 h-10 mt-2">
              <PlusCircle size={16} />
              {createStatus === "executing" ? "Publishing..." : "Publish Announcement"}
            </Button>
          </form>
        </Card>

        {/* FEED MANAGER STREAM */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 lg:col-span-2 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-text-primary text-base">Published Streams</h3>
            <p className="text-xs text-text-muted">Chronological feed of active and pending timeline updates.</p>
          </div>

          <div className="space-y-3">
            {initialPosts.length === 0 && (
              <div className="text-center text-text-muted text-xs p-4">No announcements published yet.</div>
            )}
            {initialPosts.map((p) => (
              <div key={p.id} className="p-4 bg-surface-2/20 border border-white/5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={p.type === "EMERGENCY" ? "pink" : "purple"} className="uppercase text-4xs font-bold tracking-widest border border-white/5">
                      {p.type.replace("_", " ")}
                    </Badge>
                    <Badge className={`text-4xs uppercase tracking-widest border ${p.status === "PUBLISHED" ? "text-accent-teal bg-accent-teal/10 border-accent-teal/20" : "text-text-muted bg-white/5 border-white/10"}`}>
                      {p.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handlePinToggle(p.id, p.pinned)}
                      className={`p-1.5 rounded-lg border transition ${p.pinned ? "text-accent-amber border-accent-amber/30 bg-accent-amber/10" : "text-text-muted border-white/5 hover:bg-white/5"}`}
                      title={p.pinned ? "Unpin post" : "Pin post to top"}
                    >
                      <Pin size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-text-primary text-sm">{p.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{p.content}</p>
                </div>

                <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-4xs font-mono uppercase text-text-muted">
                  <span>Logged: {new Date(p.createdAt).toLocaleDateString()}</span>
                  {p.status === "DRAFT" && (
                    <button
                      onClick={() => handlePublish(p.id)}
                      className="text-accent-teal hover:underline font-semibold"
                    >
                      Commit Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
