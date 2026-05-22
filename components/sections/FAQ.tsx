"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectionVariants } from "@/lib/motion";

const faqs = [
  {
    q: "Who can attend Beyond Borders?",
    a: "The conference is designed for AIESEC Exchange Participants (EPs) and international youth interested in leadership and cultural exchange.",
  },
  {
    q: "How do I attend as a delegate?",
    a: "Delegates do not sign up on this website. Your local entity or the organizing committee will confirm your participation. Contact the OC if you have questions.",
  },
  {
    q: "How do I become a facilitator?",
    a: "Visit the Facilitators page to submit your session proposal, including objectives, duration, and your session plan PDF.",
  },
  {
    q: "What is included for delegates?",
    a: "Access to published sessions, Cultural Night, and conference resources. Details are shared by the OC once your participation is confirmed.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="section-container max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">FAQ</h2>
          <p className="mt-4 text-text-secondary">
            Quick answers before you register.
          </p>
        </motion.div>

        <ul className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={faq.q} className="glass-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "shrink-0 text-text-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                    size={20}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="border-t border-white/10 px-6 pb-4 text-sm text-text-secondary">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
