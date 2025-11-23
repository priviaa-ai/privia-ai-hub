-- Drop existing insecure "Allow all" policies
DROP POLICY IF EXISTS "Allow all on projects" ON projects;
DROP POLICY IF EXISTS "Allow all on project_settings" ON project_settings;
DROP POLICY IF EXISTS "Allow all on drift_runs" ON drift_runs;

-- Delete existing test data (projects with NULL user_id)
-- This will clean up the database before enforcing user ownership
DELETE FROM drift_runs WHERE project_id IN (SELECT id FROM projects WHERE user_id IS NULL);
DELETE FROM project_settings WHERE project_id IN (SELECT id FROM projects WHERE user_id IS NULL);
DELETE FROM projects WHERE user_id IS NULL;

-- Make user_id NOT NULL in projects table
ALTER TABLE projects ALTER COLUMN user_id SET NOT NULL;

-- Create secure RLS policies for projects table
CREATE POLICY "Users can view their own projects"
ON projects FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create secure RLS policies for project_settings table
CREATE POLICY "Users can view settings for their projects"
ON project_settings FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert settings for their projects"
ON project_settings FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update settings for their projects"
ON project_settings FOR UPDATE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete settings for their projects"
ON project_settings FOR DELETE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

-- Create secure RLS policies for drift_runs table
CREATE POLICY "Users can view drift runs for their projects"
ON drift_runs FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert drift runs for their projects"
ON drift_runs FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update drift runs for their projects"
ON drift_runs FOR UPDATE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete drift runs for their projects"
ON drift_runs FOR DELETE
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE user_id = auth.uid()
  )
);