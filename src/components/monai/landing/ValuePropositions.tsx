import { TrendingUp, Sparkles, Bell, Network } from "lucide-react";
import { GlassCard } from "@/components/monai/GlassCard";
import miniDriftChart from "@/assets/mini-drift-chart.png";
import miniLlmSparkline from "@/assets/mini-llm-sparkline.png";
import miniAlerts from "@/assets/mini-alerts.png";
import miniEmbeddings from "@/assets/mini-embeddings.png";

const features = [
  {
    icon: TrendingUp,
    title: "Drift Detection",
    description: "Monitor statistical and semantic drift using PSI, KL divergence, and embedding changes.",
    color: "primary",
    image: miniDriftChart,
  },
  {
    icon: Sparkles,
    title: "LLM Behavior Monitoring",
    description: "Track hallucinations, tone shifts, safety violations, and reasoning anomalies.",
    color: "accent",
    image: miniLlmSparkline,
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get notified instantly when reliability issues emerge via Slack, email, or webhooks.",
    color: "warning",
    image: miniAlerts,
  },
  {
    icon: Network,
    title: "Embedding Drift",
    description: "Detect semantic shifts in embedding clusters and vector distributions.",
    color: "success",
    image: miniEmbeddings,
  }
];

export const ValuePropositions = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Complete AI Observability</h2>
        <p className="text-xl text-muted-foreground">
          Monitor every aspect of your ML and LLM systems
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <GlassCard key={feature.title} hover className="p-6 text-center group">
              <div className={`w-12 h-12 rounded-full bg-${feature.color}/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>
              
              {/* Mini visual preview */}
              <div className="mt-4 rounded-lg overflow-hidden border border-white/5">
                <img 
                  src={feature.image} 
                  alt={`${feature.title} visualization`}
                  className="w-full h-auto"
                />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
