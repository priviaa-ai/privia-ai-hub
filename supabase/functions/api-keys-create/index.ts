import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate cryptographically secure random string
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash key using SHA-256
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project_id, name, description, permissions, expires_in_days } = await req.json();

    if (!project_id) {
      throw new Error('project_id is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('monai_projects')
      .select('id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found');
    }

    // Generate API key
    const prefix = 'mon_live';
    const randomPart = generateRandomString(32); // 64 hex chars
    const fullKey = `${prefix}_${randomPart}`;
    
    // Hash the full key
    const hashedKey = await hashKey(fullKey);
    
    // Extract last 4 characters
    const lastFour = randomPart.slice(-4);

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expires_in_days && expires_in_days > 0) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expires_in_days);
      expiresAt = expirationDate.toISOString();
    }

    // Store in database
    const { data: apiKey, error: insertError } = await supabase
      .from('monai_api_keys')
      .insert({
        project_id,
        name: name || 'API Key',
        description: description || null,
        prefix,
        hashed_key: hashedKey,
        last_four: lastFour,
        environment: 'live',
        is_active: true,
        permissions: permissions || { read: true, write: true },
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`API key created for project ${project_id}`);

    // Return the full key ONLY in this response
    return new Response(
      JSON.stringify({
        id: apiKey.id,
        name: apiKey.name,
        description: apiKey.description,
        created_at: apiKey.created_at,
        last_used_at: apiKey.last_used_at,
        is_active: apiKey.is_active,
        environment: apiKey.environment,
        permissions: apiKey.permissions,
        expires_at: apiKey.expires_at,
        display_key: fullKey, // ONLY time the full key is ever returned
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in api-keys-create:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});