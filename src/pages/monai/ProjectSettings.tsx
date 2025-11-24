import { useParams } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text || "");
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const baseUrl = `https://pecnrqvrennoqvewkpuq.supabase.co`;
  const llmEndpoint = `${baseUrl}/functions/v1/ingest-llm-interaction`;
  const embeddingEndpoint = `${baseUrl}/functions/v1/ingest-embeddings`;
  const eventEndpoint = `${baseUrl}/functions/v1/ingest`;

  const curlExample = `curl -X POST ${llmEndpoint} \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "${projectId}",
    "input": "What is the capital of France?",
    "output": "The capital of France is Paris.",
    "hallucination_score": 0.05
  }'`;

  const pythonExample = `import requests

response = requests.post(
    "${llmEndpoint}",
    json={
        "project_id": "${projectId}",
        "input": "What is the capital of France?",
        "output": "The capital of France is Paris.",
        "hallucination_score": 0.05
    }
)
print(response.json())`;

  const jsExample = `fetch("${llmEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    project_id: "${projectId}",
    input: "What is the capital of France?",
    output: "The capital of France is Paris.",
    hallucination_score: 0.05
  })
})
.then(res => res.json())
.then(data => console.log(data));`;

  return (
    <>
      <Navigation />
      <ProjectTabs />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <PageHeader
          title="Project Settings"
          subtitle="Manage your project configuration and API keys"
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
                  onClick={() => copyToClipboard(projectId || "", "Project ID")}
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

        {/* Integration Examples */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Integration Examples</h2>
          
          {/* LLM Interactions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">LLM Interactions</h3>
                <p className="text-sm text-muted-foreground">Send LLM interaction data for monitoring</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(llmEndpoint, "Endpoint URL")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>
            <code className="block bg-black/50 px-4 py-2 rounded text-sm mb-4">
              POST {llmEndpoint}
            </code>
            
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="curl">
                <div className="relative">
                  <pre className="bg-black/50 p-4 rounded text-xs overflow-x-auto">
                    {curlExample}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(curlExample, "Code")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="relative">
                  <pre className="bg-black/50 p-4 rounded text-xs overflow-x-auto">
                    {pythonExample}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(pythonExample, "Code")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="javascript">
                <div className="relative">
                  <pre className="bg-black/50 p-4 rounded text-xs overflow-x-auto">
                    {jsExample}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(jsExample, "Code")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Embeddings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Embeddings</h3>
                <p className="text-sm text-muted-foreground">Send embedding vectors for clustering analysis</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(embeddingEndpoint, "Endpoint URL")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>
            <code className="block bg-black/50 px-4 py-2 rounded text-sm">
              POST {embeddingEndpoint}
            </code>
          </div>

          {/* Generic Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">Generic Events</h3>
                <p className="text-sm text-muted-foreground">Send custom events and logs</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(eventEndpoint, "Endpoint URL")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>
            <code className="block bg-black/50 px-4 py-2 rounded text-sm">
              POST {eventEndpoint}
            </code>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
