import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Navigation } from "@/components/monai/Navigation";
import { GlassCard } from "@/components/monai/GlassCard";
import { HeroSection } from "@/components/monai/landing/HeroSection";
import { ValuePropositions } from "@/components/monai/landing/ValuePropositions";
import { HowItWorks } from "@/components/monai/landing/HowItWorks";
import { FeatureDeepDive } from "@/components/monai/landing/FeatureDeepDive";
import { DashboardPreview } from "@/components/monai/landing/DashboardPreview";
import { Footer } from "@/components/monai/landing/Footer";

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

const Landing = () => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <HeroSection />
        <ValuePropositions />
        <HowItWorks />
        <FeatureDeepDive />
        <DashboardPreview />

        {/* Pricing Preview CTA */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing for every AI team</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the plan that fits your monitoring needs
          </p>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/5">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your AI monitoring needs
            </p>
          </div>

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
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
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

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need help choosing? <a href="mailto:sales@monai.dev" className="text-primary hover:underline">Contact our team</a>
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <GlassCard className="p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient-shift" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to monitor your AI?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start tracking drift and reliability issues in minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/monai/projects">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Landing;
