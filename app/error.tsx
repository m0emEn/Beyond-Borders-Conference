"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070814] p-4 font-sans text-white">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mb-4">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display tracking-tight text-white">Something went wrong</h2>
          <p className="text-sm text-gray-400">
            An unexpected error occurred in the application. Our team has been notified.
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <Button onClick={() => reset()} className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <RefreshCw size={16} />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
