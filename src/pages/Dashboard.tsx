import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, Copy, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRuns: 0,
    avgDsi: 0,
    lastRunStatus: 'Healthy',
    topDriftedFeature: '-'
  });
  
  // CSV Upload state
  const [baselineId, setBaselineId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Report dialog state
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const [reportOpen, setReportOpen] = useState(false);

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

      // Load runs
      const { data: runsData } = await supabase
        .from('drift_runs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRuns(runsData || []);

      // Calculate stats
      if (runsData && runsData.length > 0) {
        const last10 = runsData.slice(0, 10);
        const avgDsi = last10.reduce((sum, r) => sum + parseFloat(String(r.dsi)), 0) / last10.length;
        
        const lastRun = runsData[0];
        const status = parseFloat(String(lastRun.dsi)) > 0.3 || parseFloat(String(lastRun.drift_ratio)) > 0.3 ? 'Attention' : 'Healthy';
        
        const topFeature = lastRun.drifted_features && Array.isArray(lastRun.drifted_features) && lastRun.drifted_features.length > 0 
          ? (lastRun.drifted_features[0] as any)[0]
          : '-';

        setStats({
          totalRuns: runsData.length,
          avgDsi: avgDsi,
          lastRunStatus: status,
          topDriftedFeature: topFeature
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
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

  const baseUrl = "https://api.monai.app";
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
          <div className="flex gap-4">
            <Link to={`/history?project_id=${projectId}`}>
              <Button variant="outline">View History</Button>
            </Link>
            <Link to={`/settings?project_id=${projectId}`}>
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="webhook">Webhook API</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription>Total Runs</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalRuns}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription>Avg DSI (Last 10)</CardDescription>
                  <CardTitle className="text-3xl">{stats.avgDsi.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription>Last Run Status</CardDescription>
                  <CardTitle>
                    <Badge variant={stats.lastRunStatus === 'Healthy' ? 'default' : 'destructive'}>
                      {stats.lastRunStatus}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardDescription>Top Drifted Feature</CardDescription>
                  <CardTitle className="text-2xl truncate">{stats.topDriftedFeature}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Runs</CardTitle>
                <CardDescription>Last 10 drift analysis runs</CardDescription>
              </CardHeader>
              <CardContent>
                {runs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No runs yet</p>
                    <p className="text-sm text-muted-foreground">Upload your first dataset using the CSV Upload tab</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {runs.map((run) => (
                      <div key={run.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{run.baseline_id} vs {run.dataset_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(run.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">DSI</p>
                            <Badge>{run.dsi}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Drift Ratio</p>
                            <Badge variant={parseFloat(String(run.drift_ratio)) > 0.3 ? 'destructive' : 'default'}>
                              {run.drift_ratio}
                            </Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRun(run);
                              setReportOpen(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Report
                          </Button>
                        </div>
                      </div>
                    ))}
                    {runs.length >= 10 && (
                      <Link to={`/history?project_id=${projectId}`}>
                        <Button variant="outline" className="w-full">View All History</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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

      {/* Detailed Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Drift Analysis Report
            </DialogTitle>
            <DialogDescription>
              Detailed analysis for run {selectedRun?.id?.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedRun && (
            <div className="space-y-6 pt-4">
              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {(parseFloat(String(selectedRun.dsi)) > 0.3 || parseFloat(String(selectedRun.drift_ratio)) > 0.3) ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Drift Detected
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        No Significant Drift
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Baseline Dataset</p>
                      <p className="font-medium">{selectedRun.baseline_id}</p>
                      <p className="text-sm text-muted-foreground">{selectedRun.reference_rows} rows</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Dataset</p>
                      <p className="font-medium">{selectedRun.dataset_id}</p>
                      <p className="text-sm text-muted-foreground">{selectedRun.current_rows} rows</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Run Time</p>
                    <p className="font-medium">{new Date(selectedRun.created_at).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Drift Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Drift Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Drift Score Index (DSI)</span>
                        <Badge variant={parseFloat(String(selectedRun.dsi)) > 0.3 ? 'destructive' : 'default'}>
                          {selectedRun.dsi}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${parseFloat(String(selectedRun.dsi)) > 0.3 ? 'bg-destructive' : 'bg-primary'}`}
                          style={{ width: `${Math.min(parseFloat(String(selectedRun.dsi)) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average drift score across all features. Values &gt; 0.3 indicate significant drift.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Drift Ratio</span>
                        <Badge variant={parseFloat(String(selectedRun.drift_ratio)) > 0.3 ? 'destructive' : 'default'}>
                          {selectedRun.drift_ratio}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${parseFloat(String(selectedRun.drift_ratio)) > 0.3 ? 'bg-destructive' : 'bg-primary'}`}
                          style={{ width: `${parseFloat(String(selectedRun.drift_ratio)) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Proportion of features with drift score &gt; 0.3. Higher values indicate more widespread drift.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Drifted Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Drifted Features</CardTitle>
                  <CardDescription>
                    Features showing the most significant distribution changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRun.drifted_features && Array.isArray(selectedRun.drifted_features) && selectedRun.drifted_features.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRun.drifted_features.map((feature: any, idx: number) => {
                        const [name, score] = feature;
                        return (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{name}</span>
                              <Badge variant={score > 0.3 ? 'destructive' : 'default'}>
                                {score}
                              </Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${score > 0.3 ? 'bg-destructive' : 'bg-primary'}`}
                                style={{ width: `${Math.min(score * 100, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {score > 0.5 ? 'High drift - significant distribution change detected' :
                               score > 0.3 ? 'Moderate drift - noticeable distribution change' :
                               'Low drift - minimal distribution change'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No drifted features detected</p>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Why did drift occur?</strong>
                    </p>
                    <p className="text-muted-foreground">
                      {parseFloat(String(selectedRun.dsi)) > 0.3 || parseFloat(String(selectedRun.drift_ratio)) > 0.3 ? (
                        <>
                          Drift was detected because {parseFloat(String(selectedRun.dsi)) > 0.3 && 'the average feature drift score exceeded the threshold'} 
                          {parseFloat(String(selectedRun.dsi)) > 0.3 && parseFloat(String(selectedRun.drift_ratio)) > 0.3 && ' and '}
                          {parseFloat(String(selectedRun.drift_ratio)) > 0.3 && 'too many features showed significant drift'}.
                          This indicates that the current data distribution has changed compared to your baseline training data.
                        </>
                      ) : (
                        'No significant drift was detected. The current data distribution is consistent with your baseline training data.'
                      )}
                    </p>
                    <p className="mt-4">
                      <strong>What does this mean?</strong>
                    </p>
                    <p className="text-muted-foreground">
                      {parseFloat(String(selectedRun.dsi)) > 0.3 || parseFloat(String(selectedRun.drift_ratio)) > 0.3 ? (
                        <>
                          Your model may not perform as well on the current data as it did on the training data. 
                          Consider retraining your model with recent data or investigating the causes of drift in the top drifted features.
                        </>
                      ) : (
                        'Your model should continue to perform well on this data, as it closely matches the training distribution.'
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
