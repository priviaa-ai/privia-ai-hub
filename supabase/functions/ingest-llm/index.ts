import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * LLM Interaction Ingestion Endpoint
 * 
 * POST /functions/v1/ingest-llm
 * 
 * Headers:
 *   Authorization: Bearer <MONAI_API_KEY>
 *   Content-Type: application/json
 * 
 * Body:
 *   {
 *     "user_query": "string (required)",
 *     "model_output": "string (required)",
 *     "confidence": number (optional, 0-1),
 *     "metadata": object (optional)
 *   }
 * 
 * This is a PUBLIC ingestion endpoint. API key auth is used to identify the project.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hash function for API key validation
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Validate API key and get project
async function getProjectFromApiKey(supabase: any, authHeader: string | null): Promise<{ projectId: string | null; error: string | null }> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { projectId: null, error: "Missing or invalid Authorization header" };
  }

  const apiKey = authHeader.substring(7);
  
  // Check if it's a MonAI API key format
  if (!apiKey.startsWith("mon_")) {
    return { projectId: null, error: "Invalid API key format" };
  }

  const hashedKey = await hashKey(apiKey);

  // Look up the API key
  const { data: keyData, error: keyError } = await supabase
    .from("monai_api_keys")
    .select("project_id, is_active, expires_at")
    .or(`hashed_key.eq.${hashedKey},key_hash.eq.${hashedKey}`)
    .maybeSingle();

  if (keyError || !keyData) {
    console.log("API key lookup failed:", keyError?.message || "Key not found");
    return { projectId: null, error: "Invalid API key" };
  }

  if (!keyData.is_active) {
    return { projectId: null, error: "API key is inactive" };
  }

  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return { projectId: null, error: "API key has expired" };
  }

  // Update last_used_at
  await supabase
    .from("monai_api_keys")
    .update({ last_used_at: new Date().toISOString(), usage_count: (keyData.usage_count || 0) + 1 })
    .or(`hashed_key.eq.${hashedKey},key_hash.eq.${hashedKey}`);

  return { projectId: keyData.project_id, error: null };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate API key
    const authHeader = req.headers.get("authorization");
    const { projectId, error: authError } = await getProjectFromApiKey(supabase, authHeader);

    if (authError || !projectId) {
      return new Response(
        JSON.stringify({ error: authError || "Authentication failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { user_query, model_output, confidence, metadata } = body;

    // Validate required fields
    if (!user_query || typeof user_query !== "string") {
      return new Response(
        JSON.stringify({ error: "user_query is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!model_output || typeof model_output !== "string") {
      return new Response(
        JSON.stringify({ error: "model_output is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert LLM interaction
    const { data: interaction, error: insertError } = await supabase
      .from("monai_llm_interactions")
      .insert({
        project_id: projectId,
        input_text: user_query,
        output_text: model_output,
        confidence: confidence ?? null,
        metadata_json: metadata ?? {},
        status: "pending_score",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to insert LLM interaction:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store interaction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also insert into events/logs table for the Logs UI
    await supabase
      .from("monai_events")
      .insert({
        project_id: projectId,
        event_type: "llm_interaction",
        payload_json: {
          interaction_id: interaction.id,
          user_query_preview: user_query.substring(0, 100),
          model: metadata?.model || "unknown",
          channel: metadata?.channel || "api",
        },
      });

    console.log(`LLM interaction ingested for project ${projectId}, interaction ID: ${interaction.id}`);

    return new Response(
      JSON.stringify({ 
        status: "ok", 
        interaction_id: interaction.id,
        message: "Interaction logged successfully. Hallucination scoring is pending."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ingest-llm:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
