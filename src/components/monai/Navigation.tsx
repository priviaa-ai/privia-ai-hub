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
        "border-b backdrop-blur-[24px]",
        isScrolled 
          ? "shadow-[0_8px_32px_rgba(0,0,0,0.18)]" 
          : "shadow-none"
      )}
      style={{
        background: isScrolled 
          ? 'linear-gradient(to right, rgba(4, 6, 22, 0.90), rgba(11, 18, 36, 0.90))'
          : 'linear-gradient(to right, rgba(4, 6, 22, 0.70), rgba(11, 18, 36, 0.70))',
        borderColor: 'transparent',
        transition: 'background 300ms ease-out'
      }}
    >
      {/* Subtle blue glow line at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'rgba(96, 165, 250, 0.3)',
        }}
      />

      <div className="container mx-auto px-8 py-5">
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
              className="w-16 h-16 object-contain transition-transform group-hover:scale-110 brightness-110"
            />
            <span 
              className="text-[28px] text-white -ml-2 font-semibold tracking-tight brightness-110" 
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
                    "relative text-sm font-medium transition-all duration-200 group",
                    isActive ? "text-white" : "hover:text-white"
                  )}
                  style={{
                    color: isActive ? 'rgb(255, 255, 255)' : 'rgba(248, 250, 252, 0.78)',
                    transition: 'color 200ms ease-out'
                  }}
                >
                  <span>{link.label}</span>
                  
                  {/* Glowing underline pill on hover/active */}
                  <span 
                    className={cn(
                      "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[18px] rounded-full transition-all duration-200",
                      isActive || "opacity-0 group-hover:opacity-100"
                    )}
                    style={{ 
                      background: 'rgba(96, 165, 250, 0.9)',
                      boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)',
                      opacity: isActive ? 1 : undefined
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
                  "border border-transparent",
                  "transition-all duration-160 ease-out",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                  "hover:shadow-[0_0_28px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(96,165,250,0.15)]"
                )}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                }}
              >
                <span className="relative z-10 flex items-center text-white text-sm font-medium">
                  Start monitoring
                  <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-160" />
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
            className="lg:hidden mt-4 p-4 rounded-2xl backdrop-blur-[24px]"
            style={{
              background: 'linear-gradient(to right, rgba(4, 6, 22, 0.95), rgba(11, 18, 36, 0.95))',
              border: '1px solid rgba(96, 165, 250, 0.2)'
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
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive ? "text-white" : "hover:text-white"
                    )}
                    style={{
                      color: isActive ? 'rgb(255, 255, 255)' : 'rgba(248, 250, 252, 0.78)',
                      background: isActive ? 'rgba(96, 165, 250, 0.15)' : 'transparent'
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <Link to="/monai/projects" className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full rounded-full text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  }}
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
