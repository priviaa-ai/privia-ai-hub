import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const [project, setProject] = useState<any>(null);
  const [runs, setRuns] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRuns: 0,
    avgDsi: 0,
    lastRunStatus: 'Healthy',
    topDriftedFeature: '-'
  });

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      // Load project
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
        .limit(5);

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
            <Link to={`/upload?project_id=${projectId}`}>
              <Button>Upload CSV</Button>
            </Link>
            <Link to={`/history?project_id=${projectId}`}>
              <Button variant="outline">View History</Button>
            </Link>
            <Link to={`/settings?project_id=${projectId}`}>
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

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
            <CardDescription>Last 5 drift analysis runs</CardDescription>
          </CardHeader>
          <CardContent>
            {runs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No runs yet</p>
                <Link to={`/upload?project_id=${projectId}`}>
                  <Button>Upload CSV</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {runs.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{run.baseline_id} vs {run.dataset_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(run.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">DSI</p>
                        <Badge>{run.dsi}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Drift Ratio</p>
                        <Badge variant={run.drift_ratio > 0.3 ? 'destructive' : 'default'}>
                          {run.drift_ratio}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to={`/history?project_id=${projectId}`}>
                  <Button variant="outline" className="w-full">View All</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
