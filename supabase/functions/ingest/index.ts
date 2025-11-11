import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_COLUMNS = 200;
const MAX_ROWS = 200000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const projectId = formData.get('project_id') as string;
    const baselineId = formData.get('baseline_id') as string;
    const currentId = formData.get('current_id') as string;
    const baselineFile = formData.get('baseline_file') as File;
    const currentFile = formData.get('current_file') as File;

    // Validate inputs
    if (!projectId || !baselineId || !currentId || !baselineFile || !currentFile) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check file sizes
    if (baselineFile.size > MAX_FILE_SIZE || currentFile.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 10MB limit' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse CSVs
    const baselineText = await baselineFile.text();
    const currentText = await currentFile.text();

    const baselineData = parseCSV(baselineText);
    const currentData = parseCSV(currentText);

    // Validate row and column counts
    if (baselineData.headers.length > MAX_COLUMNS || currentData.headers.length > MAX_COLUMNS) {
      return new Response(
        JSON.stringify({ error: 'Too many columns (max 200)' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (baselineData.rows.length > MAX_ROWS || currentData.rows.length > MAX_ROWS) {
      return new Response(
        JSON.stringify({ error: 'Too many rows (max 200,000)' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check headers match
    if (JSON.stringify(baselineData.headers) !== JSON.stringify(currentData.headers)) {
      return new Response(
        JSON.stringify({ error: 'CSV headers do not match' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Compute drift
    const driftResult = computeDrift(baselineData, currentData);

    // Store run
    const { data: run, error: runError } = await supabase
      .from('drift_runs')
      .insert({
        project_id: projectId,
        baseline_id: baselineId,
        dataset_id: currentId,
        dsi: driftResult.dsi,
        drift_ratio: driftResult.drift_ratio,
        drifted_features: driftResult.drifted_features,
        reference_rows: baselineData.rows.length,
        current_rows: currentData.rows.length,
      })
      .select()
      .single();

    if (runError) {
      console.error('Error storing run:', runError);
      return new Response(
        JSON.stringify({ error: 'Failed to store run' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send Slack notification if drift detected
    try {
      // Get project settings to retrieve Slack webhook URL and thresholds
      const { data: settingsData } = await supabase
        .from('project_settings')
        .select('slack_webhook_url, dsi_threshold, drift_ratio_threshold')
        .eq('project_id', projectId)
        .single();

      const slackWebhookUrl = settingsData?.slack_webhook_url;
      const dsiThreshold = settingsData?.dsi_threshold || 0.3;
      const driftRatioThreshold = settingsData?.drift_ratio_threshold || 0.3;

    if (driftResult.dsi > dsiThreshold || driftResult.drift_ratio > driftRatioThreshold) {

        if (slackWebhookUrl) {
          const slackMessage = {
            text: `🚨 *Drift Alert!*`,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: "🚨 Data Drift Detected"
                }
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Project:*\n${projectId}`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Run ID:*\n${run.id}`
                  }
                ]
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*DSI:*\n${driftResult.dsi} (threshold: ${dsiThreshold})`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Drift Ratio:*\n${driftResult.drift_ratio} (threshold: ${driftRatioThreshold})`
                  }
                ]
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*Top Drifted Features:*\n${driftResult.drifted_features.map(([name, score]: any) => `• ${name}: ${score}`).join('\n')}`
                }
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Baseline:*\n${baselineId} (${baselineData.rows.length} rows)`
                  },
                  {
                    type: "mrkdwn",
                    text: `*Current:*\n${currentId} (${currentData.rows.length} rows)`
                  }
                ]
              }
            ]
          };

          await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slackMessage)
          });
          
          console.log('Slack notification sent successfully');
        } else {
          console.log('No Slack webhook URL configured, skipping notification');
        }
      } else {
        console.log(`Drift not significant enough (DSI: ${driftResult.dsi} <= ${dsiThreshold}, Drift Ratio: ${driftResult.drift_ratio} <= ${driftRatioThreshold})`);
      }
    } catch (slackError) {
      console.error('Failed to send Slack notification:', slackError);
      // Don't fail the request if Slack notification fails
    }

    return new Response(
      JSON.stringify({
        run_id: run.id,
        dsi: driftResult.dsi,
        drift_ratio: driftResult.drift_ratio,
        drifted_features: driftResult.drifted_features,
        reference_rows: baselineData.rows.length,
        current_rows: currentData.rows.length,
      }),
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

function parseCSV(text: string): { headers: string[], rows: Record<string, string>[] } {
  const lines = text.trim().split('\n');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }
  }

  return { headers, rows };
}

function computeDrift(baseline: any, current: any) {
  const features = baseline.headers;
  const featureScores: Record<string, number> = {};

  for (const feature of features) {
    const baselineValues = baseline.rows.map((r: any) => r[feature]);
    const currentValues = current.rows.map((r: any) => r[feature]);

    // Check if numeric (sample first 50 rows)
    const sampleSize = Math.min(50, baselineValues.length);
    const numericCount = baselineValues.slice(0, sampleSize).filter((v: string) => !isNaN(parseFloat(v))).length;
    const isNumeric = numericCount / sampleSize > 0.8;

    if (isNumeric) {
      const baselineNums = baselineValues.map((v: string) => parseFloat(v)).filter((n: number) => !isNaN(n));
      const currentNums = currentValues.map((v: string) => parseFloat(v)).filter((n: number) => !isNaN(n));

      const baseMean = mean(baselineNums);
      const baseStd = std(baselineNums, baseMean);
      const currMean = mean(currentNums);

      const score = Math.min(1, Math.abs(baseMean - currMean) / (baseStd + 1e-6));
      featureScores[feature] = score;
    } else {
      // Categorical: top category share difference
      const baseTop = topCategory(baselineValues);
      const currTop = topCategory(currentValues);
      const score = Math.abs(baseTop.share - currTop.share);
      featureScores[feature] = score;
    }
  }

  const scores = Object.values(featureScores);
  const dsi = mean(scores);
  const drift_ratio = scores.filter(s => s >= 0.3).length / scores.length;

  const sorted = Object.entries(featureScores).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const drifted_features = sorted.map(([name, score]) => [name, parseFloat(score.toFixed(2))]);

  return {
    dsi: parseFloat(dsi.toFixed(2)),
    drift_ratio: parseFloat(drift_ratio.toFixed(2)),
    drifted_features,
  };
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[], meanVal: number): number {
  if (arr.length === 0) return 0;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - meanVal, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function topCategory(arr: string[]): { category: string, share: number } {
  const counts: Record<string, number> = {};
  arr.forEach(v => {
    counts[v] = (counts[v] || 0) + 1;
  });

  let maxCount = 0;
  let topCat = '';
  for (const [cat, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      topCat = cat;
    }
  }

  return { category: topCat, share: maxCount / arr.length };
}
