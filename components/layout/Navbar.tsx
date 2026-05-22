"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-card border-b border-white/10 py-3" : "bg-transparent py-5"
      )}
    >
      <nav className="section-container flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight sm:text-xl"
        >
          <span className="gradient-text">{SITE_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary",
                    active && "text-text-primary"
                  )}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-cta"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/register" size="sm">
            Register Now
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-text-primary lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-bg/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-6">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    className="font-display text-2xl text-text-primary"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
                className="mt-4"
              >
                <Button href="/register">Register Now</Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
