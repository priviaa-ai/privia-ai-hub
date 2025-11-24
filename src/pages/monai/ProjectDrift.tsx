import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { MetricCard } from "@/components/monai/MetricCard";
import { StatusPill } from "@/components/monai/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import emptyDriftImage from "@/assets/empty-drift.png";

interface Dataset {
  id: string;
  name: string;
  kind: string;
  row_count: number;
  created_at: string;
}

interface DriftRun {
  id: string;
  dsi: number;
  drift_ratio: number;
  status: string;
  summary: string;
  created_at: string;
  baseline_dataset_id: string;
  current_dataset_id: string;
}

interface FeatureMetric {
  feature_name: string;
  feature_type: string;
  psi: number | null;
  kl_divergence: number | null;
  drift_flag: boolean;
}

export default function ProjectDrift() {
  const { projectId } = useParams();
  const { toast } = useToast();
  
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [driftRuns, setDriftRuns] = useState<DriftRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<DriftRun | null>(null);
  const [featureMetrics, setFeatureMetrics] = useState<FeatureMetric[]>([]);
  
  const [baselineId, setBaselineId] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadKind, setUploadKind] = useState<"baseline" | "current">("baseline");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadDatasets();
      loadDriftRuns();
    }
  }, [projectId]);

  const loadDatasets = async () => {
    const { data, error } = await supabase
      .from('monai_datasets')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDatasets(data);
    }
  };

  const loadDriftRuns = async () => {
    const { data, error } = await supabase
      .from('monai_drift_runs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDriftRuns(data);
      if (data.length > 0) {
        selectRun(data[0]);
      }
    }
  };

  const selectRun = async (run: DriftRun) => {
    setSelectedRun(run);
    
    // Load feature metrics
    const { data, error } = await supabase
      .from('monai_drift_feature_metrics')
      .select('*')
      .eq('drift_run_id', run.id);

    if (!error && data) {
      setFeatureMetrics(data);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadName || !projectId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('project_id', projectId);
      formData.append('name', uploadName);
      formData.append('kind', uploadKind);

      const { data, error } = await supabase.functions.invoke('upload-dataset', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Dataset uploaded",
        description: `${data.row_count} rows, ${data.column_count} columns`,
      });

      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadName("");
      loadDatasets();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!baselineId || !currentId || !projectId) {
      toast({
        title: "Error",
        description: "Please select both baseline and current datasets",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    try {
      // Fetch dataset data from events
      const { data: baselineEvent } = await supabase
        .from('monai_events')
        .select('payload_json')
        .eq('event_type', 'dataset_uploaded')
        .eq('payload_json->>dataset_id', baselineId)
        .single();

      const { data: currentEvent } = await supabase
        .from('monai_events')
        .select('payload_json')
        .eq('event_type', 'dataset_uploaded')
        .eq('payload_json->>dataset_id', currentId)
        .single();

      if (!baselineEvent || !currentEvent) {
        throw new Error('Dataset data not found');
      }

      const { data, error } = await supabase.functions.invoke('analyze-drift', {
        body: {
          project_id: projectId,
          baseline_dataset_id: baselineId,
          current_dataset_id: currentId,
          baseline_data: (baselineEvent.payload_json as any).data,
          current_data: (currentEvent.payload_json as any).data,
        },
      });

      if (error) throw error;

      toast({
        title: "Analysis complete",
        description: `DSI: ${data.dsi}, ${Math.round(data.drift_ratio * 100)}% features drifted`,
      });

      loadDriftRuns();
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const baselineDatasets = datasets.filter(d => d.kind === 'baseline');
  const currentDatasets = datasets.filter(d => d.kind === 'current');

  // Chart data
  const chartData = driftRuns.slice(0, 10).reverse().map(run => ({
    date: new Date(run.created_at).toLocaleDateString(),
    dsi: run.dsi,
  }));

  return (
    <>
      <Navigation />
      <ProjectTabs />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <PageHeader
          title="Drift Dashboard"
          subtitle="Monitor data and model drift across your datasets"
          showBack={true}
          backTo="/monai/projects"
        />

        {/* Controls */}
        <GlassCard className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Baseline Dataset</Label>
              <Select value={baselineId} onValueChange={setBaselineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select baseline" />
                </SelectTrigger>
                <SelectContent>
                  {baselineDatasets.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Current Dataset</Label>
              <Select value={currentId} onValueChange={setCurrentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current" />
                </SelectTrigger>
                <SelectContent>
                  {currentDatasets.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button 
                onClick={handleRunAnalysis} 
                disabled={!baselineId || !currentId || analyzing}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                {analyzing ? 'Analyzing...' : 'Run Analysis'}
              </Button>
              
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Dataset</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Dataset Name</Label>
                      <Input
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g., production_data_jan"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={uploadKind} onValueChange={(v: any) => setUploadKind(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baseline">Baseline</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>CSV File</Label>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!uploadFile || !uploadName || uploading}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </GlassCard>

        {/* Metrics */}
        {selectedRun && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                label="Drift Severity Index"
                value={selectedRun.dsi}
                badge={selectedRun.dsi > 50 ? "High" : "Normal"}
              />
              <MetricCard
                label="Drift Ratio"
                value={`${Math.round(selectedRun.drift_ratio * 100)}%`}
              />
              <MetricCard
                label="Drifted Features"
                value={featureMetrics.filter(m => m.drift_flag).length}
              />
            </div>

            {/* DSI Trend */}
            {chartData.length > 1 && (
              <GlassCard className="p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">DSI Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="dsi" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            )}

            {/* Feature Metrics Table */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4">Feature Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3">Feature</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-right py-3">PSI</th>
                      <th className="text-right py-3">KL Div</th>
                      <th className="text-center py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureMetrics.map((metric, idx) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="py-3 font-medium">{metric.feature_name}</td>
                        <td className="py-3 text-muted-foreground capitalize">{metric.feature_type}</td>
                        <td className="py-3 text-right">
                          {metric.psi !== null ? metric.psi.toFixed(3) : '-'}
                        </td>
                        <td className="py-3 text-right">
                          {metric.kl_divergence !== null ? metric.kl_divergence.toFixed(3) : '-'}
                        </td>
                        <td className="py-3 text-center">
                          <StatusPill variant={metric.drift_flag ? "attention" : "healthy"}>
                            {metric.drift_flag ? "Drifted" : "Stable"}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}

        {!selectedRun && driftRuns.length === 0 && (
          <GlassCard className="p-12 text-center">
            <img
              src={emptyDriftImage}
              alt="No drift runs"
              className="mx-auto mb-6 w-80 h-48 object-contain opacity-60"
            />
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Drift Runs Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload datasets and run your first drift analysis to get started.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
