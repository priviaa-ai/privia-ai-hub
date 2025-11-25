import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Hash key using SHA-256
 * Used for secure storage and validation of API keys
 */
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
  statusCode?: number;
}

/**
 * RATE LIMITING CONFIGURATION
 * Default: 60 requests per minute per API key
 * Window: 1 minute (60 seconds)
 */
const RATE_LIMIT_REQUESTS = 60;
const RATE_LIMIT_WINDOW_SECONDS = 60;

/**
 * Check and enforce rate limiting for an API key
 * Uses a sliding window approach with 1-minute boundaries
 * 
 * @param supabase - Supabase client with service role key
 * @param apiKeyId - The API key ID to check
 * @returns Object with allowed status and remaining requests
 */
async function checkRateLimit(supabase: any, apiKeyId: string): Promise<{ allowed: boolean; remaining: number; error?: string }> {
  try {
    // Calculate current window start (floor to minute boundary)
    const now = new Date();
    const windowStart = new Date(now);
    windowStart.setSeconds(0, 0); // Floor to minute

    // Query for existing rate limit record for this key and window
    const { data: existingLimit, error: queryError } = await supabase
      .from('monai_rate_limits')
      .select('*')
      .eq('api_key_id', apiKeyId)
      .eq('window_start', windowStart.toISOString())
      .maybeSingle();

    if (queryError) {
      console.error('Rate limit query error:', queryError);
      // On error, allow request but log it
      return { allowed: true, remaining: RATE_LIMIT_REQUESTS };
    }

    if (!existingLimit) {
      // No record exists, create one with count = 1
      const { error: insertError } = await supabase
        .from('monai_rate_limits')
        .insert({
          api_key_id: apiKeyId,
          window_start: windowStart.toISOString(),
          request_count: 1
        });

      if (insertError) {
        console.error('Rate limit insert error:', insertError);
        return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 };
      }

      return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1 };
    }

    // Check if we've exceeded the limit
    if (existingLimit.request_count >= RATE_LIMIT_REQUESTS) {
      return { 
        allowed: false, 
        remaining: 0,
        error: 'Rate limit exceeded. Try again later.' 
      };
    }

    // Increment the count
    const { error: updateError } = await supabase
      .from('monai_rate_limits')
      .update({ 
        request_count: existingLimit.request_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingLimit.id);

    if (updateError) {
      console.error('Rate limit update error:', updateError);
    }

    return { 
      allowed: true, 
      remaining: RATE_LIMIT_REQUESTS - existingLimit.request_count - 1 
    };
  } catch (error: any) {
    console.error('Rate limit check error:', error);
    // On error, allow request to avoid blocking legitimate traffic
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS };
  }
}

/**
 * Validates an API key for a given project with rate limiting
 * 
 * Flow:
 * 1. Extract and validate key format (mon_live_<random>)
 * 2. Hash the provided key using SHA-256
 * 3. Look up by project_id, is_active=true, and hashed_key
 * 4. Check expiration date if set
 * 5. Verify required permissions if specified
 * 6. Check rate limit (60 requests/minute default)
 * 7. Update usage tracking (count, last_used_at, last_ip)
 * 
 * Similar to Stripe/OpenAI validation flow
 * 
 * @param providedKey - The full API key from the client (mon_live_...)
 * @param projectId - The project ID to validate against
 * @param requiredPermission - Optional permission to check ('read', 'write', 'admin')
 * @param requestIp - Optional IP address for tracking
 * @returns ValidateKeyResult with validation status and error details
 */
export async function validateApiKey(
  providedKey: string,
  projectId: string,
  requiredPermission?: 'read' | 'write' | 'admin',
  requestIp?: string
): Promise<ValidateKeyResult> {
  try {
    if (!providedKey || !projectId) {
      return { 
        valid: false, 
        error: 'Missing API key or project ID',
        statusCode: 401 
      };
    }

    // Validate key format: should be mon_live_<random> or mon_test_<random>
    const parts = providedKey.split('_');
    if (parts.length < 3 || parts[0] !== 'mon' || !['live', 'test'].includes(parts[1])) {
      return { 
        valid: false, 
        error: 'Invalid API key format',
        statusCode: 401 
      };
    }

    // Hash the full provided key for lookup
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
      .maybeSingle();

    if (queryError || !keyRecord) {
      return { 
        valid: false, 
        error: 'Invalid or inactive API key',
        statusCode: 401 
      };
    }

    // Check if key has expired
    if (keyRecord.expires_at) {
      const expirationDate = new Date(keyRecord.expires_at);
      if (expirationDate < new Date()) {
        return { 
          valid: false, 
          error: 'API key has expired',
          statusCode: 401 
        };
      }
    }

    // Check permissions if required
    if (requiredPermission && keyRecord.permissions) {
      const hasPermission = keyRecord.permissions[requiredPermission] === true;
      if (!hasPermission) {
        return { 
          valid: false, 
          error: 'Insufficient permissions for this API key',
          statusCode: 403 
        };
      }
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabase, keyRecord.id);
    if (!rateLimitResult.allowed) {
      return { 
        valid: false, 
        error: rateLimitResult.error || 'Rate limit exceeded',
        statusCode: 429 
      };
    }

    // Update last_used_at, usage_count, and last_ip
    await supabase
      .from('monai_api_keys')
      .update({ 
        last_used_at: new Date().toISOString(),
        usage_count: (keyRecord.usage_count || 0) + 1,
        last_ip: requestIp || keyRecord.last_ip
      })
      .eq('id', keyRecord.id);

    console.log(`API key validated successfully. Remaining requests: ${rateLimitResult.remaining}`);

    return { valid: true, keyRecord };
  } catch (error: any) {
    console.error('Error validating API key:', error);
    return { 
      valid: false, 
      error: error.message,
      statusCode: 500 
    };
  }
}