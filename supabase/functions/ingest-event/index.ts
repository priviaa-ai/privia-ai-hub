import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateApiKey } from '../_shared/validateApiKey.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      event_type,
      payload,
    } = await req.json();

    if (!project_id || !event_type) {
      throw new Error('Missing required fields: project_id, event_type');
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
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ingest-event:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});