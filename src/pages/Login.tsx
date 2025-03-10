
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      email: "",
      password: "",
      form: "",
    });
    
    // Validate inputs
    let hasError = false;
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      hasError = true;
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
      hasError = true;
    }
    
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      hasError = true;
    }
    
    if (hasError) return;
    
    // Simulate login
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If using real authentication, you would make an API call here
      
      // For demo purposes, simulate successful login and redirect
      navigate("/dashboard");
    } catch (error) {
      setErrors(prev => ({ ...prev, form: "Invalid email or password" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-5">
      <header className="py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
      </header>
      
      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <PageTransition>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          
          {errors.form && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-fade-in">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <PageTransition delay={100}>
              <InputField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                required
                autoComplete="email"
              />
            </PageTransition>
            
            <PageTransition delay={200}>
              <InputField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                required
                autoComplete="current-password"
              />
            </PageTransition>
            
            <PageTransition delay={300}>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border rounded transition-colors ${
                      rememberMe ? "bg-primary border-primary" : "border-input"
                    }`}>
                      {rememberMe && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-4 h-4 text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </PageTransition>
            
            <PageTransition delay={400}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="mt-8"
              >
                Sign in
              </Button>
            </PageTransition>
          </form>
          
          <PageTransition delay={500}>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </PageTransition>
        </PageTransition>
      </main>
    </div>
  );
};

export default Login;
