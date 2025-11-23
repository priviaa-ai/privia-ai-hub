import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, hover = false, glow = false, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl",
        hover && "glass-card-hover cursor-pointer",
        glow && "relative",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
