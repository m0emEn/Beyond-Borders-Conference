import { prisma } from "@/lib/prisma";
import { Camera, Film, Image as ImageIcon, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function MediaTrackerPage() {
  const media = await prisma.galleryMedia.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <Badge variant="purple" className="mb-2">Media Operations</Badge>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Content & Media Gallery
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Published conference media — photos, videos, and recap content.
          </p>
        </div>
        <div className="glass-card bg-surface-2/40 px-4 py-2 border border-white/10 rounded-xl text-right">
          <span className="text-[10px] text-text-muted uppercase block font-semibold tracking-widest">Total Items</span>
          <span className="font-mono text-lg font-bold text-accent-purple">{media.length}</span>
        </div>
      </div>

      {media.length === 0 ? (
        <Card className="glass-card border border-white/10 p-12 bg-surface-1/25 flex flex-col items-center justify-center text-center space-y-3">
          <Camera className="text-text-muted" size={36} />
          <p className="text-text-secondary text-sm">No media uploaded yet.</p>
          <p className="text-text-muted text-xs">Gallery items will appear here once uploaded post-conference.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <Card key={item.id} className="glass-card border border-white/10 bg-surface-1/25 overflow-hidden">
              <div className="aspect-video bg-surface-2/40 flex items-center justify-center border-b border-white/5">
                {item.type === "VIDEO" ? (
                  <Film className="text-accent-purple" size={32} />
                ) : (
                  <ImageIcon className="text-accent-teal" size={32} />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={`text-4xs uppercase tracking-widest border ${
                    item.type === "VIDEO"
                      ? "text-accent-purple bg-accent-purple/10 border-accent-purple/20"
                      : "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
                  }`}>
                    {item.type}
                  </Badge>
                  {item.featured && (
                    <Star size={14} className="text-accent-amber" fill="currentColor" />
                  )}
                </div>
                {item.caption && (
                  <p className="text-xs text-text-secondary truncate">{item.caption}</p>
                )}
                <p className="text-[10px] text-text-muted font-mono">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
