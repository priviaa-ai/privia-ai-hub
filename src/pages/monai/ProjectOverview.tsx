import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { MetricCard } from "@/components/monai/MetricCard";
import { GlassCard } from "@/components/monai/GlassCard";
import { StatusPill } from "@/components/monai/StatusPill";
import { Button } from "@/components/ui/button";
import { Settings, AlertCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  triggered_at: string;
  status: string;
}

interface DriftRun {
  id: string;
  dsi: number;
  drift_ratio: number;
  status: string;
  created_at: string;
}

export default function ProjectOverview() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [driftRuns, setDriftRuns] = useState<DriftRun[]>([]);
  const [llmCount, setLlmCount] = useState(0);
  const [avgHallucination, setAvgHallucination] = useState(0);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    // Load project
    const { data: projectData } = await supabase
      .from('monai_projects')
      .select('*')
      .eq('id', projectId)
      .single();
    setProject(projectData);

    // Load alerts
    const { data: alertsData } = await supabase
      .from('monai_alerts')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'open')
      .order('triggered_at', { ascending: false })
      .limit(5);
    setAlerts(alertsData || []);

    // Load drift runs
    const { data: runsData } = await supabase
      .from('monai_drift_runs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10);
    setDriftRuns(runsData || []);

    // Load LLM stats
    const { count } = await supabase
      .from('monai_llm_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    setLlmCount(count || 0);

    const { data: llmData } = await supabase
      .from('monai_llm_interactions')
      .select('hallucination_score')
      .eq('project_id', projectId)
      .not('hallucination_score', 'is', null);
    
    if (llmData && llmData.length > 0) {
      const avg = llmData.reduce((sum, row) => sum + (row.hallucination_score || 0), 0) / llmData.length;
      setAvgHallucination(avg);
    }
  };

  const latestDriftRun = driftRuns[0];
  const hasData = latestDriftRun || llmCount > 0;
  const reliabilityScore = latestDriftRun 
    ? Math.max(0, 100 - latestDriftRun.dsi - (avgHallucination * 50))
    : null;

  // Chart data
  const chartData = driftRuns.slice(0, 7).reverse().map(run => ({
    date: new Date(run.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    dsi: run.dsi,
  }));

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <PageHeader
          title={project?.name || "Demo Project"}
          subtitle={project?.description || "Overview of your AI reliability metrics"}
          actions={
            <>
              <Link to={`/monai/projects/${projectId}/llm`}>
                <Button variant="outline">
                  LLM Dashboard
                </Button>
              </Link>
              <Link to={`/monai/projects/${projectId}/settings`}>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </>
          }
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Reliability Score"
            value={reliabilityScore !== null ? Math.round(reliabilityScore) : "-"}
            badge={reliabilityScore !== null && reliabilityScore > 90 ? "Healthy" : undefined}
            trend={reliabilityScore !== null && reliabilityScore > 90 ? "up" : "neutral"}
            trendValue={reliabilityScore !== null && reliabilityScore > 90 ? "+2%" : ""}
          />
          <MetricCard
            label="Drift Score"
            value={latestDriftRun?.dsi || "-"}
            trend={latestDriftRun && latestDriftRun.dsi < 30 ? "down" : "neutral"}
            trendValue={latestDriftRun ? "-5" : ""}
          />
          <MetricCard
            label="Hallucination Index"
            value={avgHallucination > 0 ? (avgHallucination * 100).toFixed(0) + "%" : "-"}
            trend="neutral"
            trendValue=""
          />
          <MetricCard
            label="24h Volume"
            value={llmCount}
            trend={llmCount > 0 ? "up" : "neutral"}
            trendValue={llmCount > 0 ? `+${llmCount}` : ""}
          />
        </div>

        {/* DSI Trend Chart */}
        {chartData.length > 0 && (
          <GlassCard className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Drift Trend (Last 7 Runs)</h2>
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

        {/* Recent Incidents */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Alerts</h2>
            {alerts.length === 0 && (
              <StatusPill variant="healthy">All Clear</StatusPill>
            )}
          </div>
          
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-destructive' : 'text-warning'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <StatusPill variant={alert.severity === 'critical' ? 'critical' : 'attention'}>
                        {alert.severity}
                      </StatusPill>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.triggered_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active alerts</p>
          )}
        </GlassCard>

        {/* Recent Drift Runs */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Drift Runs</h2>
            <Link to={`/monai/projects/${projectId}/drift`}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {driftRuns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3">Date</th>
                    <th className="text-right py-3">DSI</th>
                    <th className="text-right py-3">Drift Ratio</th>
                    <th className="text-center py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {driftRuns.slice(0, 5).map((run) => (
                    <tr key={run.id} className="border-b border-white/5">
                      <td className="py-3">
                        {new Date(run.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right font-medium">{run.dsi}</td>
                      <td className="py-3 text-right">
                        {Math.round(run.drift_ratio * 100)}%
                      </td>
                      <td className="py-3 text-center">
                        <StatusPill variant={
                          run.status === 'completed' ? 'healthy' : 
                          run.status === 'failed' ? 'critical' : 'info'
                        }>
                          {run.status}
                        </StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No drift runs yet</p>
                <Link to={`/monai/projects/${projectId}/drift`}>
                  <Button>Run Drift Analysis</Button>
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
