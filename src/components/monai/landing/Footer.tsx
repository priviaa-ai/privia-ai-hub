import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import priviaLogo from "@/assets/privia-logo-white.png";

export const Footer = () => {
  const links = {
    Company: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    Products: [
      { label: "MonAI", href: "/" },
      { label: "Verity", href: "#" },
      { label: "Privy", href: "#" },
      { label: "DataVault", href: "#" },
      { label: "Lens AI", href: "#" },
      { label: "Cogni AI", href: "#" },
    ],
    Resources: [
      { label: "Docs", href: "/docs" },
      { label: "API Reference", href: "/docs" },
      { label: "Status", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  };

  return (
    <footer className="relative border-t border-white/10 mt-32">
      {/* Softened gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-0 mb-3">
              <img src={priviaLogo} alt="Privia AI Logo" className="h-10 w-auto" />
              <h3 className="text-2xl font-medium text-white">Privia AI</h3>
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-base font-medium mb-4 text-foreground">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("/") ? (
                      <Link
                        to={item.href}
                        className="text-sm font-medium text-muted-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground/80 hover:text-primary transition-colors duration-300"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium text-muted-foreground/80">© 2025 Privia AI. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex gap-5 items-center">
            <a
              href="https://x.com/PriviaAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(120,70,255,0.6)]"
              aria-label="Follow us on X (Twitter)"
            >
              <span className="text-lg">𝕏</span>
            </a>

            <a
              href="https://github.com/privia-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(120,70,255,0.6)]"
              aria-label="View our GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://linkedin.com/company/privia-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(120,70,255,0.6)]"
              aria-label="Connect with us on LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
