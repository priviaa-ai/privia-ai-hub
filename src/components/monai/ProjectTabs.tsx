import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, TrendingUp, MessageSquare, Network, FileText, Settings } from "lucide-react";

const tabs = [
  { label: "Overview", path: "", icon: LayoutDashboard },
  { label: "Drift", path: "/drift", icon: TrendingUp },
  { label: "LLM", path: "/llm", icon: MessageSquare },
  { label: "Embeddings", path: "/embeddings", icon: Network },
  { label: "Logs", path: "/logs", icon: FileText },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function ProjectTabs() {
  const location = useLocation();
  const { projectId } = useParams();
  
  return (
    <nav className="border-b border-white/5 bg-black/20 backdrop-blur-sm mb-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-1 -mb-px">
          {tabs.map((tab) => {
            const fullPath = `/monai/projects/${projectId}${tab.path}`;
            const isActive = location.pathname === fullPath;
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.path}
                to={fullPath}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
