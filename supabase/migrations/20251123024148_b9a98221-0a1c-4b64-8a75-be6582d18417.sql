-- MonAI Database Schema
-- Create new tables for MonAI platform (keeping old tables as backup)

-- Projects table
CREATE TABLE monai_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  default_model_type TEXT CHECK (default_model_type IN ('ml', 'llm', 'hybrid')) DEFAULT 'ml',
  is_demo BOOLEAN DEFAULT FALSE
);

-- API Keys table
CREATE TABLE monai_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  hashed_key TEXT NOT NULL,
  plain_key_preview TEXT NOT NULL, -- last 4 chars for display
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Datasets table
CREATE TABLE monai_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT CHECK (kind IN ('baseline', 'current', 'reference', 'stream')) NOT NULL,
  source_type TEXT CHECK (source_type IN ('file', 's3', 'gcs', 'bq', 'postgres', 'json_logs', 'webhook', 'other')) DEFAULT 'file',
  row_count INTEGER,
  schema_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drift Runs table
CREATE TABLE monai_drift_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  baseline_dataset_id UUID NOT NULL REFERENCES monai_datasets(id) ON DELETE CASCADE,
  current_dataset_id UUID NOT NULL REFERENCES monai_datasets(id) ON DELETE CASCADE,
  dsi NUMERIC NOT NULL, -- Drift Severity Index (0-100)
  drift_ratio NUMERIC NOT NULL, -- Proportion of drifted features
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  summary TEXT,
  metrics_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drift Feature Metrics table
CREATE TABLE monai_drift_feature_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drift_run_id UUID NOT NULL REFERENCES monai_drift_runs(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_type TEXT CHECK (feature_type IN ('numeric', 'categorical', 'text', 'embedding')) NOT NULL,
  psi NUMERIC, -- Population Stability Index
  js_divergence NUMERIC, -- Jensen-Shannon divergence
  kl_divergence NUMERIC, -- Kullback-Leibler divergence
  p_value NUMERIC,
  drift_flag BOOLEAN NOT NULL DEFAULT FALSE,
  details_json JSONB
);

-- LLM Interactions table
CREATE TABLE monai_llm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  metadata_json JSONB, -- user_id, channel, country, language, etc.
  hallucination_score NUMERIC, -- 0-1 score
  tone TEXT,
  safety_flags_json JSONB, -- toxic, pii, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Embedding Vectors table
CREATE TABLE monai_embedding_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  interaction_id UUID REFERENCES monai_llm_interactions(id) ON DELETE SET NULL,
  dataset_id UUID REFERENCES monai_datasets(id) ON DELETE SET NULL,
  vector JSONB NOT NULL, -- Array of numbers
  cluster_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alerts table
CREATE TABLE monai_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- drift, hallucination, volume, schema, latency
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  payload_json JSONB,
  channel TEXT CHECK (channel IN ('slack', 'email', 'pagerduty', 'webhook')),
  status TEXT CHECK (status IN ('open', 'resolved')) DEFAULT 'open',
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Events table (generic event log)
CREATE TABLE monai_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES monai_projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_monai_api_keys_project ON monai_api_keys(project_id);
CREATE INDEX idx_monai_datasets_project ON monai_datasets(project_id);
CREATE INDEX idx_monai_drift_runs_project ON monai_drift_runs(project_id);
CREATE INDEX idx_monai_drift_runs_created ON monai_drift_runs(created_at DESC);
CREATE INDEX idx_monai_drift_feature_metrics_run ON monai_drift_feature_metrics(drift_run_id);
CREATE INDEX idx_monai_llm_interactions_project ON monai_llm_interactions(project_id);
CREATE INDEX idx_monai_llm_interactions_created ON monai_llm_interactions(created_at DESC);
CREATE INDEX idx_monai_embedding_vectors_project ON monai_embedding_vectors(project_id);
CREATE INDEX idx_monai_alerts_project ON monai_alerts(project_id);
CREATE INDEX idx_monai_alerts_status ON monai_alerts(status);
CREATE INDEX idx_monai_events_project ON monai_events(project_id);

-- RLS Policies (public access for single tenant beta)
ALTER TABLE monai_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_drift_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_drift_feature_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_llm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_embedding_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monai_events ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for single tenant beta
CREATE POLICY "Public access to projects" ON monai_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to api_keys" ON monai_api_keys FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to datasets" ON monai_datasets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to drift_runs" ON monai_drift_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to drift_feature_metrics" ON monai_drift_feature_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to llm_interactions" ON monai_llm_interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to embedding_vectors" ON monai_embedding_vectors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to alerts" ON monai_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access to events" ON monai_events FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_monai_projects_updated_at
  BEFORE UPDATE ON monai_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();