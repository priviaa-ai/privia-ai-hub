import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/monai/Navigation";
import { ProjectTabs } from "@/components/monai/ProjectTabs";
import { PageHeader } from "@/components/monai/PageHeader";
import { GlassCard } from "@/components/monai/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InteractiveNetworkCard } from "@/components/monai/InteractiveNetworkCard";

interface Event {
  id: string;
  event_type: string;
  payload_json: any;
  created_at: string;
}

export default function ProjectLogs() {
  const { projectId } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [projectId]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("monai_events")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(event.payload_json)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <ProjectTabs />
        <div className="container mx-auto px-6 py-12">
          <p className="text-muted-foreground">Loading logs...</p>
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
          title="Event Logs" 
          subtitle="Monitor and debug system events"
          showBack={true}
          backTo="/monai/projects"
        />

        {events.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="mx-auto mb-6 max-w-2xl">
              <InteractiveNetworkCard />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Events Logged Yet</h3>
            <p className="text-muted-foreground mb-6">
              Events will appear here once you start sending data to MonAI.
            </p>
          </GlassCard>
        ) : (
          <>
            {/* Search and Filters */}
            <GlassCard className="p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </GlassCard>

            {/* Events Table */}
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Timestamp
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Event Type
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Payload Preview
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(event)}
                      >
                        <td className="p-4 text-sm">
                          {new Date(event.created_at).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                            {event.event_type}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <code className="text-xs">
                            {JSON.stringify(event.payload_json).substring(0, 80)}
                            {JSON.stringify(event.payload_json).length > 80 ? "..." : ""}
                          </code>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                <p className="font-mono text-sm mt-1">{selectedEvent.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="mt-1">{selectedEvent.event_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <p className="mt-1">{new Date(selectedEvent.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payload</label>
                <pre className="mt-1 bg-black/50 p-4 rounded text-xs overflow-x-auto">
                  {JSON.stringify(selectedEvent.payload_json, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
