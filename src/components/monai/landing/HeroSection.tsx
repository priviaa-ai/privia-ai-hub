import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard-final.png";
import { motion } from "framer-motion";
import { PrimaryCtaButton } from "@/components/ui/primary-cta-button";

const headlineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const dashboardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export const HeroSection = () => {

  return (
    <div className="max-w-6xl mx-auto text-center mb-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headlineVariants}
        transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
      >
        <Activity className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm text-foreground/80">Enterprise-Grade Monitoring</span>
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={headlineVariants}
        transition={{ duration: 0.9, delay: 0, ease: "easeOut" }}
        className="text-4xl sm:text-5xl lg:text-6xl font-medium mb-8 text-foreground leading-[1.15] max-w-[780px] mx-auto px-4"
      >
        Know when your AI drifts<br />before your users do
      </motion.h1>
      
      {/* Premium Separator */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={descriptionVariants}
        transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
        className="flex justify-center mb-10 mt-10 px-4"
      >
        <div 
          className="h-[1.5px] w-[320px] max-w-[90%] relative"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
          }}
        />
      </motion.div>
      
      <motion.p
        initial="hidden"
        animate="visible"
        variants={descriptionVariants}
        transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
        className="text-sm sm:text-base lg:text-lg font-normal text-white mb-10 max-w-[780px] mx-auto leading-relaxed px-4"
      >
        MonAI monitors ML and LLM systems for drift, hallucinations, and behavior shifts in real time so teams can fix issues before they reach customers.
      </motion.p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          transition={{ duration: 0.5, delay: 2.1, ease: "easeOut" }}
        >
          <PrimaryCtaButton to="/monai/projects" size="default" />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
          transition={{ duration: 0.5, delay: 2.18, ease: "easeOut" }}
        >
        <Link to="/docs">
          <Button
            size="default" 
            variant="outline" 
            className={`
              relative px-8 group overflow-hidden
              bg-white/10 border border-white/30
              transition-all duration-500 ease-out
              
              hover:bg-transparent
              hover:backdrop-blur-md
              hover:border-white/40
              hover:scale-105
              
              before:absolute before:inset-0 before:left-0
              before:w-0 before:h-full
              before:bg-transparent before:backdrop-blur-md
              before:transition-all before:duration-500 before:ease-out
              group-hover:before:w-full
            `}
          >
            <span className="relative z-10">View Docs</span>
          </Button>
        </Link>
        </motion.div>
      </div>

      {/* Real Dashboard Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={dashboardVariants}
        transition={{ duration: 0.7, delay: 3.05, ease: "easeOut" }}
        className="max-w-5xl mx-auto mb-16 mt-12 px-4"
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
          
          {/* Dashboard screenshot */}
          <div className="relative">
            <img 
              src={heroDashboard} 
              alt="MonAI Drift Dashboard - Real-time drift detection and monitoring"
              className="w-full h-auto block rounded-xl"
            />
          </div>
          
          <div className="mt-8 text-base text-muted-foreground text-center px-4">
            Real-time model drift detection across your AI systems
          </div>
        </div>
      </motion.div>

      {/* Trusted By Section */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-6">Trusted by teams building with AI</p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
          {["Acme AI", "Vector Labs", "Neural Systems", "ML Studio"].map((company) => (
            <div key={company} className="px-6 py-3 glass-card text-sm font-medium">
              {company}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
