import { GlassCard } from "@/components/monai/GlassCard";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ConnectIcon,
  IngestIcon,
  MonitorIcon,
} from "@/components/monai/icons/FeatureIcons";

const steps = [
  {
    Icon: ConnectIcon,
    title: "Connect your project",
    description: "Integrate MonAI with your ML or LLM application in minutes using our SDK or API.",
  },
  {
    Icon: IngestIcon,
    title: "Ingest datasets or LLM events",
    description: "Stream your production data, embeddings, and LLM interactions to MonAI.",
  },
  {
    Icon: MonitorIcon,
    title: "Monitor drift and behavior in real-time",
    description: "Get instant insights and alerts when reliability issues emerge in production.",
  }
];

export const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className="max-w-6xl mx-auto mb-32">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-12 px-4"
      >
        <h2 className="heading-spacing">How MonAI Works</h2>
        <p className="text-description max-w-[780px] mx-auto">
          Start monitoring in three simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.Icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <GlassCard className="p-6 relative group">
                {/* Step number badge */}
                <div 
                  className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm text-white"
                  style={{
                    background: 'linear-gradient(135deg, #4F67FF 0%, #7A5CFF 100%)',
                    boxShadow: '0 4px 12px rgba(79, 103, 255, 0.3)',
                  }}
                >
                  {index + 1}
                </div>
                
                {/* Premium glassmorphism icon container */}
                <div className="mb-5 flex justify-center">
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

                <h3 className="text-xl font-medium mb-2 text-center">{step.title}</h3>
                <p className="text-sm font-medium text-muted-foreground/80 text-center leading-relaxed">
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
