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
        <div className="relative">
          {/* Subtle outer glow - whisper-light neon */}
          <div 
            className="absolute -inset-[30px] md:-inset-[40px] rounded-[32px] opacity-[0.35] md:opacity-[0.4]"
            style={{
              background: 'radial-gradient(circle at center, rgba(120, 70, 255, 0.55), rgba(0, 150, 255, 0.45))',
              filter: 'blur(60px)'
            }}
          />
          
          {/* Glass-morphism container */}
          <div className="relative rounded-[20px] overflow-hidden border border-white/[0.15] backdrop-blur-sm bg-white/[0.05] shadow-[0_0_60px_rgba(120,70,255,0.3),0_0_80px_rgba(0,150,255,0.25)]">
            {/* Frosted glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none" />
            
            {/* Feature Metrics screenshot */}
            <div className="relative p-8 md:p-10 lg:p-12">
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
