import Link from "next/link";
import { NAV_LINKS, ORGANIZER, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-surface-1">
      <div className="section-container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold gradient-text">
              {SITE_NAME}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Organized by {ORGANIZER}
            </p>
            <p className="mt-4 text-sm text-text-muted">
              Premium international youth conference — leadership, cultural
              exchange, and personal growth.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {NAV_LINKS.slice(0, 8).map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-text-muted transition-colors hover:text-text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Get involved
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/facilitators"
                  className="text-text-muted hover:text-text-primary"
                >
                  Become a facilitator
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-muted hover:text-text-primary"
                >
                  Contact the OC
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-text-muted sm:flex-row">
          <p>© {year} {ORGANIZER}. All rights reserved.</p>
          <p>AIESEC in Tunisia</p>
        </div>
      </div>
    </footer>
  );
}
