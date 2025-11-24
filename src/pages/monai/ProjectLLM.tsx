import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { MetricCard } from "@/components/monai/MetricCard";
import { GlassCard } from "@/components/monai/GlassCard";
import { StatusPill } from "@/components/monai/StatusPill";
import { Sparkles, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import emptyLlmImage from "@/assets/empty-llm.png";

interface LLMInteraction {
  id: string;
  input_text: string;
  output_text: string;
  hallucination_score: number | null;
  tone: string | null;
  safety_flags_json: any;
  created_at: string;
  metadata_json: any;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'];

export default function ProjectLLM() {
  const { projectId } = useParams();
  const [interactions, setInteractions] = useState<LLMInteraction[]>([]);
  const [avgHallucination, setAvgHallucination] = useState(0);
  const [safetyIncidents, setSafetyIncidents] = useState(0);

  useEffect(() => {
    if (projectId) {
      loadInteractions();
    }
  }, [projectId]);

  const loadInteractions = async () => {
    const { data, error } = await supabase
      .from('monai_llm_interactions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setInteractions(data);
      
      // Calculate average hallucination score
      const scores = data.filter(i => i.hallucination_score !== null);
      if (scores.length > 0) {
        const avg = scores.reduce((sum, i) => sum + (i.hallucination_score || 0), 0) / scores.length;
        setAvgHallucination(avg);
      }

      // Count safety incidents
      const incidents = data.filter(i => {
        const flags = i.safety_flags_json as any;
        return flags?.toxic || flags?.pii || flags?.profanity;
      });
      setSafetyIncidents(incidents.length);
    }
  };

  // Trend data for last 7 days
  const trendData = (() => {
    const last7Days: { [key: string]: { total: number; sumScore: number } } = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days[key] = { total: 0, sumScore: 0 };
    }

    interactions.forEach(interaction => {
      const date = new Date(interaction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (last7Days[date]) {
        last7Days[date].total++;
        last7Days[date].sumScore += interaction.hallucination_score || 0;
      }
    });

    return Object.entries(last7Days).map(([date, data]) => ({
      date,
      score: data.total > 0 ? (data.sumScore / data.total) * 100 : 0,
    }));
  })();

  // Tone distribution
  const toneData = (() => {
    const distribution: { [key: string]: number } = {};
    interactions.forEach(i => {
      const tone = i.tone || 'unknown';
      distribution[tone] = (distribution[tone] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  })();

  return (
    <>
      <Navigation />
      <ProjectTabs />
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <PageHeader
          title="LLM Behavior Dashboard"
          subtitle="Monitor hallucinations, tone, and safety across LLM interactions"
          showBack={true}
          backTo="/monai/projects"
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            label="Avg Hallucination Score"
            value={`${(avgHallucination * 100).toFixed(1)}%`}
            badge={avgHallucination < 0.2 ? "Healthy" : "Attention"}
          />
          <MetricCard
            label="Safety Incidents (7d)"
            value={safetyIncidents}
            badge={safetyIncidents === 0 ? "Safe" : "Review"}
          />
          <MetricCard
            label="Total Interactions"
            value={interactions.length}
          />
        </div>

        {/* Hallucination Trend */}
        <GlassCard className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hallucination Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
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
              <Line type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tone Distribution */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tone Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={toneData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {toneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Safety Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">PII Detected</span>
                <StatusPill variant={interactions.filter(i => (i.safety_flags_json as any)?.pii).length === 0 ? "healthy" : "attention"}>
                  {interactions.filter(i => (i.safety_flags_json as any)?.pii).length}
                </StatusPill>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Toxic Content</span>
                <StatusPill variant={interactions.filter(i => (i.safety_flags_json as any)?.toxic).length === 0 ? "healthy" : "critical"}>
                  {interactions.filter(i => (i.safety_flags_json as any)?.toxic).length}
                </StatusPill>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">High Hallucination (&gt;50%)</span>
                <StatusPill variant={interactions.filter(i => (i.hallucination_score || 0) > 0.5).length === 0 ? "healthy" : "attention"}>
                  {interactions.filter(i => (i.hallucination_score || 0) > 0.5).length}
                </StatusPill>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Interactions */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Interactions</h2>
          
          {interactions.length > 0 ? (
            <div className="space-y-4">
              {interactions.slice(0, 10).map((interaction) => (
                <div key={interaction.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(interaction.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {interaction.hallucination_score !== null && interaction.hallucination_score > 0.3 && (
                        <StatusPill variant="attention">
                          {(interaction.hallucination_score * 100).toFixed(0)}% hallucination
                        </StatusPill>
                      )}
                      {interaction.tone && (
                        <StatusPill variant="info">
                          {interaction.tone}
                        </StatusPill>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground">User Query:</span>
                      <p className="text-sm mt-1">{interaction.input_text.substring(0, 150)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Model Output:</span>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {interaction.output_text.substring(0, 150)}
                        {interaction.output_text.length > 150 && '...'}
                      </p>
                    </div>
                  </div>

                  {((interaction.safety_flags_json as any)?.pii || (interaction.safety_flags_json as any)?.toxic) && (
                    <div className="mt-2 flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs">Safety flags detected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img
                src={emptyLlmImage}
                alt="No LLM interactions"
                className="mx-auto mb-6 w-80 h-48 object-contain opacity-60"
              />
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No LLM Interactions Yet</h3>
              <p className="text-muted-foreground">
                Start logging interactions via the ingestion API to see them here.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
