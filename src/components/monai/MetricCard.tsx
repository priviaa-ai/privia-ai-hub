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
    <GlassCard hover className={cn("p-6", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          {badge && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          
          {trend && trendValue && trendValue !== "" && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && <TrendingUp className="h-4 w-4" />}
              {trend === "down" && <TrendingDown className="h-4 w-4" />}
              {trend === "neutral" && <Minus className="h-4 w-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
