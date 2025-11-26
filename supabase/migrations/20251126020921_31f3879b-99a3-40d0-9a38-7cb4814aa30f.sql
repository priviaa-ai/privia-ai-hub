-- Drop the existing restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Public access to projects" ON public.monai_projects;

-- Create a permissive policy for all operations
CREATE POLICY "Public access to monai_projects" 
ON public.monai_projects
FOR ALL 
USING (true)
WITH CHECK (true);