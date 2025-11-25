import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import monaiLogo from "@/assets/monai-logo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/monai/projects" },
  { label: "Docs", path: "/docs" },
  { label: "Pricing", path: "/pricing" },
];

export function Navigation() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        "border-b backdrop-blur-[18px]",
        isScrolled 
          ? "shadow-[0_8px_32px_rgba(0,0,0,0.12)]" 
          : "shadow-none"
      )}
      style={{
        background: 'rgba(6, 10, 25, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* Thin gradient glow line at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-40"
        style={{
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%)'
        }}
      />

      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - larger and more spacing */}
          <Link 
            to="/" 
            className="flex items-center gap-0 group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src={monaiLogo} 
              alt="MonAI" 
              className="w-14 h-14 object-contain transition-transform group-hover:scale-110"
            />
            <span 
              className="text-[26px] text-white -ml-2 font-semibold tracking-tight" 
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              MonAI
            </span>
          </Link>
          
          {/* Desktop nav links - center-right */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-300 group",
                    "text-gray-300 hover:text-white"
                  )}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <span 
                      className="absolute inset-0 -inset-x-3 -inset-y-1.5 rounded-full -z-10"
                      style={{ background: 'rgba(88, 120, 255, 0.12)' }}
                    />
                  )}
                  
                  <span className={isActive ? "text-white" : ""}>
                    {link.label}
                  </span>
                  
                  {/* Hover underline gradient */}
                  <span 
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/4 transition-all duration-300 rounded-full"
                    style={{ 
                      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))' 
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA Button - desktop */}
          <div className="hidden lg:block">
            <Link to="/monai/projects">
              <Button
                size="sm"
                className={cn(
                  "relative px-6 h-9 group overflow-hidden rounded-full",
                  "bg-[#1e3a8a] border border-transparent",
                  "transition-all duration-250 ease-out",
                  "hover:shadow-[0_0_24px_rgba(59,130,246,0.4)]",
                  "active:scale-[0.97]",
                  "before:absolute before:inset-0 before:left-0",
                  "before:w-0 before:h-full",
                  "before:bg-gradient-to-r before:from-blue-600 before:to-purple-600",
                  "before:transition-all before:duration-250 before:ease-out",
                  "hover:before:w-full"
                )}
              >
                <span className="relative z-10 flex items-center text-white text-sm font-medium">
                  Start monitoring
                  <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-250" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden mt-4 p-4 rounded-2xl backdrop-blur-[18px]"
            style={{
              background: 'rgba(6, 10, 25, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "text-white" 
                        : "text-gray-300 hover:text-white"
                    )}
                    style={isActive ? { background: 'rgba(88, 120, 255, 0.12)' } : {}}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <Link to="/monai/projects" className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full rounded-full bg-[#1e3a8a] hover:bg-[#2563eb] text-white"
                >
                  Start monitoring
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
