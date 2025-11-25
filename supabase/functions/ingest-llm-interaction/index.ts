import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateApiKey } from '../_shared/validateApiKey.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hallucination score heuristic
function calculateHallucinationScore(input: string, output: string): number {
  const output_lower = output.toLowerCase();
  
  // Check for AI uncertainty phrases
  const uncertaintyPhrases = [
    'as an ai',
    'i don\'t know',
    'i cannot',
    'i\'m not sure',
    'i apologize',
    'i do not have access',
    'not able to',
  ];
  
  let score = 0.0;
  
  uncertaintyPhrases.forEach(phrase => {
    if (output_lower.includes(phrase)) {
      score += 0.15;
    }
  });
  
  // Check for overly long responses (possible hallucination)
  if (output.length > 1000) {
    score += 0.1;
  }
  
  // Check for repetition
  const words = output.split(' ');
  const uniqueWords = new Set(words);
  const repetitionRatio = 1 - (uniqueWords.size / words.length);
  if (repetitionRatio > 0.3) {
    score += 0.2;
  }
  
  return Math.min(score, 1.0);
}

// Determine tone from output text
function determineTone(output: string): string {
  const output_lower = output.toLowerCase();
  
  if (output_lower.includes('sorry') || output_lower.includes('apologize')) {
    return 'apologetic';
  }
  if (output_lower.includes('!') && output.split('!').length > 2) {
    return 'enthusiastic';
  }
  if (output_lower.includes('unfortunately') || output_lower.includes('cannot')) {
    return 'negative';
  }
  if (output_lower.includes('great') || output_lower.includes('excellent')) {
    return 'positive';
  }
  
  return 'neutral';
}

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
      user_query, 
      model_output, 
      confidence,
      metadata 
    } = await req.json();

    if (!project_id || !user_query || !model_output) {
      throw new Error('Missing required fields: project_id, user_query, model_output');
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

    // Calculate hallucination score
    const hallucination_score = calculateHallucinationScore(user_query, model_output);
    
    // Determine tone
    const tone = determineTone(model_output);
    
    // Basic safety flags (placeholder - in production use proper content moderation API)
    const safety_flags = {
      toxic: false,
      pii: /\b\d{3}-\d{2}-\d{4}\b/.test(model_output) || // SSN pattern
            /\b\d{16}\b/.test(model_output), // Credit card pattern
      profanity: false,
    };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Store LLM interaction
    const { data: interaction, error: interactionError } = await supabase
      .from('monai_llm_interactions')
      .insert({
        project_id,
        input_text: user_query,
        output_text: model_output,
        metadata_json: metadata || {},
        hallucination_score,
        tone,
        safety_flags_json: safety_flags,
      })
      .select()
      .single();

    if (interactionError) throw interactionError;

    // Check if hallucination score is high and create alert
    if (hallucination_score > 0.5) {
      await supabase.from('monai_alerts').insert({
        project_id,
        type: 'hallucination',
        severity: hallucination_score > 0.7 ? 'critical' : 'warning',
        title: 'High Hallucination Score Detected',
        message: `LLM interaction scored ${(hallucination_score * 100).toFixed(1)}% hallucination risk`,
        payload_json: {
          interaction_id: interaction.id,
          hallucination_score,
          tone,
        },
        channel: 'slack',
        status: 'open',
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        interaction,
        analysis: {
          hallucination_score,
          tone,
          safety_flags,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in ingest-llm-interaction:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
