"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sectionVariants } from "@/lib/motion";

export function FacilitatorsPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="glass-card overflow-hidden bg-gradient-card p-8 md:p-12"
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Share Your Session
            </h2>
            <p className="mt-4 text-text-secondary">
              EPs and alumni can apply to facilitate workshops at Beyond Borders.
              Submit your session plan and join the facilitator community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/facilitators">Apply to Facilitate</Button>
              <Link
                href="/facilitators"
                className="inline-flex items-center gap-2 self-center text-sm text-text-secondary hover:text-text-primary"
              >
                Learn more
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
