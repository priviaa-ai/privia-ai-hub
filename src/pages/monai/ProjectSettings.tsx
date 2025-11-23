import { useParams } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text || "");
    toast({
      title: "Copied",
      description: "Project ID copied to clipboard",
    });
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <PageHeader
          title="Project Settings"
          subtitle="Manage your project configuration and API keys"
          showBack
        />

        {/* Project Info */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Project ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 bg-black/50 px-4 py-2 rounded text-sm">
                  {projectId}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(projectId || "")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* API Keys */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">API Keys</h2>
            <Button size="sm">Generate New Key</Button>
          </div>
          <p className="text-muted-foreground">
            No API keys generated yet. API key validation is optional during public beta.
          </p>
        </GlassCard>

        {/* Ingestion Endpoints */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Ingestion Endpoints</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">LLM Interactions</label>
              <code className="block bg-black/50 px-4 py-2 rounded text-sm mt-1">
                POST /api/ingest/llm-interaction
              </code>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Embeddings</label>
              <code className="block bg-black/50 px-4 py-2 rounded text-sm mt-1">
                POST /api/ingest/embeddings
              </code>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Generic Events</label>
              <code className="block bg-black/50 px-4 py-2 rounded text-sm mt-1">
                POST /api/ingest/event
              </code>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
