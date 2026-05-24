"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

function TimeUnit({ value, label }: { value: number | string; label: string }) {
  const displayValue = typeof value === "number" ? String(value).padStart(2, "0") : value;
  
  return (
    <div className="flex flex-col items-center">
      <div className="glass-card flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="font-mono text-2xl font-bold sm:text-3xl"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { days, hours, minutes, seconds, isComplete } =
    useCountdown(targetDate);

  if (!isMounted) {
    return (
      <div
        className={cn("flex flex-wrap justify-center gap-4 sm:gap-6", className)}
        role="timer"
        aria-live="polite"
      >
        <TimeUnit value="--" label="Days" />
        <TimeUnit value="--" label="Hours" />
        <TimeUnit value="--" label="Minutes" />
        <TimeUnit value="--" label="Seconds" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <p className={cn("text-lg text-text-secondary", className)}>
        The conference has begun!
      </p>
    );
  }

  return (
    <div
      className={cn("flex flex-wrap justify-center gap-4 sm:gap-6", className)}
      role="timer"
      aria-live="polite"
    >
      <TimeUnit value={days} label="Days" />
      <TimeUnit value={hours} label="Hours" />
      <TimeUnit value={minutes} label="Minutes" />
      <TimeUnit value={seconds} label="Seconds" />
    </div>
  );
}

