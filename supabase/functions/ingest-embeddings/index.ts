import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateApiKey } from '../_shared/validateApiKey.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple k-means like clustering (using first 2 dimensions for simplicity)
function assignCluster(vector: number[]): string {
  if (vector.length < 2) return 'cluster_unknown';
  
  // Use first two dimensions to assign to quadrants
  const x = vector[0];
  const y = vector[1];
  
  if (x >= 0 && y >= 0) return 'cluster_a';
  if (x < 0 && y >= 0) return 'cluster_b';
  if (x < 0 && y < 0) return 'cluster_c';
  return 'cluster_d';
}

/**
 * PUBLIC_BETA mode flag
 * When true: API keys are optional but tracked if provided
 * When false: API keys are required for all requests
 */
const PUBLIC_BETA = Deno.env.get('MONAI_PUBLIC_BETA') === 'true';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Key Validation (required unless PUBLIC_BETA)
    const authHeader = req.headers.get('Authorization');
    const hasApiKey = authHeader && authHeader.startsWith('Bearer ');
    
    if (!PUBLIC_BETA && !hasApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'API key required. Provide via Authorization: Bearer <API_KEY>' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      project_id, 
      vectors,
      interaction_id,
      dataset_id,
    } = await req.json();

    if (!project_id || !vectors || !Array.isArray(vectors)) {
      throw new Error('Missing required fields: project_id, vectors (array)');
    }

    // Validate API key if provided
    if (hasApiKey) {
      const apiKey = authHeader!.replace('Bearer ', '');
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const validationResult = await validateApiKey(apiKey, project_id, 'write', clientIp);
      
      if (!validationResult.valid) {
        console.error('API key validation failed:', validationResult.error);
        return new Response(
          JSON.stringify({ success: false, error: validationResult.error }),
          { status: validationResult.statusCode || 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('API key validated successfully');
    }

    if (vectors.length > 1000) {
      throw new Error('Maximum 1000 vectors per request');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Process and store each vector
    const embeddingsToInsert = vectors.map((vector: number[]) => ({
      project_id,
      interaction_id: interaction_id || null,
      dataset_id: dataset_id || null,
      vector: vector,
      cluster_label: assignCluster(vector),
    }));

    const { data: embeddings, error: embeddingsError } = await supabase
      .from('monai_embedding_vectors')
      .insert(embeddingsToInsert)
      .select();

    if (embeddingsError) throw embeddingsError;

    // Calculate cluster statistics
    const clusterCounts: { [key: string]: number } = {};
    embeddingsToInsert.forEach(emb => {
      clusterCounts[emb.cluster_label] = (clusterCounts[emb.cluster_label] || 0) + 1;
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        vectors_stored: embeddings?.length || 0,
        cluster_distribution: clusterCounts,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ingest-embeddings:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
