"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Clock,
  Compass,
  Trophy,
  Flag,
  Music,
  Heart,
  Gamepad2,
  Users2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  containerVariants,
  itemVariants,
  sectionVariants,
} from "@/lib/motion";

const challengePillars = [
  {
    icon: Compass,
    title: "Creativity Under Constraints",
    description:
      "Forget massive technical setups. Each delegation gets a uniform package of simple materials: flipcharts, markers, paper, tape, and scissors. It is a raw test of resourcefulness and creativity.",
  },
  {
    icon: Users2,
    title: "Intense Collaboration",
    description:
      "Delegates from the same country or cultural region work together under a tight clock, combining their ideas, skills, and energy to build a physical booth space that tells their unique story.",
  },
  {
    icon: Trophy,
    title: "Friendly Competition",
    description:
      "A panel of judges and fellow conference delegates will evaluate each booth based on creativity, immersive engagement, and cultural energy, culminating in a celebration of global connection.",
  },
];

const boothInspirations = [
  {
    category: "Storytelling & Legends",
    icon: Compass,
    title: "Tales of the Homeland",
    description:
      "Step into candle-lit setups where delegates narrate rich local folklore, myths, and histories in interactive, intimate circle sessions.",
  },
  {
    category: "Rhythm & Expression",
    icon: Music,
    title: "Living Dance & Sound",
    description:
      "A dynamic area where traditional acoustics, folk dances, and local beats invite the entire crowd to join in and learn the steps.",
  },
  {
    category: "Traditions & Attire",
    icon: Flag,
    title: "Garments of Pride",
    description:
      "Vibrant exhibitions showcasing regional clothing, where delegates share the history, patterns, and craftsmanship of their traditional attire.",
  },
  {
    category: "Interactive Gaming",
    icon: Gamepad2,
    title: "Traditional Playgrounds",
    description:
      "Immerse yourself in active mini-challenges, traditional board games, and historic pastimes that delegates play back home.",
  },
];

const timelineSteps = [
  {
    time: "Phase 1: Assemble & Construct",
    duration: "60 Minutes",
    description:
      "The resource chests are unboxed. Teams receive their core materials and immediately coordinate. Construction, drawing, cutting, and tape-work commence to build the structure of their country booth.",
  },
  {
    time: "Phase 2: Open the Gates",
    duration: "120 Minutes",
    description:
      "The Global Night is declared open! Delegates tour the hall, engaging in audience games, tasting authentic bites, listening to live legends, and immersing themselves in competitive cultural presentations.",
  },
  {
    time: "Phase 3: The Vote & Celebration",
    duration: "30 Minutes",
    description:
      "Judges complete their rounds and delegates submit their secret ballots. We crown the most creative and immersive country booth, followed by a unified global celebration.",
  },
];

export default function CulturalNightPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Premium Hero Section */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden pt-28 pb-16 text-center">
        <div
          className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-accent-teal/20"
          aria-hidden
        />
        <div className="section-container relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="purple" className="mb-4">
              Signature Event · Day 2
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            One Global Night
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A high-energy cultural challenge. No digital monitors or advanced screens. Just pure teamwork, limited materials, and a challenge to create the most immersive cultural experience on Earth.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button href="/register" size="md">
              Register to Represent Your Country
            </Button>
            <Button href="/about" variant="glass" size="md">
              Discover Agenda
            </Button>
          </motion.div>
        </div>
      </section>

      {/* The Core Concept / Pillars */}
      <section className="py-16 md:py-24 bg-surface-1/30">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              The Creativity & Collaboration Challenge
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              Inspired by the traditional Global Village, transformed into a cooperative creation challenge. EPs work together under resource constraints to represent their country.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 grid gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
          >
            {challengePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <motion.div key={pillar.title} variants={itemVariants}>
                  <Card className="h-full">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/10">
                      <Icon className="text-accent-purple" size={24} />
                    </div>
                    <h3 className="font-display text-lg font-semibold">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {pillar.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Timeline of the Night */}
      <section className="py-16 md:py-24">
        <div className="section-container max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              The Night&apos;s Timeline
            </h2>
            <p className="mt-4 text-text-secondary">
              Three phases to construct, showcase, and celebrate intercultural connection.
            </p>
          </motion.div>

          <div className="mt-12 relative border-l border-white/10 ml-4 md:ml-6 space-y-8">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative pl-8 md:pl-10"
              >
                <div className="absolute left-[-9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-teal ring-4 ring-bg" />
                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {step.time}
                    </h3>
                    <Badge variant="teal">{step.duration}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Booth Concepts */}
      <section className="py-16 md:py-24 bg-surface-1/30">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Booth Concept Mockups
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              How delegates manifest their culture. We focus on active participation rather than passive viewing.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {boothInspirations.map((booth) => {
              const Icon = booth.icon;
              return (
                <motion.div key={booth.title} variants={itemVariants}>
                  <Card className="h-full flex flex-col justify-between">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent-teal/10">
                        <Icon className="text-accent-teal" size={20} />
                      </div>
                      <Badge variant="default" className="mb-2">
                        {booth.category}
                      </Badge>
                      <h3 className="font-display text-base font-semibold mt-1">
                        {booth.title}
                      </h3>
                      <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                        {booth.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Constraints Callout Card */}
      <section className="py-16 md:py-20">
        <div className="section-container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-hidden bg-gradient-card p-8 md:p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-amber/20">
              <AlertTriangle className="text-accent-amber" size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              The Rules of Engagement
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary leading-relaxed">
              No digital displays, screens, or complex projections are permitted. Slides or presentations are banned.
              The goal is to captivate and immerse delegates through physical craft, local storytelling, authentic games,
              live music, dances, and audience connection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Call to Action */}
      <section className="py-16 md:py-24 bg-surface-1/40">
        <div className="section-container text-center max-w-2xl">
          <h2 className="font-display text-3xl font-bold">
            Represent Your Culture
          </h2>
          <p className="mt-4 text-text-secondary">
            Join international Exchange Participants at the summer&apos;s premier gathering. Connect, create, and share your home with the world.
          </p>
          <Button href="/register" size="lg" className="mt-8">
            Register Now
          </Button>
        </div>
      </section>
    </div>
  );
}
