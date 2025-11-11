import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const [project, setProject] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [slackWebhook, setSlackWebhook] = useState("");
  const [dsiThreshold, setDsiThreshold] = useState("0.3");
  const [driftRatioThreshold, setDriftRatioThreshold] = useState("0.3");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      setProject(projectData);

      const { data: settingsData } = await supabase
        .from('project_settings')
        .select('*')
        .eq('project_id', projectId)
        .single();
      
      setSettings(settingsData);
      setSlackWebhook(settingsData?.slack_webhook_url || "");
      setDsiThreshold(settingsData?.dsi_threshold?.toString() || "0.3");
      setDriftRatioThreshold(settingsData?.drift_ratio_threshold?.toString() || "0.3");
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!projectId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('project_settings')
        .update({ 
          slack_webhook_url: slackWebhook,
          dsi_threshold: parseFloat(dsiThreshold),
          drift_ratio_threshold: parseFloat(driftRatioThreshold)
        })
        .eq('project_id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const webhookUrl = "https://api.monai.app/api/ingest";

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon AI
              </h1>
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link to="/webhook" className="text-muted-foreground hover:text-foreground transition-colors">
                Webhook
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="space-y-6 max-w-2xl">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project ID</CardTitle>
              <CardDescription>Use this ID when calling the webhook API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded border border-border text-sm">
                  {projectId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(projectId || '', 'Project ID')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Webhook URL</CardTitle>
              <CardDescription>
                Read-only endpoint for API calls. See <Link to="/webhook" className="text-primary hover:underline">webhook documentation</Link> for details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded border border-border text-sm">
                  POST {webhookUrl}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(webhookUrl, 'Webhook URL')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Slack Notifications</CardTitle>
              <CardDescription>
                Configure Slack webhook and drift detection thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                <Input
                  id="slack-webhook"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Create a webhook at <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Slack's webhook page</a>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dsi-threshold">DSI Threshold</Label>
                  <Input
                    id="dsi-threshold"
                    value={dsiThreshold}
                    onChange={(e) => setDsiThreshold(e.target.value)}
                    placeholder="0.3"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when DSI exceeds this value
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="drift-ratio-threshold">Drift Ratio Threshold</Label>
                  <Input
                    id="drift-ratio-threshold"
                    value={driftRatioThreshold}
                    onChange={(e) => setDriftRatioThreshold(e.target.value)}
                    placeholder="0.3"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when drift ratio exceeds this value
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{project?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {project ? new Date(project.created_at).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
