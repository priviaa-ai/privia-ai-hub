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
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
  const pricingRef = useScrollReveal();

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <HeroSection />
        <ValuePropositions />
        <HowItWorks />
        <FeatureDeepDive />
        <DashboardPreview />

        {/* Pricing Preview CTA */}
        <div className="max-w-4xl mx-auto text-center section-spacing px-4">
          <h2 className="heading-spacing">Simple pricing for every AI team</h2>
          <p className="text-description mb-8 max-w-[780px] mx-auto">
            Choose the plan that fits your monitoring needs
          </p>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 border-white/20 hover:bg-white/5">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Pricing Plans */}
        <div ref={pricingRef.ref} className="max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={pricingRef.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 px-4"
          >
            <h2 className="heading-spacing">Pricing</h2>
            <p className="text-description max-w-[780px] mx-auto">
              Choose the plan that fits your AI monitoring needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={pricingRef.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard
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
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center px-4">
            <p className="text-muted-foreground/80 font-medium">
              Need help choosing? <a href="mailto:support@priviaai.com" className="text-primary hover:underline">Contact our team</a>
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto text-center mb-12 px-4">
          <GlassCard className="p-8 sm:p-12">
            <h2 className="heading-spacing">Ready to monitor your AI?</h2>
            <p className="text-description mb-8 max-w-[780px] mx-auto">
              Start tracking drift and reliability issues in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/monai/projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Landing;
