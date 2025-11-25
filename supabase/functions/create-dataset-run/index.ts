import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Create a new dataset run (drift comparison job)
 * 
 * POST /functions/v1/create-dataset-run
 * 
 * Body:
 *   {
 *     "project_id": "uuid",
 *     "baseline_dataset_id": "uuid",
 *     "current_dataset_id": "uuid",
 *     "label": "optional label"
 *   }
 * 
 * This creates a dataset_run with status 'pending' which will be processed
 * by the process-drift-runs admin job.
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

    const body = await req.json();
    const { project_id, baseline_dataset_id, current_dataset_id, label } = body;

    // Validate required fields
    if (!project_id) {
      return new Response(
        JSON.stringify({ error: "project_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!baseline_dataset_id || !current_dataset_id) {
      return new Response(
        JSON.stringify({ error: "Both baseline_dataset_id and current_dataset_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from("monai_projects")
      .select("id, name")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify datasets exist
    const { data: datasets, error: datasetsError } = await supabase
      .from("monai_datasets")
      .select("id, name, kind")
      .in("id", [baseline_dataset_id, current_dataset_id]);

    if (datasetsError || !datasets || datasets.length !== 2) {
      return new Response(
        JSON.stringify({ error: "One or both datasets not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create dataset run
    const { data: datasetRun, error: runError } = await supabase
      .from("dataset_runs")
      .insert({
        project_id,
        baseline_dataset_id,
        current_dataset_id,
        label: label || null,
        status: "pending",
      })
      .select()
      .single();

    if (runError) {
      console.error("Failed to create dataset run:", runError);
      return new Response(
        JSON.stringify({ error: "Failed to create dataset run" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log event
    await supabase
      .from("monai_events")
      .insert({
        project_id,
        event_type: "drift_run_created",
        payload_json: {
          dataset_run_id: datasetRun.id,
          baseline_dataset_id,
          current_dataset_id,
        },
      });

    console.log(`Created dataset run ${datasetRun.id} for project ${project_id}`);

    return new Response(
      JSON.stringify({
        status: "ok",
        dataset_run: datasetRun,
        message: "Dataset run created. Processing will begin shortly.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in create-dataset-run:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
