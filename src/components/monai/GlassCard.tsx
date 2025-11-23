import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function GlassCard({ children, hover = false, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl",
        hover && "transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:bg-white/[0.07]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
