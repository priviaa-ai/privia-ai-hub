import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity } from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.png";

export const HeroSection = () => {
  return (
    <div className="max-w-6xl mx-auto text-center mb-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
        <Activity className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm text-foreground/80">Enterprise AI Reliability Platform</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
        AI Reliability Monitoring for ML and LLM Systems
      </h1>
      
      <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
        Detect drift, hallucinations, anomalies, and behavior shifts before they impact customers.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <Link to="/monai/projects">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 group">
            Start Monitoring
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link to="/docs">
          <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/5">
            View Docs
          </Button>
        </Link>
      </div>

      {/* Composite Dashboard Hero */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="relative group">
          {/* Neon blue/purple gradient glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 via-accent/50 to-primary/40 rounded-3xl blur-2xl opacity-70" />
          
          {/* Glass container with composite dashboard */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(59,130,246,0.3)] backdrop-blur-sm">
            {/* Slight overlay for glass effect with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-background/10 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-white/[0.02] z-10 pointer-events-none" />
            
            {/* Dashboard image with subtle blur for brand aesthetic */}
            <img 
              src={dashboardHero} 
              alt="MonAI Composite Dashboard - Metrics, DSI Trend, and Feature Drift"
              className="w-full h-auto"
              style={{ filter: 'blur(6px)' }}
            />
          </div>
          
          <div className="mt-6 text-sm text-muted-foreground text-center">
            Real AI reliability monitoring from MonAI
          </div>
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
