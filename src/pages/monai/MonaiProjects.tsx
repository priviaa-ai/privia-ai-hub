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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProjectActionsMenu } from "@/components/monai/ProjectActionsMenu";
import { Switch } from "@/components/ui/switch";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  default_model_type: string;
  is_demo: boolean;
  is_archived: boolean;
  project_type: string;
  reliabilityScore?: number;
  driftScore?: number;
  lastUpdated?: string;
}

const PROJECTS_PER_PAGE = 12;

export default function MonaiProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectType, setProjectType] = useState<string>("hybrid");
  const [creating, setCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    loadProjects();
  }, [currentPage, showArchived]);

  const loadProjects = async () => {
    try {
      // When showing archived, fetch ALL projects (both active and archived)
      // Otherwise, only fetch active projects
      const countQuery = supabase
        .from('monai_projects')
        .select('*', { count: 'exact', head: true });
      
      if (!showArchived) {
        countQuery.eq('is_archived', false);
      }
      
      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Fetch paginated projects
      const from = (currentPage - 1) * PROJECTS_PER_PAGE;
      const to = from + PROJECTS_PER_PAGE - 1;

      const projectsQuery = supabase
        .from('monai_projects')
        .select('*')
        .order('is_demo', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!showArchived) {
        projectsQuery.eq('is_archived', false);
      }

      const { data: projectsData, error: projectsError } = await projectsQuery;

      if (projectsError) throw projectsError;
      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return;
      }

      // Fetch all drift runs for current page projects in a single query
      const projectIds = projectsData.map(p => p.id);
      const { data: driftRuns } = await supabase
        .from('monai_drift_runs')
        .select('project_id, dsi, created_at')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      // Create a map of project_id to latest drift run
      const driftMap = new Map<string, { dsi: number; created_at: string }>();
      driftRuns?.forEach(run => {
        if (!driftMap.has(run.project_id)) {
          driftMap.set(run.project_id, { dsi: run.dsi, created_at: run.created_at });
        }
      });

      // Enrich projects with metrics
      const enrichedProjects = projectsData.map(project => {
        const drift = driftMap.get(project.id);
        const driftScore = drift?.dsi || null;
        const lastUpdated = drift?.created_at || project.created_at;
        const reliabilityScore = driftScore ? Math.max(0, 100 - driftScore) : null;

        return {
          ...project,
          reliabilityScore,
          driftScore,
          lastUpdated,
        };
      });

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
          project_type: projectType,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: `${newProjectName} has been created successfully`,
      });

      setNewProjectName("");
      setProjectType("hybrid");
      setDialogOpen(false);
      setCurrentPage(1);
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-archived" className="text-sm text-muted-foreground">
                  Show archived
                </Label>
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
              </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="project-type">Project Type</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger id="project-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">ML</SelectItem>
                          <SelectItem value="llm">LLM</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>
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
          <>
            {/* Active Projects */}
            {!showArchived || projects.some(p => !p.is_archived) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.filter(p => !p.is_archived).map((project) => (
                  <GlassCard key={project.id} hover className="p-6 h-full relative">
                    <div className="absolute top-4 right-4 z-10">
                      <ProjectActionsMenu
                        projectId={project.id}
                        projectName={project.name}
                        isArchived={project.is_archived}
                        onUpdate={loadProjects}
                        variant="card"
                      />
                    </div>
                    <Link to={`/monai/projects/${project.id}`} className="block">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between pr-8">
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
                          <span>Type: {project.project_type?.toUpperCase() || 'Hybrid'}</span>
                          <span>•</span>
                          <span>Last updated: {new Date(project.lastUpdated || project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>
                ))}
              </div>
            ) : null}

            {/* Archived Projects */}
            {showArchived && projects.some(p => p.is_archived) && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold text-muted-foreground mb-6">Archived Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.filter(p => p.is_archived).map((project) => (
                    <GlassCard key={project.id} hover className="p-6 h-full relative opacity-70">
                      <div className="absolute top-4 right-4 z-10">
                        <ProjectActionsMenu
                          projectId={project.id}
                          projectName={project.name}
                          isArchived={project.is_archived}
                          onUpdate={loadProjects}
                          variant="card"
                        />
                      </div>
                      <Link to={`/monai/projects/${project.id}`} className="block">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start justify-between pr-8">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-2xl font-semibold">{project.name}</h3>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                                  Archived
                                </span>
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
                            <span>Type: {project.project_type?.toUpperCase() || 'Hybrid'}</span>
                            <span>•</span>
                            <span>Last updated: {new Date(project.lastUpdated || project.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {totalCount > PROJECTS_PER_PAGE && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(totalCount / PROJECTS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / PROJECTS_PER_PAGE), p + 1))}
                    className={currentPage === Math.ceil(totalCount / PROJECTS_PER_PAGE) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}
