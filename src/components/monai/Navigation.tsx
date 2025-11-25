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
        "backdrop-blur-[20px]",
        isScrolled 
          ? "shadow-[0_4px_24px_rgba(0,0,0,0.12)]" 
          : "shadow-none"
      )}
      style={{
        background: isScrolled 
          ? 'linear-gradient(to right, rgba(4, 6, 22, 0.75), rgba(11, 18, 36, 0.75))'
          : 'linear-gradient(to right, rgba(4, 6, 22, 0.5), rgba(11, 18, 36, 0.5))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'background 300ms ease-out, box-shadow 300ms ease-out'
      }}
    >
      {/* Three-column grid layout for perfect centering */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2.5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          
          {/* Left - Logo */}
          <div className="flex items-center justify-start">
            <Link 
              to="/" 
              className="flex items-center gap-0 group" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img 
                src={monaiLogo} 
                alt="MonAI" 
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110 brightness-110"
              />
              <span 
                className="text-[22px] text-white -ml-1.5 font-semibold tracking-tight brightness-110" 
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                MonAI
              </span>
            </Link>
          </div>
          
          {/* Center - Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-200 group py-1",
                    isActive ? "text-white" : "hover:text-white"
                  )}
                  style={{
                    color: isActive ? 'rgb(255, 255, 255)' : 'rgba(248, 250, 252, 0.7)',
                    transition: 'color 200ms ease-out'
                  }}
                >
                  <span>{link.label}</span>
                  
                  {/* Glowing underline pill on hover/active */}
                  <span 
                    className={cn(
                      "absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-[16px] rounded-full transition-all duration-200",
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

          {/* Right - CTA Button */}
          <div className="flex items-center justify-end">
            <Link to="/monai/projects" className="hidden lg:block">
              <Button
                size="sm"
                className={cn(
                  "relative px-5 py-2 h-9 group overflow-hidden rounded-lg",
                  "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]",
                  "border border-blue-400/20",
                  "transition-all duration-300 ease-out",
                  "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                  "hover:border-blue-400/40",
                  "active:scale-[0.98]"
                )}
              >
                <span className="relative z-10 flex items-center text-white text-sm font-medium">
                  Start Monitoring
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden mt-3 p-4 rounded-xl backdrop-blur-[20px]"
            style={{
              background: 'linear-gradient(to right, rgba(4, 6, 22, 0.85), rgba(11, 18, 36, 0.85))',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center",
                      isActive ? "text-white" : "hover:text-white"
                    )}
                    style={{
                      color: isActive ? 'rgb(255, 255, 255)' : 'rgba(248, 250, 252, 0.7)',
                      background: isActive ? 'rgba(96, 165, 250, 0.12)' : 'transparent'
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="mt-3 pt-3 border-t border-white/10">
                <Link 
                  to="/monai/projects" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    size="sm"
                    className={cn(
                      "w-full relative px-5 py-2 h-9 group overflow-hidden rounded-lg",
                      "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]",
                      "border border-blue-400/20",
                      "transition-all duration-300 ease-out",
                      "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center text-white text-sm font-medium">
                      Start Monitoring
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
