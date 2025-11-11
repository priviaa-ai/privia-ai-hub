import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, Copy } from "lucide-react";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  
  // CSV Upload state
  const [baselineId, setBaselineId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!baselineId || !currentId || !baselineFile || !currentFile) {
      toast({
        title: "Error",
        description: "Please fill all fields and upload both CSV files",
        variant: "destructive",
      });
      return;
    }

    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('baseline_id', baselineId);
      formData.append('current_id', currentId);
      formData.append('baseline_file', baselineFile);
      formData.append('current_file', currentFile);

      const { data, error } = await supabase.functions.invoke('ingest', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Analysis complete! DSI: ${data.dsi}, Drift Ratio: ${data.drift_ratio}`,
      });

      // Reset form
      setBaselineId("");
      setCurrentId("");
      setBaselineFile(null);
      setCurrentFile(null);

      // Navigate to history
      setTimeout(() => {
        navigate(`/history?project_id=${projectId}`);
      }, 1500);

    } catch (error: any) {
      console.error('Error analyzing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze CSVs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const baseUrl = window.location.origin;
  const curlExample = `curl -X POST "${baseUrl}/api/ingest" \\
  -F project_id=${projectId || '<PROJECT_UUID>'} \\
  -F baseline_id=training_dataset_v1 \\
  -F current_id=current_dataset \\
  -F baseline_file=@training.csv \\
  -F current_file=@current.csv`;

  if (!projectId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No project selected</p>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{project?.name || 'Dashboard'}</h1>
          <Link to={`/history?project_id=${projectId}`}>
            <Button variant="outline">View History</Button>
          </Link>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="webhook">Webhook API</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="max-w-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>CSV Drift Analysis</CardTitle>
                <CardDescription>
                  Upload training dataset (baseline) and current dataset to analyze drift. Max 10MB each, ≤200 columns, ≤200k rows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="baseline-id">Training Dataset ID</Label>
                  <Input
                    id="baseline-id"
                    value={baselineId}
                    onChange={(e) => setBaselineId(e.target.value)}
                    placeholder="e.g., training_dataset_v1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-id">Current Dataset ID</Label>
                  <Input
                    id="current-id"
                    value={currentId}
                    onChange={(e) => setCurrentId(e.target.value)}
                    placeholder="e.g., current_dataset"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseline-file">Training Dataset CSV</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Input
                      id="baseline-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setBaselineFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="baseline-file" className="cursor-pointer">
                      <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {baselineFile ? baselineFile.name : 'Click to upload training dataset CSV'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-file">Current Dataset CSV</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Input
                      id="current-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCurrentFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="current-file" className="cursor-pointer">
                      <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {currentFile ? currentFile.name : 'Click to upload current dataset CSV'}
                      </p>
                    </label>
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Drift'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="mt-6">
            <div className="space-y-6 max-w-4xl">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>Send your data via HTTP and get drift metrics instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Copy Your Project ID</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your project ID is: <code className="bg-muted px-2 py-1 rounded">{projectId}</code>
                      </p>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(projectId || '')}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy ID
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Send a POST Request</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your training dataset (baseline) and current dataset CSV files using multipart/form-data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Get Drift Metrics</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive DSI, drift ratio, and top drifted features. Slack alerts sent automatically when drift is detected.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Endpoint</CardTitle>
                  <CardDescription>POST to this URL with multipart/form-data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-muted rounded border border-border text-sm">
                      POST {baseUrl}/api/ingest
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`POST ${baseUrl}/api/ingest`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>cURL Example</CardTitle>
                  <CardDescription>Copy and replace with your values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded border border-border overflow-x-auto text-sm">
                      <code>{curlExample}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(curlExample)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">project_id</code>
                      <span className="ml-2 text-muted-foreground">(required) Your project UUID</span>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">baseline_id</code>
                      <span className="ml-2 text-muted-foreground">(required) Training dataset identifier</span>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">current_id</code>
                      <span className="ml-2 text-muted-foreground">(required) Current dataset identifier</span>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">baseline_file</code>
                      <span className="ml-2 text-muted-foreground">(required) Training CSV file</span>
                    </div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">current_file</code>
                      <span className="ml-2 text-muted-foreground">(required) Current CSV file</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Max file size: 10MB per file</li>
                    <li>• Max columns: 200</li>
                    <li>• Max rows: 200,000</li>
                    <li>• CSV headers must match exactly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
