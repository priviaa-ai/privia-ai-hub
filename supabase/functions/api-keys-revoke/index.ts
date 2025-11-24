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
    const { key_id } = await req.json();

    if (!key_id) {
      throw new Error('key_id is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Set is_active to false (soft delete)
    const { data: apiKey, error } = await supabase
      .from('monai_api_keys')
      .update({ is_active: false })
      .eq('id', key_id)
      .select('id, name, prefix, last_four, created_at, last_used_at, is_active, environment')
      .single();

    if (error) throw error;

    console.log(`API key ${key_id} revoked`);

    return new Response(
      JSON.stringify({ key: apiKey }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in api-keys-revoke:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});