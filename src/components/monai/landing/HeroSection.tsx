import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Activity } from "lucide-react";

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

      <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
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

      {/* Animated Drift Chart */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="glass-card p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift" />
          
          <div className="relative z-10 flex items-end justify-between h-32 gap-2">
            {[40, 65, 45, 70, 55, 80, 60, 85, 75, 90, 70, 95].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t transition-all duration-1000 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  animation: `float ${2 + i * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Real-time drift detection across your AI systems
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
