import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Hash key using SHA-256
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface ValidateKeyResult {
  valid: boolean;
  keyRecord?: any;
  error?: string;
}

/**
 * Validates an API key for a given project
 * Similar to Stripe/OpenAI validation flow:
 * 1. Extract prefix
 * 2. Hash the provided key
 * 3. Look up by project_id, is_active=true, and hashed_key
 * 4. Update last_used_at if valid
 * 
 * @param providedKey - The full API key from the client
 * @param projectId - The project ID to validate against
 * @returns ValidateKeyResult with validation status
 */
export async function validateApiKey(
  providedKey: string,
  projectId: string
): Promise<ValidateKeyResult> {
  try {
    if (!providedKey || !projectId) {
      return { valid: false, error: 'Missing API key or project ID' };
    }

    // Extract prefix (everything before the last underscore)
    const parts = providedKey.split('_');
    if (parts.length < 2) {
      return { valid: false, error: 'Invalid API key format' };
    }

    // Hash the full provided key
    const hashedProvidedKey = await hashKey(providedKey);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Query for matching key
    const { data: keyRecord, error: queryError } = await supabase
      .from('monai_api_keys')
      .select('*')
      .eq('project_id', projectId)
      .eq('hashed_key', hashedProvidedKey)
      .eq('is_active', true)
      .single();

    if (queryError || !keyRecord) {
      return { valid: false, error: 'Invalid or inactive API key' };
    }

    // Update last_used_at
    await supabase
      .from('monai_api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyRecord.id);

    return { valid: true, keyRecord };
  } catch (error: any) {
    console.error('Error validating API key:', error);
    return { valid: false, error: error.message };
  }
}