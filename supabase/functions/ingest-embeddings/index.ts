import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      project_id, 
      vectors,
      interaction_id,
      dataset_id,
    } = await req.json();

    if (!project_id || !vectors || !Array.isArray(vectors)) {
      throw new Error('Missing required fields: project_id, vectors (array)');
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ingest-embeddings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
