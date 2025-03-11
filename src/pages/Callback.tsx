
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '@/services/musicApi';
import { useToast } from "@/hooks/use-toast";

const Callback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        setError('Authentication failed: ' + errorParam);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: errorParam,
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code found');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "No authorization code found",
        });
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        await handleAuthCallback(code);
        toast({
          title: "Authentication Successful",
          description: "You've been successfully connected to Spotify",
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Error handling callback:', err);
        setError('Failed to authenticate with Spotify');
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Could not authenticate with Spotify",
        });
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processCallback();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="max-w-md text-center">
        {error ? (
          <div className="rounded-lg bg-red-900/30 p-6 text-white">
            <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
            <p className="mb-4">{error}</p>
            <p>Redirecting you back...</p>
          </div>
        ) : (
          <div className="rounded-lg bg-blue-900/30 p-6 text-white">
            <h1 className="mb-4 text-2xl font-bold">Connecting to Spotify</h1>
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
            <p>Please wait while we complete your authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Callback;
