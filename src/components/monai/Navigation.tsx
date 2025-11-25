import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import monaiLogo from "@/assets/monai-logo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { PrimaryCtaButton } from "@/components/ui/primary-cta-button";

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
          ? 'linear-gradient(to right, rgba(4, 6, 22, 0.60), rgba(11, 18, 36, 0.60))'
          : 'linear-gradient(to right, rgba(4, 6, 22, 0.40), rgba(11, 18, 36, 0.40))',
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

      <div className="max-w-6xl mx-auto px-8 py-5">
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
            <PrimaryCtaButton to="/monai/projects" size="default" />
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
              background: 'linear-gradient(to right, rgba(4, 6, 22, 0.75), rgba(11, 18, 36, 0.75))',
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
              
              <div className="mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                <PrimaryCtaButton to="/monai/projects" size="default" className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
