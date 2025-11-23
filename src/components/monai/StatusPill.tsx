import { cn } from "@/lib/utils";

type StatusVariant = "healthy" | "attention" | "critical" | "info";

interface StatusPillProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  healthy: "bg-success/20 text-success border-success/30",
  attention: "bg-warning/20 text-warning border-warning/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  info: "bg-info/20 text-info border-info/30",
};

export function StatusPill({ variant, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
