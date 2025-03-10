
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className }: AnimatedLogoProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "relative w-20 h-20 flex items-center justify-center transition-all duration-1000",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      className
    )}>
      <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle"></div>
      <div className="absolute inset-2 bg-primary/20 rounded-full animate-pulse-subtle [animation-delay:0.5s]"></div>
      <div className="relative text-3xl font-semibold text-primary animate-float">
        A
      </div>
    </div>
  );
};

export default AnimatedLogo;
