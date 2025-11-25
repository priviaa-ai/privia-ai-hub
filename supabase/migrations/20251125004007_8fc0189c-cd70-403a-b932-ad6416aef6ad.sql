-- Add rate limiting table for API key request tracking
CREATE TABLE IF NOT EXISTS public.monai_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES public.monai_api_keys(id) ON DELETE CASCADE,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups during rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_window ON public.monai_rate_limits(api_key_id, window_start);

-- Add project type and archive fields to monai_projects
ALTER TABLE public.monai_projects 
  ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'hybrid' CHECK (project_type IN ('ml', 'llm', 'hybrid')),
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Enable RLS on rate limits table
ALTER TABLE public.monai_rate_limits ENABLE ROW LEVEL SECURITY;

-- Public access policy for rate limits (edge functions need access)
CREATE POLICY "Public access to rate_limits" ON public.monai_rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- Add trigger for updated_at on rate_limits
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.monai_rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();