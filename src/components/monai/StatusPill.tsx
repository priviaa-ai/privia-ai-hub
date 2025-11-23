import { cn } from "@/lib/utils";

type StatusVariant = "healthy" | "attention" | "critical" | "info" | "safe";

interface StatusPillProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  healthy: "bg-success/10 text-success border-success/20 shadow-lg shadow-success/10",
  attention: "bg-warning/10 text-warning border-warning/20 shadow-lg shadow-warning/10",
  critical: "bg-destructive/10 text-destructive border-destructive/20 shadow-lg shadow-destructive/10",
  info: "bg-info/10 text-info border-info/20 shadow-lg shadow-info/10",
  safe: "bg-success/10 text-success border-success/20 shadow-lg shadow-success/10",
};

export function StatusPill({ variant, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
