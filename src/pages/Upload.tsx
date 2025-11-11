import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon } from "lucide-react";

const Upload = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [baselineId, setBaselineId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [baselineFile, setBaselineFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
        <h1 className="text-4xl font-bold mb-8">Upload CSV</h1>

        <Card className="max-w-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>CSV Drift Analysis</CardTitle>
            <CardDescription>
              Upload baseline and current datasets to analyze drift. Max 10MB each, ≤200 columns, ≤200k rows. Headers must match.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="baseline-id">Baseline ID</Label>
              <Input
                id="baseline-id"
                value={baselineId}
                onChange={(e) => setBaselineId(e.target.value)}
                placeholder="e.g., orders_2025_09"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-id">Current Dataset ID</Label>
              <Input
                id="current-id"
                value={currentId}
                onChange={(e) => setCurrentId(e.target.value)}
                placeholder="e.g., orders_2025_10_15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseline-file">Baseline CSV</Label>
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
                    {baselineFile ? baselineFile.name : 'Click to upload baseline CSV'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-file">Current CSV</Label>
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
                    {currentFile ? currentFile.name : 'Click to upload current CSV'}
                  </p>
                </label>
              </div>
            </div>

            <Button 
              onClick={handleAnalyze} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;
