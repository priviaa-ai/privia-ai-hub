import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Webhook = () => {
  const { toast } = useToast();
  const baseUrl = "https://api.monai.app";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const curlExample = `curl -X POST "${baseUrl}/api/ingest" \\
  -F project_id=<PROJECT_UUID> \\
  -F baseline_id=orders_2025_09 \\
  -F current_id=orders_2025_10_15 \\
  -F baseline_file=@baseline.csv \\
  -F current_file=@current.csv`;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon AI
              </h1>
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link to="/webhook" className="text-foreground font-medium">
                Webhook
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Webhook API</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Send your run data via HTTP. We compute and store drift metrics just like CSV uploads.
        </p>

        <div className="space-y-6 max-w-4xl">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create/Select a Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to <Link to="/projects" className="text-primary hover:underline">Projects</Link> and copy your Project ID from Settings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Send a POST Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload baseline + current CSV files (or JSON in future versions).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Drift Metrics</h3>
                  <p className="text-sm text-muted-foreground">
                    We compute DSI, drift ratio, and drifted features, then respond with the results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Endpoint</CardTitle>
              <CardDescription>POST to this URL with multipart/form-data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded border border-border">
                  POST {baseUrl}/api/ingest
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`POST ${baseUrl}/api/ingest`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>cURL Example</CardTitle>
              <CardDescription>Multipart file upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 bg-muted rounded border border-border overflow-x-auto text-sm">
                  <code>{curlExample}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(curlExample)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Request Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">project_id</code>
                  <span className="ml-2 text-sm text-muted-foreground">(required) Your project UUID</span>
                </div>
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">baseline_id</code>
                  <span className="ml-2 text-sm text-muted-foreground">(required) Identifier for baseline dataset</span>
                </div>
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">current_id</code>
                  <span className="ml-2 text-sm text-muted-foreground">(required) Identifier for current dataset</span>
                </div>
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">baseline_file</code>
                  <span className="ml-2 text-sm text-muted-foreground">(required) CSV file for baseline</span>
                </div>
                <div>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">current_file</code>
                  <span className="ml-2 text-sm text-muted-foreground">(required) CSV file for current data</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Max file size: 10MB per file</li>
                <li>• Max columns: 200</li>
                <li>• Max rows: 200,000</li>
                <li>• CSV headers must match exactly (case-sensitive)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Webhook;
