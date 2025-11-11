import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const History = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadRuns();
    }
  }, [projectId]);

  const loadRuns = async () => {
    try {
      const { data } = await supabase
        .from('drift_runs')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      setRuns(data || []);
    } catch (error) {
      console.error('Error loading runs:', error);
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
        <h1 className="text-4xl font-bold mb-8">Run History</h1>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Drift Analysis Runs</CardTitle>
            <CardDescription>Complete history of drift analyses for this project</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : runs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No runs yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created</TableHead>
                    <TableHead>Baseline ID</TableHead>
                    <TableHead>Dataset ID</TableHead>
                    <TableHead>DSI</TableHead>
                    <TableHead>Drift Ratio</TableHead>
                    <TableHead>Drifted Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>{new Date(run.created_at).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{run.baseline_id}</TableCell>
                      <TableCell className="font-medium">{run.dataset_id}</TableCell>
                      <TableCell>
                        <Badge>{run.dsi}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={run.drift_ratio > 0.3 ? 'destructive' : 'default'}>
                          {run.drift_ratio}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {run.drifted_features && run.drifted_features.length > 0
                            ? run.drifted_features.map((f: any) => f[0]).join(', ')
                            : '-'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
