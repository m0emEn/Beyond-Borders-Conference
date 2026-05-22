"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Badge } from "@/components/ui/Badge";
import {
  getConferenceDate,
  ORGANIZER,
  SITE_NAME,
  TAGLINE,
} from "@/lib/constants";

export function Hero() {
  const conferenceDate = getConferenceDate();

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-hero opacity-90"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0A0B1E_70%)]"
        aria-hidden
      />

      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-lg opacity-30"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {["🌍", "✨", "🌟", "🎉"][i % 4]}
          </motion.span>
        ))}
      </div>

      <div className="section-container relative z-10 flex flex-col items-center py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="purple" className="mb-6">
            {ORGANIZER} · AIESEC in Tunisia
          </Badge>
        </motion.div>

        <motion.h1
          className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="gradient-text">{SITE_NAME}</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-xl text-lg text-text-secondary sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {TAGLINE}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Countdown targetDate={conferenceDate} />
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button href="/contact" size="lg">
            Contact the OC
          </Button>
          <Button href="/about" variant="glass" size="lg">
            Explore Conference
          </Button>
          <Button href="/facilitators" variant="outline" size="lg">
            Become a Facilitator
          </Button>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-text-muted"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to about section"
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}
