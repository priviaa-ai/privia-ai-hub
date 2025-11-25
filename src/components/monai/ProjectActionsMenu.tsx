import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit2, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectActionsMenuProps {
  projectId: string;
  projectName: string;
  isArchived?: boolean;
  onUpdate?: () => void;
  variant?: "card" | "page";
}

export function ProjectActionsMenu({ 
  projectId, 
  projectName, 
  isArchived = false,
  onUpdate,
  variant = "card" 
}: ProjectActionsMenuProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(projectName);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('monai_projects')
        .update({ name: newName.trim() })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project renamed successfully",
      });
      setRenameDialogOpen(false);
      onUpdate?.();
    } catch (error: any) {
      console.error('Error renaming project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to rename project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('monai_projects')
        .update({ is_archived: !isArchived })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: isArchived ? "Project unarchived successfully" : "Project archived successfully",
      });
      onUpdate?.();
    } catch (error: any) {
      console.error('Error archiving project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to archive project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        title: "Error",
        description: 'Please type "DELETE" to confirm',
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('monai_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      setDeleteDialogOpen(false);
      
      if (variant === "page") {
        navigate('/monai/projects');
      } else {
        onUpdate?.();
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-white/10">
          <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Rename project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            {isArchived ? "Unarchive" : "Archive"} project
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will permanently delete this project and all its data. This action cannot be undone.
              </p>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">
                  Type <strong>DELETE</strong> to confirm
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading || deleteConfirmText !== "DELETE"}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}