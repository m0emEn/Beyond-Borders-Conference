"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { sectionVariants } from "@/lib/motion";

const previewSessions = [
  {
    title: "Leading Across Borders",
    category: "Leadership",
    day: "Day 1",
  },
  {
    title: "Cultural Intelligence Workshop",
    category: "Cultural Exchange",
    day: "Day 2",
  },
  {
    title: "Future-Ready Mindset",
    category: "Personal Development",
    day: "Day 3",
  },
];

export function SessionsPreview() {
  return (
    <section className="py-20 md:py-28 bg-surface-1/50">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Conference Sessions
            </h2>
            <p className="mt-2 max-w-xl text-text-secondary">
              Leadership, culture, reflection, and networking — curated for
              international delegates.
            </p>
          </div>
          <Link
            href="/sessions"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent-purple hover:text-accent-pink"
          >
            View all sessions
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {previewSessions.map((session) => (
            <Card key={session.title}>
              <div className="mb-3 flex items-center gap-2">
                <Mic2 size={18} className="text-accent-teal" />
                <Badge variant="purple">{session.category}</Badge>
              </div>
              <h3 className="font-display text-lg font-semibold">
                {session.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{session.day}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
