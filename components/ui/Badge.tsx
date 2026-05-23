import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "purple" | "teal" | "amber" | "pink" | "red";
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-surface-2 text-text-secondary border-white/10",
  purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  teal: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  pink: "bg-accent-pink/10 text-accent-pink border-accent-pink/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function Badge({
  children,
  variant = "default",
  className,
  ...props
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
