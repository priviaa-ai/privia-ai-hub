import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, Shield, Key, Clock, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function DocsAPIKeys() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const exampleUsage = `import requests

# Initialize with your API key
MONAI_API_KEY = "mon_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
PROJECT_ID = "your-project-id"

headers = {
    "Authorization": f"Bearer {MONAI_API_KEY}",
    "Content-Type": "application/json"
}

# Send LLM interaction
response = requests.post(
    "https://pecnrqvrennoqvewkpuq.supabase.co/functions/v1/ingest-llm-interaction",
    headers=headers,
    json={
        "project_id": PROJECT_ID,
        "user_query": "What is machine learning?",
        "model_output": "Machine learning is...",
        "confidence": 0.95
    }
)

print(response.json())`;

  const rotationExample = `# Best Practice: Implement key rotation

# Step 1: Generate new key in MonAI dashboard
# Step 2: Update your environment variables
NEW_KEY = "mon_live_new_key_here"
OLD_KEY = "mon_live_old_key_here"

# Step 3: Deploy with both keys active (grace period)
# Step 4: After confirming new key works, revoke old key`;

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to="/docs">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Docs
          </Button>
        </Link>

        <PageHeader
          title="API Key Management"
          subtitle="Secure authentication for MonAI API"
        />

        <div className="space-y-8">
          {/* Overview */}
          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              MonAI uses API keys to authenticate requests to our API. API keys are project-specific 
              and provide secure access to send LLM interactions, embeddings, and custom events.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Secure by Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Keys are hashed using SHA-256. Only shown once during creation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Multiple Keys</h3>
                  <p className="text-sm text-muted-foreground">
                    Create separate keys for different environments and services.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Expiration Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Set expiration dates for enhanced security and compliance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Usage Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor when keys were last used and request counts.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Key Format */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Key Format</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                MonAI API keys follow a structured format similar to industry standards:
              </p>
              <div className="bg-black/50 rounded-lg p-4">
                <code className="text-green-400 font-mono">
                  mon_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
                </code>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary">mon_</span>
                  <span className="text-muted-foreground">- MonAI identifier</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary">live_</span>
                  <span className="text-muted-foreground">- Environment (production)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-primary">a1b2c3...</span>
                  <span className="text-muted-foreground">- 64-character cryptographically secure random string</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Creating Keys */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Creating API Keys</h2>
            <GlassCard className="p-6">
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Navigate to your project settings page</li>
                <li>Click "Generate New Key" in the API Keys section</li>
                <li>Provide a descriptive name (e.g., "Production Backend")</li>
                <li>Optionally add a description and set expiration date</li>
                <li>Copy and securely store the key - it will only be shown once</li>
              </ol>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-500 font-semibold mb-1">
                  ⚠️ Important
                </p>
                <p className="text-sm text-muted-foreground">
                  For security reasons, we cannot retrieve or display your key after initial creation. 
                  If you lose a key, you must create a new one and update your applications.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Using Keys */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Using API Keys</h2>
            <GlassCard className="p-6">
              <p className="text-muted-foreground mb-4">
                Include your API key in the Authorization header as a Bearer token:
              </p>
              <div className="bg-black/50 rounded-lg p-4 relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(exampleUsage)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  <code className="text-green-400">{exampleUsage}</code>
                </pre>
              </div>
            </GlassCard>
          </div>

          {/* Best Practices */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Store Keys Securely</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Use environment variables, never hardcode keys</li>
                    <li>• Store in secure secrets management (AWS Secrets Manager, HashiCorp Vault)</li>
                    <li>• Never commit keys to version control</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Use Separate Keys Per Environment</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Development: <code className="bg-muted px-1 rounded">dev_backend_key</code></li>
                    <li>• Staging: <code className="bg-muted px-1 rounded">staging_backend_key</code></li>
                    <li>• Production: <code className="bg-muted px-1 rounded">prod_backend_key</code></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Rotate Keys Regularly</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Implement a key rotation schedule (recommended: every 90 days):
                  </p>
                  <div className="bg-black/50 rounded-lg p-4 relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(rotationExample)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="text-xs overflow-x-auto">
                      <code className="text-green-400">{rotationExample}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Monitor Key Usage</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Regularly review last used timestamps</li>
                    <li>• Revoke unused or suspicious keys immediately</li>
                    <li>• Track request counts to detect anomalies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Never Expose Keys Client-Side</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Always call MonAI from backend services</li>
                    <li>• Never include keys in frontend JavaScript</li>
                    <li>• Use proxy endpoints if client calls are necessary</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Key Management */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Key Management Operations</h2>
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Viewing Keys</h3>
                  <p className="text-sm text-muted-foreground">
                    View all keys for a project in Settings → API Keys. You'll see:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>• Key name and description</li>
                    <li>• Masked key (prefix + last 4 characters)</li>
                    <li>• Creation and last used timestamps</li>
                    <li>• Total usage count</li>
                    <li>• Expiration date (if set)</li>
                    <li>• Active/Revoked status</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Revoking Keys</h3>
                  <p className="text-sm text-muted-foreground">
                    To revoke a key:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 ml-4 mt-2">
                    <li>1. Click the trash icon next to the key</li>
                    <li>2. Confirm revocation in the dialog</li>
                    <li>3. The key is immediately deactivated</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Revoked keys remain visible for audit purposes but cannot be used for authentication.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Troubleshooting */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">401 Unauthorized Error</h3>
                  <p className="text-sm text-muted-foreground mb-2">Possible causes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Key is missing or malformed in the Authorization header</li>
                    <li>• Key has been revoked</li>
                    <li>• Key has expired</li>
                    <li>• Wrong project_id in request body</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Not Working After Creation</h3>
                  <p className="text-sm text-muted-foreground mb-2">Check:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Authorization header format: <code className="bg-muted px-1 rounded">Bearer mon_live_...</code></li>
                    <li>• No extra spaces or line breaks in the key</li>
                    <li>• Using HTTPS endpoints</li>
                    <li>• Correct project_id matches the key's project</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
            <p className="text-muted-foreground mb-4">
              Default rate limiting: <strong>60 requests per minute</strong> per API key across all ingestion endpoints.
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400 font-semibold mb-1">
                ℹ️ Rate Limit Details
              </p>
              <p className="text-sm text-muted-foreground">
                Rate limits are enforced per API key using a sliding window approach. 
                If you exceed the limit, you'll receive a 429 error. Wait for the current minute window to reset before retrying.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}