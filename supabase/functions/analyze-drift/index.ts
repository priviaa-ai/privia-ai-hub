import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeatureData {
  name: string;
  type: 'numeric' | 'categorical' | 'text';
  baseline_values: any[];
  current_values: any[];
}

// Calculate PSI (Population Stability Index) for numeric features
function calculatePSI(baseline: number[], current: number[]): number {
  const numBins = 10;
  
  // Find min and max across both datasets
  const allValues = [...baseline, ...current];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const binWidth = (max - min) / numBins;
  
  // Create bins
  const bins: number[] = [];
  for (let i = 0; i <= numBins; i++) {
    bins.push(min + i * binWidth);
  }
  
  // Count values in each bin for baseline
  const baselineCounts = new Array(numBins).fill(0);
  baseline.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), numBins - 1);
    baselineCounts[binIndex]++;
  });
  
  // Count values in each bin for current
  const currentCounts = new Array(numBins).fill(0);
  current.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), numBins - 1);
    currentCounts[binIndex]++;
  });
  
  // Calculate PSI
  const epsilon = 0.0001; // Small value to avoid log(0)
  let psi = 0;
  
  for (let i = 0; i < numBins; i++) {
    const baselinePct = (baselineCounts[i] + epsilon) / baseline.length;
    const currentPct = (currentCounts[i] + epsilon) / current.length;
    psi += (currentPct - baselinePct) * Math.log(currentPct / baselinePct);
  }
  
  return psi;
}

// Calculate KL Divergence for categorical features
function calculateKLDivergence(baseline: string[], current: string[]): number {
  // Get all unique categories
  const allCategories = new Set([...baseline, ...current]);
  const epsilon = 0.0001;
  
  // Calculate distributions
  const baselineDist: { [key: string]: number } = {};
  const currentDist: { [key: string]: number } = {};
  
  allCategories.forEach(cat => {
    baselineDist[cat] = baseline.filter(v => v === cat).length / baseline.length || epsilon;
    currentDist[cat] = current.filter(v => v === cat).length / current.length || epsilon;
  });
  
  // Calculate KL divergence
  let kl = 0;
  allCategories.forEach(cat => {
    kl += currentDist[cat] * Math.log(currentDist[cat] / baselineDist[cat]);
  });
  
  return kl;
}

// Determine if feature has drifted based on threshold
function isDrifted(psi: number | null, kl: number | null): boolean {
  const PSI_THRESHOLD = 0.2; // Industry standard
  const KL_THRESHOLD = 0.1;
  
  if (psi !== null && psi > PSI_THRESHOLD) return true;
  if (kl !== null && kl > KL_THRESHOLD) return true;
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project_id, baseline_dataset_id, current_dataset_id, baseline_data, current_data } = await req.json();

    if (!project_id || !baseline_dataset_id || !current_dataset_id) {
      throw new Error('Missing required fields');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse the CSV data (baseline_data and current_data are arrays of objects)
    // Infer feature types and compute metrics
    const features: FeatureData[] = [];
    
    if (baseline_data.length > 0 && current_data.length > 0) {
      const featureNames = Object.keys(baseline_data[0]);
      
      for (const featureName of featureNames) {
        const baselineValues = baseline_data.map((row: any) => row[featureName]);
        const currentValues = current_data.map((row: any) => row[featureName]);
        
        // Infer type - if all values are numbers, treat as numeric
        const isNumeric = baselineValues.every((v: any) => !isNaN(parseFloat(v))) && 
                         currentValues.every((v: any) => !isNaN(parseFloat(v)));
        
        features.push({
          name: featureName,
          type: isNumeric ? 'numeric' : 'categorical',
          baseline_values: isNumeric ? baselineValues.map(parseFloat) : baselineValues,
          current_values: isNumeric ? currentValues.map(parseFloat) : currentValues,
        });
      }
    }

    // Calculate metrics for each feature
    const featureMetrics = features.map(feature => {
      let psi: number | null = null;
      let kl: number | null = null;
      
      if (feature.type === 'numeric') {
        psi = calculatePSI(feature.baseline_values as number[], feature.current_values as number[]);
      } else {
        kl = calculateKLDivergence(feature.baseline_values as string[], feature.current_values as string[]);
      }
      
      const drift_flag = isDrifted(psi, kl);
      
      return {
        feature_name: feature.name,
        feature_type: feature.type,
        psi,
        kl_divergence: kl,
        drift_flag,
        details_json: {
          baseline_count: feature.baseline_values.length,
          current_count: feature.current_values.length,
        }
      };
    });

    // Calculate overall DSI (Drift Severity Index)
    const driftedFeatures = featureMetrics.filter(m => m.drift_flag);
    const drift_ratio = driftedFeatures.length / featureMetrics.length;
    
    // Average normalized drift score (scale PSI and KL to 0-100)
    const avgDrift = featureMetrics.reduce((sum, m) => {
      const score = m.psi !== null ? Math.min(m.psi * 100, 100) : 
                   m.kl_divergence !== null ? Math.min(m.kl_divergence * 200, 100) : 0;
      return sum + score;
    }, 0) / featureMetrics.length;
    
    const dsi = Math.round(avgDrift);

    // Create drift run
    const { data: driftRun, error: runError } = await supabase
      .from('monai_drift_runs')
      .insert({
        project_id,
        baseline_dataset_id,
        current_dataset_id,
        dsi,
        drift_ratio,
        status: 'completed',
        summary: `Detected ${driftedFeatures.length} drifted features out of ${featureMetrics.length} total features`,
        metrics_json: {
          total_features: featureMetrics.length,
          drifted_features: driftedFeatures.length,
          avg_psi: featureMetrics.filter(m => m.psi !== null).reduce((sum, m) => sum + (m.psi || 0), 0) / 
                   featureMetrics.filter(m => m.psi !== null).length || 0,
        }
      })
      .select()
      .single();

    if (runError) throw runError;

    // Insert feature metrics
    const featureMetricsWithRunId = featureMetrics.map(m => ({
      ...m,
      drift_run_id: driftRun.id,
    }));

    const { error: metricsError } = await supabase
      .from('monai_drift_feature_metrics')
      .insert(featureMetricsWithRunId);

    if (metricsError) throw metricsError;

    // Check if alert should be created
    if (dsi > 50 || drift_ratio > 0.3) {
      await supabase.from('monai_alerts').insert({
        project_id,
        type: 'drift',
        severity: dsi > 70 ? 'critical' : 'warning',
        title: 'High Drift Detected',
        message: `DSI of ${dsi} detected with ${Math.round(drift_ratio * 100)}% of features drifting`,
        payload_json: {
          drift_run_id: driftRun.id,
          dsi,
          drift_ratio,
        },
        channel: 'slack',
        status: 'open',
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        drift_run: driftRun,
        dsi,
        drift_ratio,
        top_drifted_features: featureMetrics
          .filter(m => m.drift_flag)
          .sort((a, b) => {
            const scoreA = a.psi || a.kl_divergence || 0;
            const scoreB = b.psi || b.kl_divergence || 0;
            return scoreB - scoreA;
          })
          .slice(0, 5)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in analyze-drift:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
