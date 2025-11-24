import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/monai/Navigation";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { StatusPill } from "@/components/monai/StatusPill";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emptyProjectsImage from "@/assets/empty-projects.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  default_model_type: string;
  is_demo: boolean;
  reliabilityScore?: number;
  driftScore?: number;
  lastUpdated?: string;
}

export default function MonaiProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('monai_projects')
        .select('*')
        .order('is_demo', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with metrics
      const enrichedProjects = await Promise.all((data || []).map(async (project) => {
        // Get latest drift run
        const { data: driftRuns } = await supabase
          .from('monai_drift_runs')
          .select('dsi, created_at')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const driftScore = driftRuns?.[0]?.dsi || null;
        const lastUpdated = driftRuns?.[0]?.created_at || project.created_at;
        const reliabilityScore = driftScore ? Math.max(0, 100 - driftScore) : null;

        return {
          ...project,
          reliabilityScore,
          driftScore,
          lastUpdated,
        };
      }));

      setProjects(enrichedProjects);
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

  const createProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('monai_projects')
        .insert({
          name: newProjectName.trim(),
          description: null,
          default_model_type: 'llm',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: `${newProjectName} has been created successfully`,
      });

      setNewProjectName("");
      setDialogOpen(false);
      loadProjects();
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
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
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <PageHeader
          title="Projects"
          subtitle="Select a project to view its reliability dashboard."
          showBack
          backTo="/"
          actions={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Set up a new project to monitor your AI systems
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="My AI Project"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !creating) {
                          createProject();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={createProject} 
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        {projects.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <img
              src={emptyProjectsImage}
              alt="No projects"
              className="mx-auto mb-6 w-96 h-56 object-contain opacity-60"
            />
            <h3 className="text-3xl font-semibold mb-3">Start Monitoring Your AI</h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              Create your first project or explore our demo to see MonAI in action.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="outline">
                Open Demo Project
              </Button>
              <Button size="lg" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link key={project.id} to={`/monai/projects/${project.id}`}>
                <GlassCard hover className="p-6 h-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-2xl font-semibold">{project.name}</h3>
                          {project.is_demo && (
                            <StatusPill variant="info">Demo</StatusPill>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reliability Score</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">
                            {project.reliabilityScore !== null && project.reliabilityScore !== undefined
                              ? Math.round(project.reliabilityScore)
                              : "-"}
                          </p>
                          {project.reliabilityScore && project.reliabilityScore > 85 && (
                            <TrendingUp className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Drift Score</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">
                            {project.driftScore !== null && project.driftScore !== undefined
                              ? Math.round(project.driftScore)
                              : "-"}
                          </p>
                          {project.driftScore && project.driftScore < 30 && (
                            <TrendingDown className="h-4 w-4 text-success" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-white/5">
                      <span>Last updated: {new Date(project.lastUpdated || project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
