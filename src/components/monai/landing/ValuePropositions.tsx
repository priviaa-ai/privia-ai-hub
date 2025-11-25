import { TrendingUp, Sparkles, Bell, Network } from "lucide-react";
import { GlassCard } from "@/components/monai/GlassCard";
import realDriftChart from "@/assets/real-drift-chart.png";
import realFeatureTable from "@/assets/real-feature-table.png";
import realDemoProject from "@/assets/real-demo-project.png";
import cropFeatureTable from "@/assets/crop-feature-table.png";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: TrendingUp,
    title: "Drift Detection",
    description: "Monitor statistical and semantic drift using PSI, KL divergence, and embedding changes.",
    color: "primary",
    image: realDriftChart,
  },
  {
    icon: Sparkles,
    title: "LLM Behavior Monitoring",
    description: "Track hallucinations, tone shifts, safety violations, and reasoning anomalies.",
    color: "accent",
    image: realFeatureTable,
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get notified instantly when reliability issues emerge via Slack, email, or webhooks.",
    color: "warning",
    image: realDemoProject,
  },
  {
    icon: Network,
    title: "Embedding Drift",
    description: "Detect semantic shifts in embedding clusters and vector distributions.",
    color: "success",
    image: cropFeatureTable,
  }
];

export const ValuePropositions = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className="max-w-6xl mx-auto mb-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 px-4"
      >
        <h2 className="heading-spacing">Complete AI Observability</h2>
        <p className="text-description max-w-[780px] mx-auto">
          Monitor every aspect of your ML and LLM systems
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard hover className="p-6 text-center group">
                <div className={`w-12 h-12 rounded-full bg-${feature.color}/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-sm font-medium text-muted-foreground/80 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Mini visual preview with glass styling */}
                <div className="mt-4 rounded-lg overflow-hidden border border-white/20 relative group-hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-10 pointer-events-none" />
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
