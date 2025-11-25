import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Link } from "react-router-dom";
import { Webhook, Code2, Database, TrendingUp, Sparkles, AlertCircle, ArrowLeft, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const docSections = [
  {
    title: "API Keys",
    description: "Secure authentication and key management",
    icon: Key,
    path: "/docs/api-keys",
  },
  {
    title: "Webhooks",
    description: "Learn how to send events to MonAI via webhooks",
    icon: Webhook,
    path: "/docs/webhooks",
  },
  {
    title: "SDK Integration",
    description: "Python and JavaScript code examples",
    icon: Code2,
    path: "/docs/sdk",
  },
];

const concepts = [
  {
    title: "Projects",
    description: "Organize your ML and LLM monitoring by project. Each project has its own datasets, drift runs, and alerts.",
    icon: Database,
  },
  {
    title: "Drift Detection",
    description: "Monitor statistical drift in your data using PSI, KL divergence, and other metrics. Compare baseline vs current datasets.",
    icon: TrendingUp,
  },
  {
    title: "LLM Interactions",
    description: "Log and analyze LLM inputs and outputs. Track hallucination scores, tone, and safety flags automatically.",
    icon: Sparkles,
  },
  {
    title: "Alerts",
    description: "Get notified when drift or reliability issues are detected. Configure thresholds and notification channels.",
    icon: AlertCircle,
  },
];

export default function Docs() {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <PageHeader
          title="Documentation"
          subtitle="Everything you need to integrate MonAI into your AI systems"
        />

        <div className="mb-12">
          <h3 className="text-2xl font-medium mb-6">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docSections.map((section) => (
              <Link key={section.path} to={section.path}>
                <GlassCard hover className="p-6 h-full">
                  <section.icon className="h-8 w-8 text-primary mb-4" />
                  <h4 className="text-xl font-medium mb-2">{section.title}</h4>
                  <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">{section.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-medium mb-6">Core Concepts</h3>
          <div className="space-y-4">
            {concepts.map((concept) => (
              <GlassCard key={concept.title} className="p-6">
                <div className="flex gap-4">
                  <concept.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-medium mb-2">{concept.title}</h4>
                    <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">{concept.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
