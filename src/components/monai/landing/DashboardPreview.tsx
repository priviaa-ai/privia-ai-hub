import { GlassCard } from "@/components/monai/GlassCard";
import cropFeatureTable from "@/assets/crop-feature-table.png";

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
        <GlassCard className="p-8 group hover:scale-[1.02] transition-transform duration-300">
          <div className="relative">
            {/* Neon gradient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(237,100%,68%)] via-[hsl(270,60%,65%)] to-[hsl(237,100%,68%)] rounded-xl opacity-50 blur-lg" />
            
            {/* Dashboard crop with glass aesthetic */}
            <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-[0_15px_60px_rgba(91,107,255,0.3)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-background/5 via-transparent to-background/5 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-white/[0.02] z-10 pointer-events-none" />
              <img 
                src={cropFeatureTable} 
                alt="MonAI Feature Metrics Table"
                className="w-full h-auto"
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
