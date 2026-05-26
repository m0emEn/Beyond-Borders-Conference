"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Film, Image as ImageIcon, Star, Trash2, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { createGalleryMedia, deleteGalleryMedia, toggleFeaturedMedia } from "@/app/actions/media";
import type { GalleryMedia } from "@prisma/client";

export default function MediaClient({ initialMedia }: { initialMedia: GalleryMedia[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [caption, setCaption] = useState("");

  const { execute: executeCreate } = useAction(createGalleryMedia, {
    onSuccess: (res) => {
      toast.success("Media uploaded successfully");
      if (res.data?.media) {
        setMedia(prev => [res.data!.media, ...prev]);
        setCaption("");
      }
    },
    onError: (err) => toast.error(err.error?.serverError || "Upload failed"),
  });

  const { execute: executeDelete } = useAction(deleteGalleryMedia, {
    onSuccess: ({ input: { id } }) => {
      toast.success("Media deleted");
      setMedia(prev => prev.filter(m => m.id !== id));
    },
    onError: (err) => toast.error(err.error?.serverError || "Delete failed"),
  });

  const { execute: executeToggle } = useAction(toggleFeaturedMedia, {
    onSuccess: (res) => {
      toast.success("Featured status updated");
      if (res.data?.media) {
        setMedia(prev => prev.map(m => m.id === res.data!.media.id ? res.data!.media : m));
      }
    },
    onError: (err) => toast.error(err.error?.serverError || "Update failed"),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media?")) {
      executeDelete({ id });
    }
  };

  const handleToggle = (id: string, currentFeatured: boolean) => {
    executeToggle({ id, featured: !currentFeatured });
  };

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form */}
        <Card className="glass-card border border-white/10 p-6 bg-surface-1/25 h-fit space-y-4 lg:col-span-1">
          <h3 className="font-display font-semibold text-text-primary text-base border-b border-white/5 pb-3">
            Upload New Media
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary font-medium text-xs">Caption (Optional)</label>
              <textarea 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                rows={2} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none resize-none" 
                placeholder="Enter a description..."
              />
            </div>
            
            <UploadDropzone
              endpoint="galleryMedia"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  executeCreate({
                    url: res[0].url,
                    type: res[0].serverData.type as "IMAGE" | "VIDEO",
                    caption: caption || undefined,
                  });
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              className="ut-label:text-text-primary ut-button:bg-accent-purple hover:ut-button:bg-accent-purple/90 border border-white/10 glass-card p-4 rounded-xl"
            />
          </div>
        </Card>

        {/* Media Grid */}
        <div className="lg:col-span-2">
          {media.length === 0 ? (
            <Card className="glass-card border border-white/10 p-12 bg-surface-1/25 flex flex-col items-center justify-center text-center space-y-3">
              <Camera className="text-text-muted" size={36} />
              <p className="text-text-secondary text-sm">No media uploaded yet.</p>
              <p className="text-text-muted text-xs">Upload images or videos to display them in the public gallery.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {media.map((item) => (
                <Card key={item.id} className="glass-card border border-white/10 bg-surface-1/25 overflow-hidden p-0 flex flex-col group relative">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="aspect-video bg-surface-2/40 flex items-center justify-center border-b border-white/5 overflow-hidden">
                    {item.type === "VIDEO" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500">
                        <Film className="text-accent-purple" size={32} />
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Video</span>
                      </div>
                    ) : (
                      <Image src={item.url} alt={item.caption || "Gallery item"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </a>
                  <div className="p-4 flex-1 flex flex-col space-y-3 justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-4xs uppercase tracking-widest border ${
                          item.type === "VIDEO"
                            ? "text-accent-purple bg-accent-purple/10 border-accent-purple/20"
                            : "text-accent-teal bg-accent-teal/10 border-accent-teal/20"
                        }`}>
                          {item.type}
                        </Badge>
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {item.caption ? (
                        <p className="text-xs text-text-secondary line-clamp-2">{item.caption}</p>
                      ) : (
                        <p className="text-xs text-text-muted italic">No caption</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                      <Button
                        onClick={() => handleToggle(item.id, item.featured)}
                        size="xs"
                        variant={item.featured ? "glass" : "outline"}
                        className={`flex items-center gap-1.5 ${item.featured ? "text-accent-amber border-accent-amber/30 bg-accent-amber/10" : "text-text-secondary"}`}
                      >
                        <Star size={12} fill={item.featured ? "currentColor" : "none"} />
                        {item.featured ? "Featured" : "Feature"}
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="xs"
                        variant="outline"
                        className="flex items-center gap-1.5 text-red-400 hover:bg-red-500/10 border-red-500/20"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
