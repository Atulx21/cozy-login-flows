
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-background">
      <PageTransition>
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <AnimatedLogo className="mb-8" />
          
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to <span className="text-primary">Apello</span>
            </h1>
            <p className="text-muted-foreground">
              A beautifully designed experience awaits you
            </p>
          </div>
          
          <div 
            className={cn(
              "w-full space-y-4 transition-all duration-500",
              mounted ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              as={Link}
              to="/login"
              variant="primary"
              size="lg"
              fullWidth
              className="shadow-elegant"
            >
              Sign In
            </Button>
            
            <Button
              as={Link}
              to="/signup"
              variant="outline"
              size="lg"
              fullWidth
            >
              Create Account
            </Button>
            
            <div className="pt-6 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Index;
