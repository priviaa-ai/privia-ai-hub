import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Get project metrics (overview dashboard data)
 * 
 * GET /functions/v1/project-metrics?project_id=<uuid>
 * 
 * Returns computed metrics for the project dashboard:
 * - Reliability score
 * - Drift score (latest DSI)
 * - Hallucination index (7-day average)
 * - 24h volume
 * - Drift trend (last 7 runs)
 * - Recent alerts
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const projectId = url.searchParams.get("project_id");

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "project_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get project
    const { data: project, error: projectError } = await supabase
      .from("monai_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get latest drift run
    const { data: latestDriftRun } = await supabase
      .from("monai_drift_runs")
      .select("dsi, drift_ratio, created_at")
      .eq("project_id", projectId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get last 7 drift runs for trend
    const { data: driftTrend } = await supabase
      .from("monai_drift_runs")
      .select("dsi, created_at")
      .eq("project_id", projectId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(7);

    // Get 7-day hallucination summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const { data: hallucinationSummary } = await supabase
      .from("llm_summary_daily")
      .select("avg_hallucination_score, high_hallucination_fraction, total_events, high_events, date")
      .eq("project_id", projectId)
      .gte("date", sevenDaysAgoStr)
      .order("date", { ascending: false });

    // Calculate 7-day average hallucination
    let avgHallucination = 0;
    if (hallucinationSummary && hallucinationSummary.length > 0) {
      const totalScore = hallucinationSummary.reduce((sum, s) => sum + (s.avg_hallucination_score || 0), 0);
      avgHallucination = totalScore / hallucinationSummary.length;
    }

    // Get 24h volume (LLM interactions)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: volume24h } = await supabase
      .from("monai_llm_interactions")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId)
      .gte("created_at", twentyFourHoursAgo);

    // Get recent alerts
    const { data: recentAlerts } = await supabase
      .from("monai_alerts")
      .select("id, type, severity, title, message, triggered_at")
      .eq("project_id", projectId)
      .order("triggered_at", { ascending: false })
      .limit(5);

    // Calculate reliability score
    // Formula: 100 - (dsi * 50) - (avgHallucination * 50)
    const dsi = latestDriftRun?.dsi || 0;
    const reliabilityScore = Math.max(0, Math.min(100, 100 - (dsi * 50) - (avgHallucination * 50)));

    const metrics = {
      project: {
        id: project.id,
        name: project.name,
        dsi_threshold: project.dsi_threshold,
        hallucination_threshold: project.hallucination_threshold,
      },
      reliability_score: Math.round(reliabilityScore),
      drift_score: Math.round(dsi * 100),
      hallucination_index: Math.round(avgHallucination * 100),
      volume_24h: volume24h || 0,
      latest_drift: latestDriftRun ? {
        dsi: latestDriftRun.dsi,
        drift_ratio: latestDriftRun.drift_ratio,
        created_at: latestDriftRun.created_at,
      } : null,
      drift_trend: (driftTrend || []).reverse().map(d => ({
        dsi: d.dsi,
        date: d.created_at,
      })),
      hallucination_trend: (hallucinationSummary || []).reverse().map(s => ({
        avg_score: s.avg_hallucination_score,
        high_fraction: s.high_hallucination_fraction,
        total_events: s.total_events,
        date: s.date,
      })),
      recent_alerts: recentAlerts || [],
    };

    return new Response(
      JSON.stringify(metrics),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in project-metrics:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
