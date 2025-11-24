import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function DocsSDK() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const pythonExample = `import requests

payload = {
    "project_id": "<PROJECT_ID>",
    "user_query": "How do I change my plan?",
    "model_output": "You cannot change it.",
    "confidence": 0.78,
    "metadata": {
        "language": "en",
        "channel": "web",
        "country": "US"
    }
}

response = requests.post(
    "https://your-domain.com/api/ingest/llm-interaction",
    json=payload,
    headers={"X-MonAI-Project-ID": "<PROJECT_ID>"}
)

print(response.json())`;

  const typescriptExample = `// TypeScript / Node.js
const payload = {
  project_id: "<PROJECT_ID>",
  user_query: "What's the weather?",
  model_output: "I don't have access to real-time weather data.",
  confidence: 0.85,
  metadata: {
    language: "en",
    channel: "api",
    country: "US"
  }
};

const response = await fetch(
  "https://your-domain.com/api/ingest/llm-interaction",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MonAI-Project-ID": "<PROJECT_ID>"
    },
    body: JSON.stringify(payload)
  }
);

const data = await response.json();
console.log(data);`;

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
          title="SDK Examples"
          subtitle="Code snippets for Python, JavaScript, and TypeScript"
        />

        <div className="space-y-8">
          {/* Python */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Python</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Use the <code className="bg-muted px-2 py-1 rounded">requests</code> library 
                to send LLM interactions to MonAI.
              </p>
              
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pythonExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-blue-400">{pythonExample}</code>
                </pre>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Installation</h3>
                <div className="bg-black/50 rounded-lg p-3">
                  <code className="text-sm text-green-400">pip install requests</code>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* TypeScript / Node */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">TypeScript / Node.js</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Use native <code className="bg-muted px-2 py-1 rounded">fetch</code> API 
                to send events from your Node.js or browser application.
              </p>
              
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(typescriptExample)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-blue-400">{typescriptExample}</code>
                </pre>
              </div>
            </GlassCard>
          </div>

          {/* Best Practices */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Always include metadata like language, channel, and country for better analysis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Send events asynchronously to avoid blocking your main application flow</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Batch events when possible to reduce network overhead</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Handle errors gracefully and implement retry logic</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
