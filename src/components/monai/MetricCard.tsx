import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  badge?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function MetricCard({ label, value, badge, trend, trendValue, className }: MetricCardProps) {
  return (
    <GlassCard hover className={cn("p-6 group", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {badge && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-semibold border border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/10">
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-medium bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </span>
          
          {trend && trendValue && trendValue !== "" && (
            <div className={cn(
              "flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm",
              trend === "up" && "text-success bg-success/10 border border-success/20",
              trend === "down" && "text-destructive bg-destructive/10 border border-destructive/20",
              trend === "neutral" && "text-muted-foreground bg-white/5 border border-white/10"
            )}>
              {trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
              {trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
              {trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
