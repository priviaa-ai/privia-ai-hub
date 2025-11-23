import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Pricing from "./pages/monai/Pricing";
import Docs from "./pages/monai/Docs";
import DocsWebhooks from "./pages/monai/DocsWebhooks";
import DocsSDK from "./pages/monai/DocsSDK";
import MonaiProjects from "./pages/monai/MonaiProjects";
import ProjectOverview from "./pages/monai/ProjectOverview";
import ProjectDrift from "./pages/monai/ProjectDrift";
import ProjectLLM from "./pages/monai/ProjectLLM";
import ProjectSettings from "./pages/monai/ProjectSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public marketing pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs/webhooks" element={<DocsWebhooks />} />
          <Route path="/docs/sdk" element={<DocsSDK />} />
          
          {/* MonAI app pages - no auth required for public beta */}
          <Route path="/monai/projects" element={<MonaiProjects />} />
          <Route path="/monai/projects/:projectId" element={<ProjectOverview />} />
          <Route path="/monai/projects/:projectId/drift" element={<ProjectDrift />} />
          <Route path="/monai/projects/:projectId/llm" element={<ProjectLLM />} />
          <Route path="/monai/projects/:projectId/settings" element={<ProjectSettings />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
