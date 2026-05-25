import Link from "next/link";
import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="glass-card border border-white/10 bg-surface-1/25 p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
          <Compass size={24} />
        </div>

        <Badge variant="purple" className="mx-auto">404 — Not Found</Badge>

        <h2 className="font-display font-semibold text-text-primary text-base">
          Page not found
        </h2>

        <p className="text-xs text-text-secondary leading-relaxed">
          The admin route you requested does not exist or has been moved.
        </p>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 mx-auto px-4 py-2.5 rounded-xl bg-gradient-cta text-white text-xs font-semibold shadow-glow-purple/30 transition hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </Card>
    </div>
  );
}
