import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "1 project",
      "1,000 events per month",
      "Basic drift detection",
      "7-day data retention",
      "Community support",
    ],
  },
  {
    name: "Starter",
    price: "$49",
    description: "For small teams",
    features: [
      "3 projects",
      "50,000 events per month",
      "Basic hallucination detection",
      "30-day data retention",
      "Email alerts",
      "Email support",
    ],
    popular: true,
  },
  {
    name: "Growth",
    price: "$199",
    description: "For scaling AI teams",
    features: [
      "10 projects",
      "500,000 events per month",
      "LLM behavior engine",
      "Advanced embeddings",
      "90-day data retention",
      "Slack alerts",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations",
    features: [
      "Unlimited projects",
      "Unlimited events",
      "SSO & SAML",
      "SOC2 compliance",
      "Audit logs",
      "On-premise deployment",
      "Dedicated support",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <PageHeader
          title="Pricing"
          subtitle="Choose the plan that fits your AI monitoring needs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <GlassCard
              key={plan.name}
              hover
              className={`p-6 relative ${plan.popular ? 'border-primary/50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-xs font-medium">
                  Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                <p className="text-muted-foreground/80 text-sm mb-4 font-medium">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-medium">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground/80 font-medium">/mo</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground/80 font-medium mb-4">
            Need help choosing? <a href="mailto:sales@monai.dev" className="text-primary hover:underline">Contact our team</a>
          </p>
        </div>
      </div>
    </>
  );
}
