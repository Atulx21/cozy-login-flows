
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, Music } from 'lucide-react';
import { initiateSpotifyLogin } from '@/services/musicApi';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      // For demo purposes, just show a successful login
      setTimeout(() => {
        toast({
          title: "Login Successful",
          description: "Welcome back to MoodTunes!",
        });
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifyLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSpotifyLogin();
  };
  
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600"
            >
              <Music className="h-6 w-6 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl font-bold"
            >
              MoodTunes
            </motion.h1>
          </div>
          
          {/* Main Content */}
          <div className="mt-10 flex flex-1 flex-col items-center justify-center py-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">Welcome Back</h2>
              <p className="text-white/70">Login to continue your music journey</p>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full max-w-md rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-md"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </Button>
                </div>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-black/20 px-2 text-sm text-white/60">or continue with</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-green-600 bg-green-600/20 text-white hover:bg-green-600/30"
                  onClick={handleSpotifyLogin}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Connect with Spotify
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-white/60">Don't have an account?</span>{' '}
                  <a 
                    href="/signup" 
                    className="font-medium text-blue-500 hover:text-blue-400"
                  >
                    Sign up
                  </a>
                </div>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 max-w-lg text-center"
            >
              <p className="mb-4 text-white/60">Experience personalized music recommendations based on your mood</p>
              <Button 
                variant="ghost" 
                className="group text-sm"
                onClick={() => navigate('/')}
              >
                Learn more
                <ArrowRightCircle className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
