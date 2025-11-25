import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PrimaryCtaButtonProps {
  to: string;
  children?: React.ReactNode;
  size?: "default" | "sm";
  className?: string;
}

export function PrimaryCtaButton({ 
  to, 
  children = "Start Monitoring", 
  size = "default",
  className 
}: PrimaryCtaButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);
  };

  return (
    <Link to={to} onClick={handleClick}>
      <Button
        size={size}
        className={cn(
          "relative px-8 group overflow-hidden",
          "bg-[#1e3a8a] border border-transparent",
          "transition-all duration-500 ease-out",
          "active:scale-[0.98]",
          isClicked && "scale-[0.98]",
          "hover:bg-transparent",
          "hover:backdrop-blur-md",
          "hover:border-white/40",
          "before:absolute before:inset-0 before:left-0",
          "before:w-0 before:h-full",
          "before:bg-transparent before:backdrop-blur-md",
          "before:transition-all before:duration-500 before:ease-out",
          "group-hover:before:w-full",
          className
        )}
      >
        <span className="relative z-10 flex items-center text-white transition-all duration-300">
          {children}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-all duration-300 ease-out" />
        </span>
      </Button>
    </Link>
  );
}
