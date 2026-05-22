export const SITE_NAME = "Beyond Borders Conference";
export const ORGANIZER = "AIESEC in Bizerte";
export const TAGLINE = "Leadership. Culture. Growth. Without limits.";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/agenda", label: "Agenda" },
  { href: "/sessions", label: "Sessions" },
  { href: "/facilitators", label: "Facilitators" },
  { href: "/cultural-night", label: "Cultural Night" },
  { href: "/announcements", label: "Announcements" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export function getConferenceDate(): Date {
  return new Date(
    process.env.NEXT_PUBLIC_CONFERENCE_DATE ?? "2026-07-15T09:00:00+01:00"
  );
}

/** Delegates do not create accounts on this site; attendance is coordinated by the OC. */
export const DELEGATE_INFO =
  "Delegates are invited through AIESEC — no online account or self-registration is required.";
