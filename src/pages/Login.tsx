
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '@/components/InputField';
import { useToast } from "@/hooks/use-toast";
import PageTransition from '@/components/PageTransition';
import { initiateSpotifyLogin } from '@/services/musicApi';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchFields = watch();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // For demo, just log in with Spotify
      initiateSpotifyLogin();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotifyLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSpotifyLogin();
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Music className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-white/60">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              id="email"
              type="email"
              label="Email"
              error={errors.email?.message}
              value={watchFields.email || ''}
              {...register('email')}
            />

            <InputField
              id="password"
              type="password"
              label="Password"
              error={errors.password?.message}
              value={watchFields.password || ''}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-white/60">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleSpotifyLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.369-.84.465-1.24.24-3.12-1.899-7.081-2.364-11.641-1.205-.434.105-.854-.17-.96-.6-.104-.43.171-.851.601-.955 5.04-1.26 9.48-.721 12.96 1.38.418.237.476.87.24 1.14zm1.44-3.18c-.301.42-1.021.6-1.56.3-3.6-2.22-9.001-2.881-13.201-1.561-.539.18-1.139-.121-1.32-.66-.18-.54.12-1.14.66-1.32 4.801-1.441 10.801-.72 14.941 1.801.539.3.659 1.02.36 1.44zm.12-3.3C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.601.18-1.2.78-1.381 4.32-1.32 11.52-1.08 16.08 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                fill="currentColor"
              />
            </svg>
            Continue with Spotify
          </button>

          <p className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
