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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Create demo project
    const { data: project, error: projectError } = await supabase
      .from('monai_projects')
      .insert({
        name: 'Demo Project',
        description: 'Explore MonAI with sample data',
        default_model_type: 'ml',
        is_demo: true
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create sample datasets
    const { data: baselineDataset } = await supabase
      .from('monai_datasets')
      .insert({
        project_id: project.id,
        name: 'support_tickets_sept',
        kind: 'baseline',
        source_type: 'file',
        row_count: 5000,
        schema_json: { features: ['priority', 'category', 'sentiment'] }
      })
      .select()
      .single();

    const { data: currentDataset } = await supabase
      .from('monai_datasets')
      .insert({
        project_id: project.id,
        name: 'support_tickets_oct',
        kind: 'current',
        source_type: 'file',
        row_count: 5200,
        schema_json: { features: ['priority', 'category', 'sentiment'] }
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({ success: true, project }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
