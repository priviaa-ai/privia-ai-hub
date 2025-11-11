-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.anomalies CASCADE;
DROP TABLE IF EXISTS public.metrics CASCADE;
DROP TABLE IF EXISTS public.runs CASCADE;
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.drift_runs CASCADE;
DROP TABLE IF EXISTS public.project_settings CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Create projects table (no user_id requirement)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_settings table
CREATE TABLE public.project_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  dsi_threshold NUMERIC NOT NULL DEFAULT 0.3,
  drift_ratio_threshold NUMERIC NOT NULL DEFAULT 0.3,
  UNIQUE(project_id)
);

-- Create drift_runs table
CREATE TABLE public.drift_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  baseline_id TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  dsi NUMERIC NOT NULL,
  drift_ratio NUMERIC NOT NULL,
  drifted_features JSONB NOT NULL DEFAULT '[]',
  reference_rows INT NOT NULL,
  current_rows INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_runs_project ON public.drift_runs(project_id, created_at DESC);

-- Enable RLS but allow all operations (no auth)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drift_runs ENABLE ROW LEVEL SECURITY;

-- Policies: allow all operations for everyone (no auth)
CREATE POLICY "Allow all on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on project_settings" ON public.project_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on drift_runs" ON public.drift_runs FOR ALL USING (true) WITH CHECK (true);