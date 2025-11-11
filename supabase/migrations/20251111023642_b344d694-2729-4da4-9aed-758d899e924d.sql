-- Add slack_webhook_url to project_settings
ALTER TABLE public.project_settings 
ADD COLUMN IF NOT EXISTS slack_webhook_url text;