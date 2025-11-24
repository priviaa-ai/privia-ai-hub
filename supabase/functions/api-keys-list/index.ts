import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const project_id = url.searchParams.get('project_id');

    if (!project_id) {
      throw new Error('project_id query parameter is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all API keys for the project
    const { data: apiKeys, error } = await supabase
      .from('monai_api_keys')
      .select('id, name, description, prefix, last_four, created_at, last_used_at, is_active, environment, permissions, expires_at, usage_count')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    console.log(`Listed ${apiKeys?.length || 0} API keys for project ${project_id}`);

    // Return keys with safe metadata only (no hashed_key, no full key)
    return new Response(
      JSON.stringify({ keys: apiKeys || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in api-keys-list:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});