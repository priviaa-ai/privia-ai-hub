import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard-final.png";
import miniAlerts from "@/assets/mini-alerts.png";
import miniDriftChart from "@/assets/mini-drift-chart.png";
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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const glowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const secondaryCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const HeroSection = () => {

  return (
    <div className="max-w-6xl mx-auto text-center mb-32 relative">
      {/* Premium Aurora Background - Hero Only */}
      <div 
        className="absolute -z-10 overflow-hidden"
        style={{
          top: '-100px',
          bottom: '-40px',
          left: '-40px',
          right: '-40px',
          borderRadius: '32px',
        }}
      >
        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(8, 10, 20, 0.6) 70%, rgba(8, 10, 20, 0.9) 100%)',
            borderRadius: 'inherit'
          }}
        />
        
        {/* Aurora Orb 1 - Deep Blue */}
        <div 
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full animate-aurora-drift"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '0s'
          }}
        />
        
        {/* Aurora Orb 2 - Violet */}
        <div 
          className="absolute top-[25%] right-[15%] w-[600px] h-[600px] rounded-full animate-aurora-drift"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animationDelay: '5s'
          }}
        />
        
        {/* Aurora Orb 3 - Soft Cyan */}
        <div 
          className="absolute bottom-[10%] left-[50%] w-[550px] h-[550px] rounded-full animate-aurora-drift"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%)',
            filter: 'blur(85px)',
            animationDelay: '10s'
          }}
        />
        
        {/* Center Glow Behind Headline */}
        <div 
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[300px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(120, 70, 255, 0.12) 0%, transparent 60%)',
            filter: 'blur(100px)'
          }}
        />
        
        {/* Particle Noise Layer */}
        <div 
          className="absolute inset-0 opacity-[0.015] animate-particle-twinkle pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'screen',
            borderRadius: 'inherit'
          }}
        />
        
        {/* Depth Fog */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(8, 10, 20, 0.3) 100%)',
            borderRadius: 'inherit'
          }}
        />
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

      {/* Premium AI Control Center Mockup */}
      <div className="max-w-5xl mx-auto mb-16 mt-12 px-4 relative">
        {/* Bottom-to-Top Fade for Dashboard Blend */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none -z-10"
          style={{
            background: 'linear-gradient(to top, rgba(8, 10, 20, 0.8) 0%, transparent 100%)'
          }}
        />
        
        <div className="relative min-h-[400px] lg:min-h-[500px]">
          
          {/* Secondary Card 1 - Alerts (top left, behind) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={secondaryCardVariants}
            transition={{ duration: 0.6, delay: 2.85, ease: "easeOut" }}
            className="absolute top-[-20px] left-[-30px] lg:top-[-40px] lg:left-[-60px] w-[280px] lg:w-[380px] z-0 hidden md:block"
            style={{
              transform: 'rotate(-4deg)',
              filter: 'blur(1.5px)'
            }}
          >
            <div 
              className="rounded-xl border overflow-hidden"
              style={{
                background: 'rgba(10, 15, 30, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                opacity: 0.6
              }}
            >
              <img 
                src={miniAlerts} 
                alt="Alert monitoring"
                className="w-full h-auto opacity-70"
              />
            </div>
          </motion.div>

          {/* Secondary Card 2 - Drift Chart (bottom right, behind) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={secondaryCardVariants}
            transition={{ duration: 0.6, delay: 2.95, ease: "easeOut" }}
            className="absolute bottom-[-20px] right-[-30px] lg:bottom-[-40px] lg:right-[-60px] w-[280px] lg:w-[380px] z-0 hidden md:block"
            style={{
              transform: 'rotate(3deg)',
              filter: 'blur(1.5px)'
            }}
          >
            <div 
              className="rounded-xl border overflow-hidden"
              style={{
                background: 'rgba(10, 15, 30, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                opacity: 0.6
              }}
            >
              <img 
                src={miniDriftChart} 
                alt="Drift chart analysis"
                className="w-full h-auto opacity-70"
              />
            </div>
          </motion.div>

          {/* Main Card with Glow */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={dashboardVariants}
            transition={{ duration: 0.7, delay: 2.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Animated Glow */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={glowVariants}
              transition={{ duration: 0.7, delay: 2.7, ease: "easeOut" }}
              className="absolute -inset-[40px] md:-inset-[60px] rounded-[32px]"
              style={{
                background: 'radial-gradient(circle at center, rgba(120, 70, 255, 0.35), rgba(59, 130, 246, 0.25))',
                filter: 'blur(80px)',
                opacity: 0.4
              }}
            />
            
            {/* Glassmorphism Main Card */}
            <div 
              className="relative rounded-2xl border overflow-hidden"
              style={{
                background: 'rgba(15, 20, 35, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              <img 
                src={heroDashboard} 
                alt="MonAI Drift Dashboard - Real-time drift detection and monitoring"
                className="w-full h-auto block"
              />
              
              {/* Live Status Badge - Top Right */}
              <div 
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#ef4444',
                    boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)'
                  }}
                />
                <span className="text-red-100">High drift detected on 3 features</span>
              </div>

              {/* Live Status Badge - Bottom Left */}
              <div 
                className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  borderColor: 'rgba(234, 179, 8, 0.3)',
                  border: '1px solid',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.25)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s'
                }}
              >
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#eab308',
                    boxShadow: '0 0 6px rgba(234, 179, 8, 0.8)'
                  }}
                />
                <span className="text-yellow-100">DSI spike: 75 – critical</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={dashboardVariants}
            transition={{ duration: 0.5, delay: 3.1, ease: "easeOut" }}
            className="mt-8 text-base text-muted-foreground text-center px-4 relative z-10"
          >
            Real-time model drift detection across your AI systems
          </motion.div>
        </div>
      </div>

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
