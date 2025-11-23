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
        schema_json: { features: [
          { name: 'priority', type: 'categorical', sample_values: ['high', 'medium', 'low'] },
          { name: 'category', type: 'categorical', sample_values: ['billing', 'technical', 'account'] },
          { name: 'sentiment', type: 'numeric', sample_values: [0.2, 0.5, 0.8] }
        ]}
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
        schema_json: { features: [
          { name: 'priority', type: 'categorical', sample_values: ['high', 'medium', 'low'] },
          { name: 'category', type: 'categorical', sample_values: ['billing', 'technical', 'account'] },
          { name: 'sentiment', type: 'numeric', sample_values: [0.3, 0.6, 0.7] }
        ]}
      })
      .select()
      .single();

    // Create drift run
    const { data: driftRun } = await supabase
      .from('monai_drift_runs')
      .insert({
        project_id: project.id,
        baseline_dataset_id: baselineDataset!.id,
        current_dataset_id: currentDataset!.id,
        dsi: 34,
        drift_ratio: 0.33,
        status: 'completed',
        summary: 'Detected 1 drifted feature out of 3 total features',
        metrics_json: { total_features: 3, drifted_features: 1, avg_psi: 0.15 }
      })
      .select()
      .single();

    // Create feature metrics
    if (driftRun) {
      await supabase.from('monai_drift_feature_metrics').insert([
        {
          drift_run_id: driftRun.id,
          feature_name: 'priority',
          feature_type: 'categorical',
          kl_divergence: 0.08,
          drift_flag: false,
          details_json: { baseline_count: 5000, current_count: 5200 }
        },
        {
          drift_run_id: driftRun.id,
          feature_name: 'category',
          feature_type: 'categorical',
          kl_divergence: 0.25,
          drift_flag: true,
          details_json: { baseline_count: 5000, current_count: 5200 }
        },
        {
          drift_run_id: driftRun.id,
          feature_name: 'sentiment',
          feature_type: 'numeric',
          psi: 0.12,
          drift_flag: false,
          details_json: { baseline_count: 5000, current_count: 5200 }
        }
      ]);
    }

    // Create sample LLM interactions
    await supabase.from('monai_llm_interactions').insert([
      {
        project_id: project.id,
        input_text: 'What is your refund policy?',
        output_text: 'Our refund policy allows returns within 30 days of purchase with original receipt.',
        hallucination_score: 0.05,
        tone: 'neutral',
        metadata_json: { language: 'en', channel: 'chat', country: 'US' },
        safety_flags_json: { toxic: false, pii: false, profanity: false }
      },
      {
        project_id: project.id,
        input_text: 'Help me with my account password',
        output_text: 'As an AI, I cannot access your account. Please use the password reset link sent to your email.',
        hallucination_score: 0.15,
        tone: 'apologetic',
        metadata_json: { language: 'en', channel: 'web', country: 'UK' },
        safety_flags_json: { toxic: false, pii: false, profanity: false }
      },
      {
        project_id: project.id,
        input_text: 'Tell me about premium features',
        output_text: 'Premium features include advanced analytics, priority support, custom integrations, and unlimited API calls.',
        hallucination_score: 0.08,
        tone: 'positive',
        metadata_json: { language: 'en', channel: 'api', country: 'US' },
        safety_flags_json: { toxic: false, pii: false, profanity: false }
      }
    ]);

    // Create sample embeddings
    const sampleVectors = [
      [0.5, 0.3, -0.2, 0.8],
      [-0.3, 0.6, 0.4, -0.1],
      [0.2, -0.5, 0.7, 0.3],
      [-0.6, -0.2, 0.1, 0.5],
      [0.4, 0.8, -0.3, -0.2]
    ];
    
    await supabase.from('monai_embedding_vectors').insert(
      sampleVectors.map(vec => ({
        project_id: project.id,
        vector: vec,
        cluster_label: vec[0] >= 0 && vec[1] >= 0 ? 'cluster_a' : 
                      vec[0] < 0 && vec[1] >= 0 ? 'cluster_b' : 
                      vec[0] < 0 && vec[1] < 0 ? 'cluster_c' : 'cluster_d'
      }))
    );

    // Create sample alert
    await supabase.from('monai_alerts').insert({
      project_id: project.id,
      type: 'drift',
      severity: 'warning',
      title: 'Moderate Drift Detected',
      message: 'Category feature showing distribution shift above threshold',
      payload_json: { drift_run_id: driftRun?.id, dsi: 34, drift_ratio: 0.33 },
      channel: 'slack',
      status: 'open'
    });

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
