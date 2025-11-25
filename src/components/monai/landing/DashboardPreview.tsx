import { GlassCard } from "@/components/monai/GlassCard";
import { TrendingUp, AlertCircle, CheckCircle2, Activity } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your AI Reliability Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to monitor AI systems in one place
        </p>
      </div>

      <GlassCard className="p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-50" />
        
        <div className="relative z-10 space-y-6">
          {/* Reliability Score */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">System Reliability Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                  94.2
                </span>
                <span className="text-sm text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +2.1%
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              {[
                { label: "Uptime", value: "99.9%", icon: Activity },
                { label: "Events", value: "1.2M", icon: CheckCircle2 }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass-card p-4 text-center min-w-[100px]">
                    <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drift Trend */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-4">Drift Trend (7 days)</h3>
              <div className="glass-card p-4 bg-background/20">
                <div className="flex items-end justify-between h-32 gap-2">
                  {[0.12, 0.18, 0.15, 0.22, 0.19, 0.28, 0.24].map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t"
                        style={{ height: `${value * 400}px` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-4">Recent Alerts</h3>
              <div className="space-y-2">
                {[
                  { type: "warning", message: "Drift threshold exceeded", time: "2m ago" },
                  { type: "info", message: "New dataset uploaded", time: "1h ago" },
                  { type: "error", message: "High hallucination rate detected", time: "3h ago" }
                ].map((alert, i) => (
                  <div key={i} className="glass-card p-3 flex items-start gap-3">
                    <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      alert.type === 'error' ? 'text-destructive' : 
                      alert.type === 'warning' ? 'text-warning' : 'text-info'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
