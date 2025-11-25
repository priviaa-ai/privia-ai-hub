import { GlassCard } from "@/components/monai/GlassCard";
import dashboardPreview from "@/assets/dashboard-preview.png";

export const DashboardPreview = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your AI Reliability Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to monitor AI systems in one place
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <GlassCard className="p-8">
          <div className="relative group">
            {/* Neon gradient glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-accent/40 to-primary/30 rounded-xl blur-xl opacity-60" />
            
            {/* Dashboard composite with glass aesthetic */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-[0_15px_60px_rgba(59,130,246,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-background/10 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-white/[0.02] z-10 pointer-events-none" />
              <img 
                src={dashboardPreview} 
                alt="MonAI Reliability Dashboard Composite"
                className="w-full h-auto"
                style={{ filter: 'blur(5px)' }}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
