import { GlassCard } from "@/components/monai/GlassCard";
import { Plug, Upload, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Plug,
    title: "Connect your project",
    description: "Integrate MonAI with your ML or LLM application in minutes using our SDK or API.",
    screenshot: "bg-gradient-to-br from-primary/20 to-accent/20"
  },
  {
    icon: Upload,
    title: "Ingest datasets or LLM events",
    description: "Stream your production data, embeddings, and LLM interactions to MonAI.",
    screenshot: "bg-gradient-to-br from-accent/20 to-success/20"
  },
  {
    icon: BarChart3,
    title: "Monitor drift and behavior in real-time",
    description: "Get instant insights and alerts when reliability issues emerge in production.",
    screenshot: "bg-gradient-to-br from-success/20 to-primary/20"
  }
];

export const HowItWorks = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How MonAI Works</h2>
        <p className="text-xl text-muted-foreground">
          Start monitoring in three simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <GlassCard key={step.title} className="p-6 relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className={`${step.screenshot} rounded-lg h-32 mb-4 flex items-center justify-center border border-white/10`}>
                <div className="flex gap-1">
                  {[65, 45, 70, 55, 80, 60, 85, 75].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-primary to-accent rounded"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
