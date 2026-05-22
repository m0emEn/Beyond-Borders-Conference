import { Button } from "@/components/ui/Button";

interface ComingSoonProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function ComingSoon({
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Back to home",
}: ComingSoonProps) {
  return (
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-3xl font-bold gradient-text md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-lg text-text-secondary">{description}</p>
      <Button href={ctaHref} className="mt-8" variant="glass">
        {ctaLabel}
      </Button>
    </div>
  );
}
