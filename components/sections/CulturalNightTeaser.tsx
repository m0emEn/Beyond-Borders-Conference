"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sectionVariants } from "@/lib/motion";

export function CulturalNightTeaser() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="absolute inset-0 bg-gradient-to-br from-accent-teal/20 via-transparent to-accent-purple/20"
        aria-hidden
      />
      <div className="section-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-teal/20">
            <MapPin className="text-accent-teal" size={28} />
          </div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            One Global Night
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Explore an interactive world map, country booths, music, food, and
            stories from delegates around the globe.
          </p>
          <Button href="/cultural-night" className="mt-8">
            Explore Cultural Night
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
