import { GlassCard } from "@/components/monai/GlassCard";
import { Plug, Upload, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    icon: Plug,
    title: "Connect your project",
    description: "Integrate MonAI with your ML or LLM application in minutes using our SDK or API.",
  },
  {
    icon: Upload,
    title: "Ingest datasets or LLM events",
    description: "Stream your production data, embeddings, and LLM interactions to MonAI.",
  },
  {
    icon: BarChart3,
    title: "Monitor drift and behavior in real-time",
    description: "Get instant insights and alerts when reliability issues emerge in production.",
  }
];

export const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className="max-w-6xl mx-auto mb-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How MonAI Works</h2>
        <p className="text-xl text-muted-foreground">
          Start monitoring in three simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard className="p-6 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
