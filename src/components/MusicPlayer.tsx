
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { Track } from '@/types/music';
import { useToast } from "@/hooks/use-toast";

interface MusicPlayerProps {
  currentTrack: Track | null;
  tracks: Track[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  tracks,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleLike,
  isLiked
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Playback error:', error);
          onTogglePlay(); // Stop playing if there's an error
          
          toast({
            variant: "destructive", 
            title: "Playback Error",
            description: "Could not play the selected track. Please try another."
          });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, onTogglePlay, toast]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      // Check if preview is available
      if (!currentTrack.preview) {
        toast({
          variant: "destructive",
          title: "No Preview Available",
          description: "This track doesn't have a preview. Try opening it in Spotify."
        });
        return;
      }
      
      audioRef.current.src = currentTrack.preview || '';
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Playback error:', error);
          onTogglePlay(); // Stop playing if there's an error
          
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Could not play the selected track. Please try another."
          });
        });
      }
    }
  }, [currentTrack, volume, isPlaying, onTogglePlay, toast]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = (Number(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const openInSpotify = () => {
    if (currentTrack?.spotifyUri) {
      window.open(`https://open.spotify.com/track/${currentTrack.id}`, '_blank');
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md md:py-4">
      <audio ref={audioRef} onEnded={onNext} />
      
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={currentTrack.albumArt} 
            alt={currentTrack.title} 
            className="h-12 w-12 rounded-md object-cover" 
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-white">{currentTrack.title}</h3>
            <p className="truncate text-xs text-white/70">{currentTrack.artist}</p>
          </div>
          <button 
            onClick={() => currentTrack && onToggleLike(currentTrack)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
          >
            <Heart 
              size={18} 
              className={isLiked(currentTrack.id) ? "fill-red-500 text-red-500" : "text-white/70"} 
            />
          </button>
        </div>
        
        <div className="flex flex-1 flex-col md:mx-6">
          <div className="mb-1 flex items-center justify-center gap-4">
            <button 
              className="rounded-full p-1 text-white/70 hover:text-white"
              onClick={onPrevious}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-white/90"
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              className="rounded-full p-1 text-white/70 hover:text-white"
              onClick={onNext}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="min-w-[40px] text-xs text-white/70">{formatTime(currentTime)}</span>
            <div className="relative flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={(duration ? (currentTime / duration) * 100 : 0)}
                onChange={handleProgressChange}
                ref={progressRef}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-blue-500"
              />
            </div>
            <span className="min-w-[40px] text-xs text-white/70">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="hidden items-center gap-2 md:flex">
          <Volume2 size={18} className="text-white/70" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume * 100}
            onChange={handleVolumeChange}
            className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-blue-500" 
          />
        </div>
      </div>
      
      {!currentTrack.preview && (
        <div className="mt-2 text-center">
          <p className="text-xs text-yellow-400">No preview available for this track</p>
          <button 
            onClick={openInSpotify}
            className="mt-1 text-xs text-blue-400 hover:underline"
          >
            Open in Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
