import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateApiKey } from '../_shared/validateApiKey.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      project_id, 
      event_type,
      payload,
    } = await req.json();

    if (!project_id || !event_type) {
      throw new Error('Missing required fields: project_id, event_type');
    }

    // Optional API key validation
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.replace('Bearer ', '');
      const validationResult = await validateApiKey(apiKey, project_id);
      
      if (!validationResult.valid) {
        console.error('API key validation failed:', validationResult.error);
        return new Response(
          JSON.stringify({ error: 'Invalid or inactive API key' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('API key validated successfully');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Store generic event
    const { data: event, error: eventError } = await supabase
      .from('monai_events')
      .insert({
        project_id,
        event_type,
        payload_json: payload || {},
      })
      .select()
      .single();

    if (eventError) throw eventError;

    console.log(`Event ${event_type} ingested for project ${project_id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ingest-event:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});