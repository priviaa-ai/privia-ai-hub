import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import emptyLogsImage from "@/assets/empty-logs.png";

interface EmbeddingVector {
  id: string;
  vector: any;
  cluster_label: string | null;
  created_at: string;
}

export default function ProjectEmbeddings() {
  const { projectId } = useParams();
  const [embeddings, setEmbeddings] = useState<EmbeddingVector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmbeddings();
  }, [projectId]);

  const loadEmbeddings = async () => {
    try {
      const { data, error } = await supabase
        .from("monai_embedding_vectors")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setEmbeddings(data || []);
    } catch (error) {
      console.error("Error loading embeddings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate clusters
  const clusterCounts = embeddings.reduce((acc, emb) => {
    const label = emb.cluster_label || "unclustered";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const numClusters = Object.keys(clusterCounts).length;

  // For visualization, we'll use first two dimensions
  const scatterData = embeddings.slice(0, 50).map((emb) => ({
    x: emb.vector[0] || 0,
    y: emb.vector[1] || 0,
    cluster: emb.cluster_label || "none",
  }));

  if (loading) {
    return (
      <>
        <Navigation />
        <ProjectTabs />
        <div className="container mx-auto px-6 py-12">
          <p className="text-muted-foreground">Loading embeddings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <ProjectTabs />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <PageHeader
          title="Embedding Explorer"
          subtitle="Visualize and analyze your embedding vectors"
          showBack={true}
          backTo="/monai/projects"
        />

        {embeddings.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <img
              src={emptyLogsImage}
              alt="No embeddings"
              className="mx-auto mb-6 w-64 h-40 object-contain opacity-60"
            />
            <h3 className="text-2xl font-semibold mb-2">No Embeddings Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start sending embedding vectors to visualize them here.
            </p>
          </GlassCard>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Vectors</p>
                <p className="text-3xl font-bold">{embeddings.length}</p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Clusters Detected</p>
                <p className="text-3xl font-bold">{numClusters}</p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Dimensions</p>
                <p className="text-3xl font-bold">
                  {embeddings[0]?.vector?.length || 0}
                </p>
              </GlassCard>
            </div>

            {/* Scatter Plot */}
            <GlassCard className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">2D Projection (First Two Dimensions)</h2>
              <div className="relative w-full h-96 bg-black/30 rounded-lg overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
                  {/* Grid */}
                  <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="300" y1="0" x2="300" y2="400" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  
                  {/* Points */}
                  {scatterData.map((point, idx) => {
                    const colors: Record<string, string> = {
                      none: "#6366f1",
                      cluster_0: "#06b6d4",
                      cluster_1: "#8b5cf6",
                      cluster_2: "#ec4899",
                      cluster_3: "#10b981",
                    };
                    const color = colors[point.cluster] || colors.none;
                    
                    // Normalize coordinates to fit in viewport
                    const x = 300 + point.x * 50;
                    const y = 200 - point.y * 50;
                    
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={color}
                        opacity="0.8"
                        className="hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <title>
                          Cluster: {point.cluster}
                          {"\n"}x: {point.x.toFixed(3)}
                          {"\n"}y: {point.y.toFixed(3)}
                        </title>
                      </circle>
                    );
                  })}
                </svg>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Showing first 50 vectors. Hover over points for details.
              </p>
            </GlassCard>

            {/* Cluster Distribution */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cluster Distribution</h2>
              <div className="space-y-3">
                {Object.entries(clusterCounts).map(([label, count]) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-muted-foreground">{label}</div>
                    <div className="flex-1 bg-black/30 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${(count / embeddings.length) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-medium">{count}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </>
  );
}
