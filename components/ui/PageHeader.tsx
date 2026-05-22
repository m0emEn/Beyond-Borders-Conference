"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "@/lib/motion";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.header
      className="section-container py-16 pt-28 text-center md:py-20 md:pt-32"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <h1 className="font-display text-4xl font-bold md:text-5xl gradient-text">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          {description}
        </p>
      )}
    </motion.header>
  );
}
