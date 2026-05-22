"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { sectionVariants } from "@/lib/motion";

export function FeedPreview() {
  return (
    <section className="py-20 md:py-28 bg-surface-1/50">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Conference Feed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Live announcements, speaker spotlights, and updates — stay in the
            loop before and during the conference.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <div className="flex items-start justify-between gap-4">
              <Badge variant="purple">Announcement</Badge>
              <Pin size={16} className="text-accent-amber shrink-0" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">
              Welcome to Beyond Borders
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Follow the feed for updates, speaker spotlights, and conference
              reminders.
            </p>
            <Link
              href="/announcements"
              className="mt-4 inline-block text-sm font-medium text-accent-purple hover:text-accent-pink"
            >
              View all announcements →
            </Link>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
