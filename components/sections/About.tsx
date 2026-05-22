"use client";

import { motion } from "framer-motion";
import { Globe2, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { containerVariants, itemVariants, sectionVariants } from "@/lib/motion";
import { ORGANIZER } from "@/lib/constants";

const pillars = [
  {
    icon: Users,
    title: "Leadership",
    description:
      "Workshops and keynotes designed to unlock your potential as a global leader.",
  },
  {
    icon: Globe2,
    title: "Cultural Exchange",
    description:
      "Connect with EPs from around the world and celebrate diversity at Cultural Night.",
  },
  {
    icon: Sparkles,
    title: "Personal Growth",
    description:
      "Reflection sessions, networking, and experiences that stay with you beyond the conference.",
  },
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            About the Conference
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            {ORGANIZER} presents the first Beyond Borders Conference — a premium
            summer gathering for AIESEC Exchange Participants ready to learn,
            connect, and grow without limits.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          {pillars.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={itemVariants}>
              <Card className="h-full text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-purple/20">
                  <Icon className="text-accent-purple" size={28} />
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
