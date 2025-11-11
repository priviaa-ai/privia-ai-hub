import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mon AI
            </h1>
            <div className="flex gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-extrabold leading-tight">
            Intelligent Drift Monitoring — Fast.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload baseline + current CSVs. Get drift metrics in minutes.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link to="/projects">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Projects
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 text-center text-sm text-muted-foreground">
          Privia AI • Mon AI
        </div>
      </footer>
    </div>
  );
};

export default Landing;
