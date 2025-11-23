import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { MetricCard } from "@/components/monai/MetricCard";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function ProjectOverview() {
  const { projectId } = useParams();

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <PageHeader
          title="Demo Project"
          subtitle="Overview of your AI reliability metrics"
          actions={
            <Link to={`/monai/projects/${projectId}/settings`}>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          }
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Reliability Score"
            value="94"
            badge="Healthy"
            trend="up"
            trendValue="+2%"
          />
          <MetricCard
            label="Drift Score"
            value="23"
            trend="down"
            trendValue="-5"
          />
          <MetricCard
            label="Hallucination Index"
            value="0.12"
            trend="neutral"
            trendValue="0.0"
          />
          <MetricCard
            label="24h Volume"
            value="1.2k"
            trend="up"
            trendValue="+18%"
          />
        </div>

        {/* Recent Incidents */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Incidents</h2>
          <p className="text-muted-foreground">No active incidents</p>
        </GlassCard>

        {/* Recent Drift Runs */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Drift Runs</h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No drift runs yet</p>
              <Link to={`/monai/projects/${projectId}/drift`}>
                <Button>Run Drift Analysis</Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
