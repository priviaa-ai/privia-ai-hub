import { GlassCard } from "@/components/monai/GlassCard";
import featureMetricsReal from "@/assets/feature-metrics-real.png";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const DashboardPreview = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div ref={ref} className="max-w-6xl mx-auto mb-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your AI Reliability Dashboard</h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to monitor AI systems in one place
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative">
          {/* Subtle outer glow - whisper-light neon */}
          <div 
            className="absolute -inset-[30px] md:-inset-[40px] rounded-[32px] opacity-[0.35] md:opacity-[0.4]"
            style={{
              background: 'radial-gradient(circle at center, rgba(120, 70, 255, 0.55), rgba(0, 150, 255, 0.45))',
              filter: 'blur(60px)'
            }}
          />
          
          {/* Feature Metrics screenshot */}
          <div className="relative">
            <img 
              src={featureMetricsReal} 
              alt="MonAI feature level drift metrics with PSI, KL divergence, and drift status"
              className="w-full h-auto block rounded-xl"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
