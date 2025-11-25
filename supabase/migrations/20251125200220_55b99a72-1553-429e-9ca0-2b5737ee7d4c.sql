-- Add missing columns to monai_projects
ALTER TABLE public.monai_projects 
ADD COLUMN IF NOT EXISTS dsi_threshold numeric DEFAULT 0.3,
ADD COLUMN IF NOT EXISTS hallucination_threshold numeric DEFAULT 0.3,
ADD COLUMN IF NOT EXISTS slack_webhook_url text,
ADD COLUMN IF NOT EXISTS email_alert text,
ADD COLUMN IF NOT EXISTS owner_user_id uuid;

-- Add missing columns to monai_api_keys
ALTER TABLE public.monai_api_keys
ADD COLUMN IF NOT EXISTS key_hash text;

-- Create dataset_runs table for tracking comparison runs
CREATE TABLE IF NOT EXISTS public.dataset_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.monai_projects(id) ON DELETE CASCADE,
  baseline_dataset_id uuid REFERENCES public.monai_datasets(id) ON DELETE SET NULL,
  current_dataset_id uuid REFERENCES public.monai_datasets(id) ON DELETE SET NULL,
  label text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create llm_scores table for hallucination scores
CREATE TABLE IF NOT EXISTS public.llm_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.monai_projects(id) ON DELETE CASCADE,
  llm_event_id uuid NOT NULL REFERENCES public.monai_llm_interactions(id) ON DELETE CASCADE,
  hallucination_score numeric CHECK (hallucination_score >= 0 AND hallucination_score <= 1),
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Create llm_summary_daily table for aggregated metrics
CREATE TABLE IF NOT EXISTS public.llm_summary_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.monai_projects(id) ON DELETE CASCADE,
  date date NOT NULL,
  avg_hallucination_score numeric,
  high_hallucination_fraction numeric,
  total_events integer DEFAULT 0,
  high_events integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, date)
);

-- Add status column to llm_interactions if not exists
ALTER TABLE public.monai_llm_interactions
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending_score' CHECK (status IN ('pending_score', 'scored', 'skipped'));

-- Add confidence column to llm_interactions
ALTER TABLE public.monai_llm_interactions
ADD COLUMN IF NOT EXISTS confidence numeric;

-- Enable RLS on new tables
ALTER TABLE public.dataset_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_summary_daily ENABLE ROW LEVEL SECURITY;

-- Public access policies for dataset_runs
CREATE POLICY "Public access to dataset_runs" ON public.dataset_runs
FOR ALL USING (true) WITH CHECK (true);

-- Public access policies for llm_scores
CREATE POLICY "Public access to llm_scores" ON public.llm_scores
FOR ALL USING (true) WITH CHECK (true);

-- Public access policies for llm_summary_daily
CREATE POLICY "Public access to llm_summary_daily" ON public.llm_summary_daily
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dataset_runs_project_id ON public.dataset_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_dataset_runs_status ON public.dataset_runs(status);
CREATE INDEX IF NOT EXISTS idx_llm_scores_project_id ON public.llm_scores(project_id);
CREATE INDEX IF NOT EXISTS idx_llm_scores_llm_event_id ON public.llm_scores(llm_event_id);
CREATE INDEX IF NOT EXISTS idx_llm_summary_daily_project_date ON public.llm_summary_daily(project_id, date);
CREATE INDEX IF NOT EXISTS idx_monai_llm_interactions_status ON public.monai_llm_interactions(status);
CREATE INDEX IF NOT EXISTS idx_monai_llm_interactions_created_at ON public.monai_llm_interactions(created_at);