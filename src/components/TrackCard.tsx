
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart } from 'lucide-react';
import { Track } from '@/types/music';

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: () => void;
  onToggleLike: () => void;
  isLiked: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  onPlay,
  onToggleLike,
  isLiked
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-lg bg-black/20 text-white transition-all hover:bg-black/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={track.albumArt} 
          alt={track.title} 
          className="h-full w-full object-cover transition-transform hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <button 
          onClick={onPlay}
          className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
        >
          {isCurrentTrack && isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button 
          onClick={onToggleLike}
          className="absolute right-4 top-4 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart 
            size={20} 
            className={isLiked ? "fill-red-500 text-red-500" : "text-white"} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-bold tracking-tight text-white">{track.title}</h3>
        <p className="text-sm text-white/80">{track.artist}</p>
        {track.preview ? (
          <span className="mt-2 inline-block text-xs text-blue-400">Preview Available</span>
        ) : (
          <span className="mt-2 inline-block text-xs text-white/50">No Preview</span>
        )}
      </div>
    </motion.div>
  );
};

export default TrackCard;
