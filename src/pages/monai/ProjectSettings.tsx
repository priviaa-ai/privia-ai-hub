import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApiKey {
  id: string;
  name: string;
  description?: string;
  prefix: string;
  last_four: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
  environment: string;
  permissions?: {
    read: boolean;
    write: boolean;
    admin?: boolean;
  };
  expires_at?: string | null;
  usage_count?: number;
}

interface ProjectSettings {
  dsi_threshold: number;
  hallucination_threshold: number;
  slack_webhook_url: string | null;
  email_alert: string | null;
}

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyDescription, setKeyDescription] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<{ display_key: string; name: string } | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null);
  
  // Project settings state
  const [settings, setSettings] = useState<ProjectSettings>({
    dsi_threshold: 0.3,
    hallucination_threshold: 0.3,
    slack_webhook_url: null,
    email_alert: null,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadApiKeys();
      loadProjectSettings();
    }
  }, [projectId]);

  const loadProjectSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('monai_projects')
        .select('dsi_threshold, hallucination_threshold, slack_webhook_url, email_alert')
        .eq('id', projectId)
        .single();

      if (!error && data) {
        setSettings({
          dsi_threshold: data.dsi_threshold ?? 0.3,
          hallucination_threshold: data.hallucination_threshold ?? 0.3,
          slack_webhook_url: data.slack_webhook_url,
          email_alert: data.email_alert,
        });
      }
    } catch (error) {
      console.error('Error loading project settings:', error);
    }
  };

  const saveProjectSettings = async () => {
    try {
      setSavingSettings(true);
      const { error } = await supabase
        .from('monai_projects')
        .update({
          dsi_threshold: settings.dsi_threshold,
          hallucination_threshold: settings.hallucination_threshold,
          slack_webhook_url: settings.slack_webhook_url || null,
          email_alert: settings.email_alert || null,
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Project settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      // Build URL with query parameter
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-keys-list?project_id=${projectId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (error: any) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    try {
      setCreating(true);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-keys-create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: projectId,
            name: keyName || 'API Key',
            description: keyDescription || null,
            expires_in_days: expiresInDays,
            permissions: { read: true, write: true },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create API key');
      }

      const data = await response.json();

      setNewKey({
        display_key: data.display_key,
        name: data.name,
      });
      setKeyName("");
      setKeyDescription("");
      setExpiresInDays(null);
      setDialogOpen(false);
      await loadApiKeys();
    } catch (error: any) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-keys-revoke`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key_id: keyId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      toast({
        title: "Success",
        description: "API key revoked successfully",
      });
      await loadApiKeys();
      setRevokeKeyId(null);
    } catch (error: any) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

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
  const eventEndpoint = `${baseUrl}/functions/v1/ingest-event`;

  const curlExample = `curl -X POST ${llmEndpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_MONAI_API_KEY>" \\
  -d '{
    "project_id": "${projectId}",
    "user_query": "What is the capital of France?",
    "model_output": "The capital of France is Paris.",
    "confidence": 0.95,
    "metadata": {
      "language": "en",
      "channel": "web"
    }
  }'`;

  const pythonExample = `import requests

response = requests.post(
    "${llmEndpoint}",
    headers={
        "Authorization": "Bearer <YOUR_MONAI_API_KEY>"
    },
    json={
        "project_id": "${projectId}",
        "user_query": "What is the capital of France?",
        "model_output": "The capital of France is Paris.",
        "confidence": 0.95,
        "metadata": {
            "language": "en",
            "channel": "web"
        }
    }
)
print(response.json())`;

  const jsExample = `fetch("${llmEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <YOUR_MONAI_API_KEY>"
  },
  body: JSON.stringify({
    project_id: "${projectId}",
    user_query: "What is the capital of France?",
    model_output: "The capital of France is Paris.",
    confidence: 0.95,
    metadata: {
      language: "en",
      channel: "web"
    }
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
          showBack={true}
          backTo="/monai/projects"
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

        {/* Alert Thresholds */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Alert Thresholds</h2>
            <Button onClick={saveProjectSettings} disabled={savingSettings}>
              <Save className="h-4 w-4 mr-2" />
              {savingSettings ? "Saving..." : "Save Settings"}
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">
            Configure thresholds for drift and hallucination alerts. When these thresholds are exceeded, 
            MonAI will create alerts and send notifications via configured channels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="dsiThreshold">DSI Threshold</Label>
              <Input
                id="dsiThreshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.dsi_threshold}
                onChange={(e) => setSettings({ ...settings, dsi_threshold: parseFloat(e.target.value) || 0.3 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Drift Severity Index threshold (0-1). Default: 0.3
              </p>
            </div>
            
            <div>
              <Label htmlFor="hallucinationThreshold">Hallucination Threshold</Label>
              <Input
                id="hallucinationThreshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.hallucination_threshold}
                onChange={(e) => setSettings({ ...settings, hallucination_threshold: parseFloat(e.target.value) || 0.3 })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                High hallucination fraction threshold (0-1). Default: 0.3
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <p className="text-muted-foreground mb-6">
            Configure notification channels for alerts. MonAI will send notifications when drift or 
            hallucination thresholds are exceeded.
          </p>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
              <Input
                id="slackWebhook"
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={settings.slack_webhook_url || ""}
                onChange={(e) => setSettings({ ...settings, slack_webhook_url: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Incoming webhook URL for Slack notifications. <a href="https://api.slack.com/messaging/webhooks" target="_blank" className="text-primary hover:underline">Learn more</a>
              </p>
            </div>
            
            <div>
              <Label htmlFor="emailAlert">Email Alert Address</Label>
              <Input
                id="emailAlert"
                type="email"
                placeholder="alerts@example.com"
                value={settings.email_alert || ""}
                onChange={(e) => setSettings({ ...settings, email_alert: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email address to receive alert notifications (coming soon)
              </p>
            </div>
          </div>
        </GlassCard>

        {/* API Keys */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">API Keys</h2>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              Generate New Key
            </Button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading API keys...</p>
          ) : apiKeys.length === 0 ? (
            <p className="text-muted-foreground">
              No API keys generated yet. API key validation is optional.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{key.name}</div>
                        {key.description && (
                          <div className="text-xs text-muted-foreground">{key.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs">
                        {key.prefix}_••••{key.last_four}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(key.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm">
                      {key.last_used_at
                        ? format(new Date(key.last_used_at), 'MMM d, yyyy')
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {key.usage_count || 0} requests
                    </TableCell>
                    <TableCell className="text-sm">
                      {key.expires_at ? (
                        <span className={new Date(key.expires_at) < new Date() ? 'text-red-500' : ''}>
                          {format(new Date(key.expires_at), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        'Never'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {key.is_active && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRevokeKeyId(key.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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

      {/* Create API Key Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for authenticating requests to MonAI. Keys are only shown once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="keyName">Key Name *</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Backend"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A descriptive name to help you identify this key
              </p>
            </div>
            <div>
              <Label htmlFor="keyDescription">Description (Optional)</Label>
              <Input
                id="keyDescription"
                placeholder="e.g., Main production API for web app"
                value={keyDescription}
                onChange={(e) => setKeyDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expires">Expiration (Optional)</Label>
              <Select 
                value={expiresInDays?.toString() || 'never'} 
                onValueChange={(value) => setExpiresInDays(value === 'never' ? null : parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Never expires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never expires</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Keys expire automatically for enhanced security
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Permissions:</strong> Full access (read & write)<br />
                <strong>Environment:</strong> Production
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createApiKey} disabled={creating || !keyName}>
              {creating ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show New Key Dialog */}
      <Dialog open={!!newKey} onOpenChange={() => setNewKey(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Generated Successfully</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-semibold">
              <span className="text-2xl">⚠️</span>
              <span>Please save this key now. For security reasons, you won't be able to view it again.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Key Name</Label>
              <p className="text-sm font-medium mt-1">{newKey?.name}</p>
            </div>
            <div>
              <Label>API Key</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 bg-black/50 px-4 py-3 rounded text-sm break-all font-mono">
                  {showKey ? newKey?.display_key : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(newKey?.display_key || "", "API Key");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Store this key securely in your backend environment variables</li>
                <li>• Never expose API keys in client-side code or public repositories</li>
                <li>• Use separate keys for different environments (dev, staging, production)</li>
                <li>• Rotate keys regularly for enhanced security</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setNewKey(null);
              setShowKey(false);
            }}>
              I've Saved My Key Securely
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!revokeKeyId} onOpenChange={() => setRevokeKeyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently deactivate this API key. Any applications using this key will no longer be able to authenticate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => revokeKeyId && revokeApiKey(revokeKeyId)}>
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
