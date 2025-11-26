import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No auth token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Use service role for monai_projects insert
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, description } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid name' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create project with user_id in the projects table
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ name: name.trim(), user_id: user.id })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      return new Response(
        JSON.stringify({ error: 'Failed to create project' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create default settings for the projects table
    const { error: settingsError } = await supabase
      .from('project_settings')
      .insert({ 
        project_id: project.id,
        dsi_threshold: 0.3,
        drift_ratio_threshold: 0.3
      });

    if (settingsError) {
      console.error('Settings creation error:', settingsError);
    }

    // ALSO create a matching row in monai_projects with the SAME ID
    // This ensures the project ID in the URL matches the monai_projects ID
    // Using upsert with service role client to bypass RLS
    const { error: monaiProjectError } = await supabaseAdmin
      .from('monai_projects')
      .upsert({
        id: project.id,  // Use the same UUID from the projects table
        name: name.trim(),
        description: description || 'MonAI project',
        owner_user_id: user.id,
        dsi_threshold: 0.3,
        hallucination_threshold: 0.3,
        project_type: 'hybrid',
        default_model_type: 'llm',
        is_demo: false,
        is_archived: false,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (monaiProjectError) {
      console.error('MonAI project creation error:', monaiProjectError);
      // Don't fail the whole request, the main project was created
      // Log for debugging but continue
    } else {
      console.log('Successfully created monai_project with id:', project.id);
    }

    return new Response(
      JSON.stringify({ id: project.id, name: project.name }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
