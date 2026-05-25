"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log to monitoring in production; suppress raw console.log
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[AdminError]", error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="glass-card border border-red-500/25 bg-red-500/5 p-8 max-w-md w-full text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertTriangle size={24} />
        </div>

        <Badge variant="red" className="mx-auto">Runtime Error</Badge>

        <h2 className="font-display font-semibold text-text-primary text-base">
          Something went wrong
        </h2>

        <p className="text-xs text-text-secondary leading-relaxed">
          {error.message || "An unexpected error occurred in this section."}
        </p>

        {error.digest && (
          <p className="text-[10px] font-mono text-text-muted bg-surface-2/40 border border-white/5 rounded-lg px-3 py-1.5">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 mx-auto px-4 py-2.5 rounded-xl bg-surface-2 border border-white/10 hover:border-white/20 text-xs font-semibold text-text-primary transition"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      </Card>
    </div>
  );
}
