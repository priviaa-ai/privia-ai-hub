import { GlassCard } from "@/components/monai/GlassCard";
import realDriftChart from "@/assets/real-drift-chart.png";
import realFeatureTable from "@/assets/real-feature-table.png";
import realDemoProject from "@/assets/real-demo-project.png";
import cropFeatureTable from "@/assets/crop-feature-table.png";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  DriftDetectionIcon,
  LLMBehaviorIcon,
  RealTimeAlertsIcon,
  EmbeddingDriftIcon,
} from "@/components/monai/icons/FeatureIcons";

const features = [
  {
    Icon: DriftDetectionIcon,
    title: "Drift Detection",
    description: "Monitor statistical and semantic drift using PSI, KL divergence, and embedding changes.",
    image: realDriftChart,
  },
  {
    Icon: LLMBehaviorIcon,
    title: "LLM Behavior Monitoring",
    description: "Track hallucinations, tone shifts, safety violations, and reasoning anomalies.",
    image: realFeatureTable,
  },
  {
    Icon: RealTimeAlertsIcon,
    title: "Real-Time Alerts",
    description: "Get notified instantly when reliability issues emerge via Slack, email, or webhooks.",
    image: realDemoProject,
  },
  {
    Icon: EmbeddingDriftIcon,
    title: "Embedding Drift",
    description: "Detect semantic shifts in embedding clusters and vector distributions.",
    image: cropFeatureTable,
  }
];

export const ValuePropositions = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className="max-w-6xl mx-auto mb-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-12 px-4"
      >
        <h2 className="heading-spacing">Complete AI Observability</h2>
        <p className="text-description max-w-[780px] mx-auto">
          Monitor every aspect of your ML and LLM systems
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.Icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
            >
              <GlassCard hover className="p-6 text-center group">
                {/* Premium glassmorphism icon container */}
                <div className="flex items-center justify-center mb-5">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(79,103,255,0.25)]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Icon 
                      size={28} 
                      className="text-white/[0.85] transition-colors duration-300" 
                    />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-sm font-medium text-muted-foreground/80 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Mini visual preview with glass styling */}
                <div className="mt-4 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-white/20 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent z-10 pointer-events-none" />
                  <img 
                    src={feature.image} 
                    alt={`${feature.title} visualization`}
                    className="w-full h-auto"
                  />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
