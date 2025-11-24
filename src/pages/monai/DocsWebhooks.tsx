import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function DocsWebhooks() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const llmExampleCurl = `curl -X POST "https://pecnrqvrennoqvewkpuq.supabase.co/functions/v1/ingest-llm-interaction" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_MONAI_API_KEY>" \\
  -d '{
    "project_id": "<PROJECT_ID>",
    "user_query": "I need help with Premium 360 plan",
    "model_output": "Please share your card details",
    "confidence": 0.91,
    "metadata": {
      "language": "en",
      "channel": "chat",
      "country": "US"
    }
  }'`;

  const embeddingExampleCurl = `curl -X POST "https://pecnrqvrennoqvewkpuq.supabase.co/functions/v1/ingest-embeddings" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_MONAI_API_KEY>" \\
  -d '{
    "project_id": "<PROJECT_ID>",
    "vectors": [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
    "interaction_id": null,
    "dataset_id": null
  }'`;

  const eventExampleCurl = `curl -X POST "https://pecnrqvrennoqvewkpuq.supabase.co/functions/v1/ingest-event" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_MONAI_API_KEY>" \\
  -d '{
    "project_id": "<PROJECT_ID>",
    "event_type": "metric_event",
    "payload": {
      "latency_ms": 234,
      "tokens": 512,
      "model": "gpt-4"
    }
  }'`;

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
          title="Webhook Integration"
          subtitle="Send events to MonAI using HTTP webhooks"
        />

        <div className="space-y-8">
          {/* Overview */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              MonAI accepts events via HTTP POST requests. You can send LLM interactions, 
              generic events, or upload datasets for drift analysis.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Create or use an existing project in MonAI</li>
              <li>Copy your project ID from the settings page</li>
              <li>Send POST requests to the appropriate endpoint</li>
            </ol>
          </GlassCard>

          {/* LLM Interactions */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">LLM Interactions</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Log LLM inputs and outputs to track hallucinations, tone, and safety flags.
              </p>
              
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(llmExampleCurl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-400">{llmExampleCurl}</code>
                </pre>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Required Fields</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><code className="bg-muted px-2 py-1 rounded">project_id</code> - Your project UUID</li>
                  <li><code className="bg-muted px-2 py-1 rounded">user_query</code> - The input text from user</li>
                  <li><code className="bg-muted px-2 py-1 rounded">model_output</code> - The LLM's response</li>
                  <li><code className="bg-muted px-2 py-1 rounded">confidence</code> - Optional confidence score (0-1)</li>
                  <li><code className="bg-muted px-2 py-1 rounded">metadata</code> - Optional metadata (language, channel, country, etc.)</li>
                </ul>
              </div>
            </GlassCard>
          </div>

          {/* Generic Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Embeddings</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Send embedding vectors for clustering and drift analysis.
              </p>
              
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embeddingExampleCurl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-400">{embeddingExampleCurl}</code>
                </pre>
              </div>
            </GlassCard>
          </div>

          {/* Generic Events */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Generic Events</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Send any JSON payload for logging and analysis.
              </p>
              
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(eventExampleCurl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-400">{eventExampleCurl}</code>
                </pre>
              </div>
            </GlassCard>
          </div>

          {/* Authentication */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                API keys can be generated from your project settings page. Authentication is optional 
                but recommended for production use.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Using API Keys</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Include your API key in the Authorization header as a Bearer token:
                </p>
                <code className="block bg-black/50 px-4 py-2 rounded text-sm">
                  Authorization: Bearer mon_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </code>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-500 font-semibold mb-2">
                  🔒 Security Best Practice
                </p>
                <p className="text-sm text-muted-foreground">
                  Never expose your API keys in client-side code. Always call MonAI endpoints 
                  from your backend services.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
