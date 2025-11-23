import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parse CSV string to array of objects
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    rows.push(row);
  }
  
  return rows;
}

// Infer schema from data
function inferSchema(data: any[]): { features: Array<{ name: string; type: string; sample_values: any[] }> } {
  if (data.length === 0) return { features: [] };
  
  const features = Object.keys(data[0]).map(featureName => {
    const values = data.slice(0, 100).map(row => row[featureName]); // Sample first 100 rows
    
    // Check if numeric
    const isNumeric = values.every(v => !isNaN(parseFloat(v)));
    
    // Check for high cardinality (likely categorical vs text)
    const uniqueValues = new Set(values);
    const cardinality = uniqueValues.size / values.length;
    
    let type: string;
    if (isNumeric) {
      type = 'numeric';
    } else if (cardinality < 0.5) {
      type = 'categorical';
    } else {
      type = 'text';
    }
    
    return {
      name: featureName,
      type,
      sample_values: Array.from(uniqueValues).slice(0, 5),
    };
  });
  
  return { features };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const project_id = formData.get('project_id') as string;
    const name = formData.get('name') as string;
    const kind = formData.get('kind') as string; // baseline or current

    if (!file || !project_id || !name || !kind) {
      throw new Error('Missing required fields: file, project_id, name, kind');
    }

    // Read CSV file
    const csvText = await file.text();
    
    // Validate CSV size
    const MAX_SIZE_MB = 20;
    if (csvText.length > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`File too large. Max size is ${MAX_SIZE_MB}MB`);
    }

    // Parse CSV
    const parsedData = parseCSV(csvText);
    const row_count = parsedData.length;

    // Validate row count
    if (row_count > 200000) {
      throw new Error('Dataset exceeds maximum of 200,000 rows');
    }

    // Validate column count
    const columnCount = Object.keys(parsedData[0] || {}).length;
    if (columnCount > 200) {
      throw new Error('Dataset exceeds maximum of 200 columns');
    }

    // Infer schema
    const schema = inferSchema(parsedData);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Create dataset record
    const { data: dataset, error: datasetError } = await supabase
      .from('monai_datasets')
      .insert({
        project_id,
        name,
        kind,
        source_type: 'file',
        row_count,
        schema_json: schema,
      })
      .select()
      .single();

    if (datasetError) throw datasetError;

    // Store parsed data in events table for later retrieval
    const { error: eventError } = await supabase
      .from('monai_events')
      .insert({
        project_id,
        event_type: 'dataset_uploaded',
        payload_json: {
          dataset_id: dataset.id,
          data: parsedData,
          row_count,
          column_count: columnCount,
        }
      });

    if (eventError) throw eventError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        dataset,
        schema,
        row_count,
        column_count: columnCount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in upload-dataset:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
