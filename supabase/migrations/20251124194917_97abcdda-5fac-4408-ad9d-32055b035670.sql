-- Add additional columns to API keys table for real-world features
ALTER TABLE public.monai_api_keys
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"read": true, "write": true}'::jsonb,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ip TEXT;

-- Create index for expiration checks
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON public.monai_api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Add comment explaining permissions structure
COMMENT ON COLUMN public.monai_api_keys.permissions IS 'JSON object with permission flags: {"read": true, "write": true, "admin": false}';