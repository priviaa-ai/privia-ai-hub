import { GlassCard } from "@/components/monai/GlassCard";
import { TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const FeatureDeepDive = () => {
  const driftRef = useScrollReveal();
  const llmRef = useScrollReveal();

  return (
    <div className="max-w-6xl mx-auto mb-32 space-y-16">
      {/* Detect Drift Early */}
      <motion.div
        ref={driftRef.ref}
        initial={{ opacity: 0, y: 40 }}
        animate={driftRef.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7 }}
      >
        <GlassCard className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Drift Detection</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Detect Drift Early</h2>
              <p className="text-muted-foreground mb-6">
                Catch data and model drift before it impacts your users. Monitor statistical distributions and semantic changes across your ML pipeline.
              </p>
              
              <ul className="space-y-3">
                {[
                  "PSI and KL divergence metrics",
                  "Feature-level drift analysis",
                  "Historical trend comparison",
                  "Automatic drift threshold alerts"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Drift Score</span>
                  <span className="font-mono text-warning">0.73</span>
                </div>
                <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full w-[73%] bg-gradient-to-r from-success via-warning to-destructive rounded-full" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {[
                    { label: "Features", value: "12" },
                    { label: "Drifted", value: "3" },
                    { label: "PSI Avg", value: "0.24" }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-background/30 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                      <div className="text-lg font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  {["feature_A", "feature_B", "feature_C"].map((feature, i) => (
                    <div key={feature} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-muted-foreground">{feature}</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-16 bg-background/50 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full bg-${["success", "warning", "destructive"][i]} rounded-full`}
                            style={{ width: `${[30, 60, 85][i]}%` }}
                          />
                        </div>
                        <span className="font-mono w-12 text-right">{[0.12, 0.45, 0.78][i]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Monitor LLM Behavior */}
      <motion.div
        ref={llmRef.ref}
        initial={{ opacity: 0, y: 40 }}
        animate={llmRef.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7 }}
      >
        <GlassCard className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="glass-card p-6 bg-gradient-to-br from-accent/10 to-primary/10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs text-muted-foreground">Recent Interactions</span>
                    <span className="text-xs font-mono">247 today</span>
                  </div>

                  {[
                    { tone: "Professional", hallucination: 0.02, safety: "Pass" },
                    { tone: "Casual", hallucination: 0.15, safety: "Pass" },
                    { tone: "Professional", hallucination: 0.67, safety: "Flag" }
                  ].map((interaction, i) => (
                    <div key={i} className="bg-background/30 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tone</span>
                        <span className="font-medium">{interaction.tone}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Hallucination</span>
                        <span className={`font-mono ${interaction.hallucination > 0.5 ? 'text-destructive' : 'text-success'}`}>
                          {interaction.hallucination.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Safety</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          interaction.safety === "Pass" ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                        }`}>
                          {interaction.safety}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium">LLM Monitoring</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Monitor LLM Behavior</h2>
              <p className="text-muted-foreground mb-6">
                Track every interaction for quality, safety, and reliability. Identify hallucinations and behavior anomalies in real-time.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Hallucination detection and scoring",
                  "Tone and sentiment analysis",
                  "Safety flag monitoring",
                  "Response quality metrics"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
