import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Embedding Ingestion Endpoint
 * 
 * POST /functions/v1/ingest-embedding
 * 
 * Headers:
 *   Authorization: Bearer <MONAI_API_KEY>
 *   Content-Type: application/json
 * 
 * Body:
 *   {
 *     "vector": [0.1, 0.2, ...] (array of numbers),
 *     "label": "optional label",
 *     "metadata": { ... } optional metadata
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
  
  if (!apiKey.startsWith("mon_")) {
    return { projectId: null, error: "Invalid API key format" };
  }

  const hashedKey = await hashKey(apiKey);

  const { data: keyData, error: keyError } = await supabase
    .from("monai_api_keys")
    .select("project_id, is_active, expires_at")
    .or(`hashed_key.eq.${hashedKey},key_hash.eq.${hashedKey}`)
    .maybeSingle();

  if (keyError || !keyData) {
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

    const body = await req.json();
    const { vector, label, metadata } = body;

    // Validate vector
    if (!vector || !Array.isArray(vector)) {
      return new Response(
        JSON.stringify({ error: "vector is required and must be an array of numbers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!vector.every(v => typeof v === "number")) {
      return new Response(
        JSON.stringify({ error: "vector must contain only numbers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert embedding
    const { data: embedding, error: insertError } = await supabase
      .from("monai_embedding_vectors")
      .insert({
        project_id: projectId,
        vector: vector,
        cluster_label: label || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to insert embedding:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store embedding" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log event
    await supabase
      .from("monai_events")
      .insert({
        project_id: projectId,
        event_type: "embedding_ingested",
        payload_json: {
          embedding_id: embedding.id,
          vector_dimensions: vector.length,
          label: label || null,
        },
      });

    console.log(`Embedding ingested for project ${projectId}, ID: ${embedding.id}, dimensions: ${vector.length}`);

    return new Response(
      JSON.stringify({
        status: "ok",
        embedding_id: embedding.id,
        dimensions: vector.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in ingest-embedding:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
