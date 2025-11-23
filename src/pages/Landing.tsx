import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  BarChart3, 
  Bell, 
  FileCheck, 
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Drift Detection",
      description: "Monitor data distribution changes instantly with our advanced DSI algorithms and get alerts when drift exceeds your thresholds."
    },
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      description: "Process up to 200k rows and 200 columns in seconds. Our optimized engine handles large datasets with ease."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Receive Slack alerts when drift is detected. Configure custom thresholds for DSI and drift ratio to match your needs."
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Get comprehensive drift analysis with feature-level insights, visual metrics, and actionable recommendations."
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description: "Secure data handling with automatic cleanup. API-first design for seamless integration into your ML pipeline."
    },
    {
      icon: FileCheck,
      title: "CSV & API Support",
      description: "Upload CSVs directly or use our REST API. Flexible integration options for any workflow."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Data",
      description: "Upload your baseline (training) dataset and current dataset as CSV files or via API."
    },
    {
      number: "02",
      title: "Analyze Drift",
      description: "Our AI engine automatically detects distribution changes across all features."
    },
    {
      number: "03",
      title: "Get Insights",
      description: "View detailed reports with drift metrics, top drifted features, and recommendations."
    },
    {
      number: "04",
      title: "Take Action",
      description: "Receive alerts, retrain models, or investigate feature-level changes based on insights."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Mon AI
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects - Cybersecurity Grid */}
        <div className="absolute inset-0 -z-10">
          {/* Animated Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-color)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-color)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3
          }} />
          
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          {/* Scan Lines Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-6 text-sm px-4 py-2" variant="outline">
            <Sparkles className="h-3 w-3 mr-2" />
            AI-Powered Data Drift Monitoring
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 text-white drop-shadow-2xl">
            Monitor AI/ML Model Drift
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,112,219,0.5)]">
              Before It's Too Late
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            Detect data distribution changes in your AI/ML pipelines with intelligent drift monitoring. 
            Get real-time alerts and detailed analytics to keep your models performing at their best.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-10 py-6 group"
              >
                Start Monitoring Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/webhook">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6">
                View API Docs
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
            <div className="backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-white drop-shadow-lg">200k</p>
              <p className="text-sm text-white/70 mt-1">Rows per dataset</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-white drop-shadow-lg">&lt;10s</p>
              <p className="text-sm text-white/70 mt-1">Analysis time</p>
            </div>
            <div className="backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-4xl font-bold text-white drop-shadow-lg">200</p>
              <p className="text-sm text-white/70 mt-1">Feature columns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-color)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-color)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.2
        }} />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Monitor Model Health
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive drift detection with powerful analytics and seamless integrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Powerful Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive drift monitoring platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Use Cases</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for AI/ML Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Production ML Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Monitor prediction inputs for distribution changes</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Detect concept drift before model performance degrades</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Automated alerts to trigger model retraining</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Data Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Validate data pipeline outputs continuously</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Identify data anomalies and quality issues early</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Ensure consistent data quality across environments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Grid Background */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--grid-color)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--grid-color)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Monitor Your Models?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join AI/ML teams using Mon AI to maintain model performance with intelligent drift detection
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-6 group"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon AI
              </span>
              <span className="text-muted-foreground">by Privia AI</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/projects" className="hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link to="/webhook" className="hover:text-foreground transition-colors">
                API Docs
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-muted-foreground">
            © 2024 Mon AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
