import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Camera, Film, ImageIcon, Star } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const media = await prisma.galleryMedia.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const featured = media.filter((m) => m.featured);
  const rest = media.filter((m) => !m.featured);

  const hasData = media.length > 0;

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Photos and videos from Beyond Borders and past AIESEC moments."
      />

      <section className="section-container pb-24 space-y-10">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center">
              <Camera className="text-accent-teal" size={28} />
            </div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Gallery coming soon
            </h2>
            <p className="text-sm text-text-secondary max-w-sm">
              Featured media from delegates and the OC team will appear here after the conference.
            </p>
          </div>
        ) : (
          <>
            {/* Featured strip */}
            {featured.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-accent-amber" fill="currentColor" />
                  <h2 className="font-display text-lg font-bold text-text-primary">Featured</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-accent-amber/30 to-transparent" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* All media */}
            {rest.length > 0 && (
              <div className="space-y-4">
                {featured.length > 0 && (
                  <div className="flex items-center gap-3">
                    <ImageIcon size={15} className="text-text-muted" />
                    <h2 className="font-display text-base font-semibold text-text-secondary">All Media</h2>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-text-muted font-mono">{rest.length} items</span>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {rest.map((item) => (
                    <MediaCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

interface MediaItem {
  id: string;
  url: string;
  type: string;
  caption: string | null;
  featured: boolean;
  createdAt: Date;
}

function MediaCard({ item }: { item: MediaItem }) {
  const isVideo = item.type === "VIDEO";

  return (
    <Card className="glass-card border border-white/10 bg-surface-1/30 overflow-hidden p-0 group">
      {/* Thumbnail / preview area */}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative"
      >
        {!isVideo ? (
          <div className="w-full aspect-video relative">
            <Image
              src={item.url}
              alt={item.caption ?? "Gallery image"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-surface-2/60 flex flex-col items-center justify-center gap-2 border-b border-white/5">
            <Film className="text-accent-purple" size={32} />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Video</span>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {item.featured && (
            <span className="flex items-center gap-1 bg-accent-amber/20 border border-accent-amber/30 rounded-full px-2 py-0.5">
              <Star size={10} className="text-accent-amber" fill="currentColor" />
              <span className="text-[9px] font-semibold text-accent-amber uppercase tracking-wider">Featured</span>
            </span>
          )}
          <Badge
            className={`text-[9px] uppercase tracking-wider border ${
              isVideo
                ? "text-accent-purple bg-accent-purple/10 border-accent-purple/20"
                : "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
            }`}
          >
            {item.type}
          </Badge>
        </div>
      </a>

      {/* Caption */}
      {item.caption && (
        <div className="px-4 py-3">
          <p className="text-xs text-text-secondary leading-relaxed">{item.caption}</p>
        </div>
      )}
    </Card>
  );
}
