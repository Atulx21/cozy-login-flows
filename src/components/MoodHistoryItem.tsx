
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock } from 'lucide-react';
import { MoodHistory } from '@/types/music';
import TrackCard from './TrackCard';

interface MoodHistoryItemProps {
  historyItem: MoodHistory;
  isPlaying: boolean;
  currentTrackId: string | null;
  onPlay: (trackId: string) => void;
  onToggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
}

const MoodHistoryItem: React.FC<MoodHistoryItemProps> = ({
  historyItem,
  isPlaying,
  currentTrackId,
  onPlay,
  onToggleLike,
  isLiked
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const moodColors: Record<string, string> = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    energetic: 'bg-red-500',
    romantic: 'bg-pink-500',
    calm: 'bg-green-500',
    melancholy: 'bg-purple-500',
    night: 'bg-indigo-500',
    discovery: 'bg-gray-500'
  };
  
  const moodColor = moodColors[historyItem.mood] || 'bg-gray-500';
  
  return (
    <div className="mb-4 overflow-hidden rounded-lg bg-black/20 text-white transition-all">
      <div 
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`rounded-full ${moodColor} px-3 py-1 text-sm font-medium capitalize`}>
            {historyItem.mood}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={14} />
            <span>{historyItem.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock size={14} />
            <span>{historyItem.time}</span>
          </div>
        </div>
        
        <button className="rounded-full p-1 hover:bg-white/10">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
          {historyItem.tracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={isPlaying && currentTrackId === track.id}
              isCurrentTrack={currentTrackId === track.id}
              onPlay={() => onPlay(track.id)}
              onToggleLike={() => onToggleLike(track.id)}
              isLiked={isLiked(track.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodHistoryItem;
