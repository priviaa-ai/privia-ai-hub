-- Fix function search path security warning
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger
CREATE TRIGGER update_monai_projects_updated_at
  BEFORE UPDATE ON monai_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();