-- Drop existing api_keys table if it exists and recreate with proper schema
DROP TABLE IF EXISTS public.monai_api_keys;

-- Create api_keys table with production-grade schema
CREATE TABLE public.monai_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.monai_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  hashed_key TEXT NOT NULL,
  last_four TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  environment TEXT NOT NULL DEFAULT 'live' CHECK (environment IN ('live', 'test'))
);

-- Create indexes for fast lookups
CREATE INDEX idx_api_keys_project_id ON public.monai_api_keys(project_id);
CREATE INDEX idx_api_keys_hashed_key ON public.monai_api_keys(hashed_key);
CREATE INDEX idx_api_keys_active ON public.monai_api_keys(project_id, is_active);

-- Enable RLS
ALTER TABLE public.monai_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public access to api_keys"
  ON public.monai_api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);