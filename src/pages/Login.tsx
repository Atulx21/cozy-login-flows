
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      
      // Simple validation
      if (username.trim() && password.trim()) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter both username and password.",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-5">
      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <PageTransition>
          <div className="mb-8">
            <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white">Hello</h1>
            <p className="text-white/90">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <PageTransition delay={100}>
              <InputField
                id="username"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                icon={<User className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>
            
            <PageTransition delay={200}>
              <InputField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-white/90 hover:text-white">
                Forgot your password?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-8 bg-white text-gray-800 hover:bg-white/90"
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-white/90">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Login;
