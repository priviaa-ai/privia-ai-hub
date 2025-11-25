import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard-framed.png";

export const HeroSection = () => {
  return (
    <div className="max-w-6xl mx-auto text-center mb-32 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
        <Activity className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm text-foreground/80">Enterprise-Grade Monitoring</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-foreground leading-tight">
        AI Reliability Monitoring for ML and LLM Systems
      </h1>
      
      <p className="text-xl sm:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto">
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

      {/* Real Dashboard Hero */}
      <div className="max-w-[70%] mx-auto mb-16 mt-12">
        <div className="relative group">
          {/* Real dashboard screenshot - cropped to show only inner rectangle */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgba(91,107,255,0.5),0_10px_40px_-10px_rgba(163,114,255,0.3)]">
            <img 
              src={heroDashboard} 
              alt="MonAI Drift Dashboard - Real-time drift detection and monitoring"
              className="w-full h-auto"
              style={{ 
                clipPath: 'inset(8% 8% 14% 8%)',
                transform: 'scale(1.18)'
              }}
            />
          </div>
          
          <div className="mt-8 text-base text-muted-foreground text-center">
            Real-time model drift detection across your AI systems
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
