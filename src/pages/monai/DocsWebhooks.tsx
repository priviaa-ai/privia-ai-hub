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

  const llmExampleCurl = `curl -X POST "https://your-domain.com/api/ingest/llm-interaction" \\
  -H "Content-Type: application/json" \\
  -H "X-MonAI-Project-ID: <PROJECT_ID>" \\
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

  const eventExampleCurl = `curl -X POST "https://your-domain.com/api/ingest/event" \\
  -H "Content-Type: application/json" \\
  -H "X-MonAI-Project-ID: <PROJECT_ID>" \\
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
            <p className="text-muted-foreground">
              For the public beta, authentication is optional. In production, you'll use API keys 
              via the <code className="bg-muted px-2 py-1 rounded">X-MonAI-API-Key</code> header.
            </p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
