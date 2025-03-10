
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";

const Signup = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    form: "",
  });

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
      form: "",
    });
    
    // Validate inputs
    let hasError = false;
    
    if (!name) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      hasError = true;
    }
    
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
    } else if (!validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
      hasError = true;
    }
    
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
      hasError = true;
    } else if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      hasError = true;
    }
    
    if (!agreeTerms) {
      setErrors(prev => ({ ...prev, terms: "You must agree to the terms and conditions" }));
      hasError = true;
    }
    
    if (hasError) return;
    
    // Simulate signup
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If using real authentication, you would make an API call here
      
      // For demo purposes, simulate successful signup and redirect
      navigate("/dashboard");
    } catch (error) {
      setErrors(prev => ({ ...prev, form: "An error occurred. Please try again." }));
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
      
      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full pb-8">
        <PageTransition>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Create an account</h1>
            <p className="text-muted-foreground">Enter your details to get started</p>
          </div>
          
          {errors.form && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-fade-in">
              {errors.form}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <PageTransition delay={100}>
              <InputField
                id="name"
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                error={errors.name}
                required
                autoComplete="name"
              />
            </PageTransition>
            
            <PageTransition delay={150}>
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
                autoComplete="new-password"
              />
            </PageTransition>
            
            <PageTransition delay={250}>
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </PageTransition>
            
            <PageTransition delay={300}>
              <div className="pt-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border rounded transition-colors ${
                      agreeTerms ? "bg-primary border-primary" : "border-input"
                    } ${errors.terms ? "border-destructive" : ""}`}>
                      {agreeTerms && (
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
                  <span className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-destructive text-xs ml-6 mt-1 animate-slide-down">
                    {errors.terms}
                  </p>
                )}
              </div>
            </PageTransition>
            
            <PageTransition delay={350}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="mt-8"
              >
                Create account
              </Button>
            </PageTransition>
          </form>
          
          <PageTransition delay={400}>
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </PageTransition>
        </PageTransition>
      </main>
    </div>
  );
};

export default Signup;
