import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
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
  prefix: string;
  last_four: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
  environment: string;
}

export default function ProjectSettings() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<{ display_key: string; name: string } | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadApiKeys();
    }
  }, [projectId]);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('api-keys-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      if (error) throw error;
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
      const { data, error } = await supabase.functions.invoke('api-keys-create', {
        body: {
          project_id: projectId,
          name: keyName || 'API Key',
        },
      });

      if (error) throw error;

      setNewKey({
        display_key: data.display_key,
        name: data.name,
      });
      setKeyName("");
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
      const { error } = await supabase.functions.invoke('api-keys-revoke', {
        body: { key_id: keyId },
      });

      if (error) throw error;

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
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for authenticating requests to MonAI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="keyName">Key Name (Optional)</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Backend"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createApiKey} disabled={creating}>
              {creating ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show New Key Dialog */}
      <Dialog open={!!newKey} onOpenChange={() => setNewKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription className="text-yellow-500 font-semibold">
              ⚠️ Copy this key now. You will not be able to see it again!
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
                <code className="flex-1 bg-black/50 px-4 py-2 rounded text-sm break-all">
                  {showKey ? newKey?.display_key : '••••••••••••••••••••••••••••••••'}
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
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setNewKey(null);
              setShowKey(false);
            }}>
              I've Saved My Key
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
