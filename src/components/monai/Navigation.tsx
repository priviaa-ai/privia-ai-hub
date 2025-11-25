import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import monaiLogo from "@/assets/monai-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/monai/projects" },
  { label: "Docs", path: "/docs" },
  { label: "Pricing", path: "/pricing" },
];

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="border-b border-white/5 backdrop-blur-2xl bg-white/[0.02] sticky top-0 z-50 shadow-lg shadow-black/10">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src={monaiLogo} 
              alt="MonAI" 
              className="w-12 h-12 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl text-white -ml-1" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              MonAI
            </span>
          </Link>
          
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
