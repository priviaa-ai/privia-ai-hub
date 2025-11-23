import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { StatusPill } from "@/components/monai/StatusPill";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  default_model_type: string;
  is_demo: boolean;
}

export default function MonaiProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('monai_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // If no projects exist, create demo project
      if (!data || data.length === 0) {
        await createDemoProject();
        return;
      }

      setProjects(data);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDemoProject = async () => {
    try {
      // Call edge function to create demo project with seed data
      const { data, error } = await supabase.functions.invoke('create-demo-project');
      
      if (error) throw error;

      toast({
        title: "Demo Project Created",
        description: "Explore MonAI with sample drift data and LLM interactions",
      });

      // Reload projects
      loadProjects();
    } catch (error: any) {
      console.error('Error creating demo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create demo project",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <PageHeader
          title="Projects"
          subtitle="AI reliability monitoring across your ML and LLM systems"
          actions={
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/monai/projects/${project.id}`}>
              <GlassCard hover className="p-6 h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      )}
                    </div>
                    {project.is_demo && (
                      <StatusPill variant="info">Demo</StatusPill>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{project.default_model_type}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-success font-medium">Reliability 94%</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
