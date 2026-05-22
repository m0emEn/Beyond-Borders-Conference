import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "purple" | "teal" | "amber";
  className?: string;
}

const variantStyles = {
  default: "bg-surface-2 text-text-secondary",
  purple: "bg-accent-purple/20 text-accent-purple border border-accent-purple/30",
  teal: "bg-accent-teal/20 text-accent-teal border border-accent-teal/30",
  amber: "bg-accent-amber/20 text-accent-amber border border-accent-amber/30",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
