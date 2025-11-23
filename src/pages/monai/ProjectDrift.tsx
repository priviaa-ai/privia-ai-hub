import { useParams } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";

export default function ProjectDrift() {
  const { projectId } = useParams();

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <PageHeader
          title="Drift Dashboard"
          subtitle="Monitor data and model drift across your datasets"
        />

        <GlassCard className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Upload datasets to start detecting drift
            </p>
            <Button>Upload Dataset</Button>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
