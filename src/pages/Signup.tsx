import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Music } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:5050/api/auth/register',
        { name,email:username, password },
        { withCredentials: true } // Ensures cookies & authentication headers are sent
      );

      const data = response.data;
      localStorage.setItem('token', data.token);
      toast({ title: "SignUp Successful", description: `Welcome back, ${data.name}!` });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "SignUp  Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#0f0f19] text-white">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-7 w-7 text-blue-500" />
            <h1 className="text-xl font-bold">MoodTunes</h1>
          </Link>
        </header>
        
        <main className="relative flex flex-1 items-center justify-center p-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-[30%] right-[10%] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-3xl"></div>
          </div>
          
          <div className="relative w-full max-w-md">
            <div className="rounded-xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-center">
                <Music className="h-10 w-10 text-blue-500" />
              </div>
              
              <h2 className="mb-2 text-center text-2xl font-bold">Welcome back</h2>
              <p className="mb-6 text-center text-white/60">Enter your details to access your account</p>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="username" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-800"
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-white/60">
                  Already have an account Login{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="border-t border-white/10 bg-black/20 px-6 py-4 text-center text-sm text-white/60 backdrop-blur-md">
          © 2023 MoodTunes. All rights reserved.
        </footer>
      </div>
    </PageTransition>
  );
};

export default Signup;
