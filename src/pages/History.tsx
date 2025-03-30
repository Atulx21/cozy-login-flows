
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useToast } from "@/hooks/use-toast";
import MoodHistoryItem from '@/components/MoodHistoryItem';
import { Track, MoodHistory, MoodCategory } from '@/types/music';

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [filterByMood, setFilterByMood] = useState<MoodCategory | 'all'>('all');
  
  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      try {
        setMoodHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading mood history:', err);
      }
    }
    
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(savedLikedSongs));
      } catch (err) {
        console.error('Error loading liked songs:', err);
      }
    }
  }, []);

  // Check if a song is liked
  const isLiked = (trackId: string) => {
    return likedSongs.some(song => song.id === trackId);
  };

  // Toggle like/unlike a song
  const toggleLike = (track: Track) => {
    setLikedSongs(prevLikedSongs => {
      const isAlreadyLiked = prevLikedSongs.some(song => song.id === track.id);
      
      const newLikedSongs = isAlreadyLiked
        ? prevLikedSongs.filter(song => song.id !== track.id)
        : [...prevLikedSongs, track];
      
      // Save to localStorage
      localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
      return newLikedSongs;
    });
  };

  // Play a track
  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause if it's the same track
      setIsPlaying(!isPlaying);
      return;
    }

    setCurrentTrack(track);
    
    if (track.preview) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      toast({
        variant: "destructive",
        title: "No Preview Available",
        description: "This track doesn't have a preview available. Open in Spotify to listen.",
        action: (
          <button 
            onClick={() => window.open(`https://open.spotify.com/track/${track.id}`, '_blank')}
            className="rounded bg-green-500 px-3 py-1 text-sm font-medium text-white"
          >
            Open
          </button>
        )
      });
    }
  };

  // Clear all history
  const clearHistory = () => {
    setMoodHistory([]);
    localStorage.setItem('moodHistory', JSON.stringify([]));
    toast({
      title: "History Cleared",
      description: "Your mood history has been cleared.",
    });
  };

  // Delete a specific history item
  const deleteHistoryItem = (id: string) => {
    const updatedHistory = moodHistory.filter(item => item.id !== id);
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    toast({
      title: "Entry Removed",
      description: "The history entry has been deleted.",
    });
  };

  // Filter history by mood
  const filteredHistory = filterByMood === 'all'
    ? moodHistory
    : moodHistory.filter(item => item.mood === filterByMood);

  // Get all unique moods from history
  const uniqueMoods = Array.from(
    new Set(moodHistory.map(item => item.mood))
  ) as MoodCategory[];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0f0f19] text-white">
        {/* Header with back button */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <HistoryIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold">Your Music History</h1>
            </div>
          </div>
          
          {moodHistory.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30"
            >
              <Trash2 size={16} />
              <span>Clear All History</span>
            </button>
          )}
        </header>
        
        <main className="container mx-auto max-w-7xl px-4 py-8">
          {/* Summary stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white/70">Total Sessions</h3>
              <p className="mt-2 text-2xl font-bold">{moodHistory.length}</p>
            </div>
            
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white/70">Most Common Mood</h3>
              <p className="mt-2 text-2xl font-bold capitalize">
                {uniqueMoods.length > 0 
                  ? uniqueMoods.reduce((a, b) => {
                      return moodHistory.filter(item => item.mood === a).length >=
                        moodHistory.filter(item => item.mood === b).length
                        ? a
                        : b;
                    })
                  : 'None'}
              </p>
            </div>
            
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white/70">Total Tracks</h3>
              <p className="mt-2 text-2xl font-bold">
                {moodHistory.reduce((sum, item) => sum + item.tracks.length, 0)}
              </p>
            </div>
            
            <div className="rounded-lg bg-black/20 p-4">
              <h3 className="text-sm font-medium text-white/70">Last Session</h3>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
                <Calendar size={20} className="text-blue-500" />
                {moodHistory.length > 0 ? moodHistory[0].date : 'None'}
              </p>
            </div>
          </div>
          
          {/* Mood filter */}
          {uniqueMoods.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-medium">Filter by Mood:</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterByMood('all')}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    filterByMood === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All Moods
                </button>
                
                {uniqueMoods.map((mood) => {
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
                  
                  return (
                    <button
                      key={mood}
                      onClick={() => setFilterByMood(mood)}
                      className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                        filterByMood === mood
                          ? moodColors[mood] || 'bg-blue-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* History items */}
          <div className="space-y-6">
            {filteredHistory.length > 0 ? (
              filteredHistory.map(historyItem => (
                <MoodHistoryItem
                  key={historyItem.id}
                  historyItem={historyItem}
                  isPlaying={isPlaying}
                  currentTrackId={currentTrack?.id || null}
                  onPlay={(trackId) => {
                    const track = historyItem.tracks.find(t => t.id === trackId);
                    if (track) playTrack(track);
                  }}
                  onToggleLike={(trackId) => {
                    const track = historyItem.tracks.find(t => t.id === trackId);
                    if (track) toggleLike(track);
                  }}
                  isLiked={isLiked}
                  onDelete={() => deleteHistoryItem(historyItem.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <HistoryIcon className="h-16 w-16 text-white/30" />
                <h3 className="mt-6 text-xl font-semibold">No history yet</h3>
                <p className="mt-2 max-w-md text-white/60">
                  {moodHistory.length === 0
                    ? "Your mood selections and music recommendations will appear here."
                    : "No results match your current filter. Try a different mood filter."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default History;
