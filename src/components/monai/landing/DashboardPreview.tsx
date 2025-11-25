import { GlassCard } from "@/components/monai/GlassCard";
import featureMetricsReal from "@/assets/feature-metrics-real.png";

export const DashboardPreview = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your AI Reliability Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to monitor AI systems in one place
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative group">
          {/* Neon blue-purple glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-[#5b6bff] via-[#a372ff] to-[#5b6bff] rounded-3xl opacity-60 blur-xl" />
          
          {/* Glass-morphism container */}
          <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_20px_60px_-15px_rgba(91,107,255,0.5),0_10px_40px_-10px_rgba(163,114,255,0.3)] backdrop-blur-sm bg-white/[0.05]">
            {/* Frosted glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
            
            {/* Feature Metrics screenshot */}
            <div className="relative p-6 md:p-8 lg:p-12">
              <img 
                src={featureMetricsReal} 
                alt="MonAI feature level drift metrics with PSI, KL divergence, and drift status"
                className="w-full h-auto block rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
