
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Music, Search, Home, History, LogOut } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useToast } from "@/hooks/use-toast";
import EmotionSelector from '@/components/EmotionSelector';
import SearchBar from '@/components/SearchBar';
import MusicPlayer from '@/components/MusicPlayer';
import TrackCard from '@/components/TrackCard';
import MoodHistoryItem from '@/components/MoodHistoryItem';
import { Track, MoodCategory, MoodHistory } from '@/types/music';
import { searchMusic, getMoodBasedRecommendations, fetchTopCharts, initiateSpotifyLogin } from '@/services/musicApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState<MoodCategory>('happy');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [activeView, setActiveView] = useState('feed'); // 'feed', 'search', 'liked', 'history'
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  
  // Load mood from navigation state if available
  useEffect(() => {
    if (location.state?.mood) {
      setSelectedMood(location.state.mood);
    }
  }, [location]);

  // Load liked songs and history from localStorage
  useEffect(() => {
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(savedLikedSongs));
      } catch (err) {
        console.error('Error loading liked songs:', err);
      }
    }
    
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      try {
        setMoodHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error('Error loading mood history:', err);
      }
    }
    
    // Initial music load based on selected mood
    loadMoodBasedMusic(selectedMood);
  }, []);

  // Save liked songs to localStorage when updated
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Save mood history to localStorage when updated
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Load music based on mood when mood changes
  useEffect(() => {
    if (activeView === 'feed') {
      loadMoodBasedMusic(selectedMood);
    }
  }, [selectedMood]);

  // Handle Spotify login
  useEffect(() => {
    // Check if user has a spotify token
    const spotifyToken = localStorage.getItem('spotify_access_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');
    
    // If token exists but expired, we should show a "reconnect" prompt
    if (spotifyToken && tokenExpiry && Number(tokenExpiry) < Date.now()) {
      toast({
        title: "Spotify Session Expired",
        description: "Please reconnect your Spotify account for the best experience.",
        action: (
          <button 
            onClick={() => initiateSpotifyLogin()}
            className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white"
          >
            Reconnect
          </button>
        )
      });
    }
  }, [toast]);

  const loadMoodBasedMusic = async (mood: MoodCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      const recommendations = await getMoodBasedRecommendations(mood);
      setTracks(recommendations);
      
      // Add this mood selection to history
      const now = new Date();
      const newHistoryItem: MoodHistory = {
        id: now.getTime().toString(),
        mood: mood,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tracks: recommendations
      };
      
      setMoodHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
      toast({
        title: "Mood Music Loaded",
        description: `Found ${recommendations.length} tracks for your ${mood} mood.`,
      });
    } catch (err) {
      console.error('Error loading mood music:', err);
      setError('Failed to load recommendations. Please try again.');
      
      toast({
        variant: "destructive",
        title: "Failed to Load Music",
        description: "There was an error getting your recommendations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setActiveView('search');
    
    try {
      const results = await searchMusic(term);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No results found. Try different keywords.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: MoodCategory) => {
    setSelectedMood(mood);
    setActiveView('feed');
  };

  // Toggle like/unlike a song
  const toggleLike = (track: Track) => {
    setLikedSongs(prevLikedSongs => {
      const isLiked = prevLikedSongs.some(song => song.id === track.id);
      
      if (isLiked) {
        return prevLikedSongs.filter(song => song.id !== track.id);
      } else {
        return [...prevLikedSongs, track];
      }
    });
  };

  // Check if a song is liked
  const isLiked = (trackId: string) => {
    return likedSongs.some(song => song.id === trackId);
  };

  // Clear history
  const clearHistory = () => {
    setMoodHistory([]);
    toast({
      title: "History Cleared",
      description: "Your mood history has been cleared.",
    });
  };

  // Playback controls
  const playTrack = (track: Track, trackList?: Track[]) => {
    const list = trackList || (activeView === 'liked' ? likedSongs : activeView === 'search' ? searchResults : tracks);
    const trackIndex = list.findIndex(t => t.id === track.id);
    
    setCurrentTrackIndex(trackIndex);
    setCurrentTrack(track);
    
    if (track.preview) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false); // Don't try to play tracks without previews
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

  const playPreviousTrack = () => {
    const currentList = activeView === 'liked' ? likedSongs : activeView === 'search' ? searchResults : tracks;
    if (currentList.length === 0 || currentTrackIndex <= 0) return;
    
    let newIndex = currentTrackIndex - 1;
    // Skip tracks without previews when going backwards
    while (newIndex >= 0 && !currentList[newIndex].preview) {
      newIndex--;
      if (newIndex < 0) {
        toast({
          title: "No Playable Tracks",
          description: "No previous tracks with previews available."
        });
        return;
      }
    }
    
    setCurrentTrackIndex(newIndex);
    setCurrentTrack(currentList[newIndex]);
    setIsPlaying(true);
  };

  const playNextTrack = () => {
    const currentList = activeView === 'liked' ? likedSongs : activeView === 'search' ? searchResults : tracks;
    if (currentList.length === 0 || currentTrackIndex >= currentList.length - 1) return;
    
    let newIndex = currentTrackIndex + 1;
    // Skip tracks without previews when going forward
    while (newIndex < currentList.length && !currentList[newIndex].preview) {
      newIndex++;
      if (newIndex >= currentList.length) {
        toast({
          title: "End of Playlist",
          description: "No more tracks with previews available."
        });
        return;
      }
    }
    
    setCurrentTrackIndex(newIndex);
    setCurrentTrack(currentList[newIndex]);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (currentTrack && !currentTrack.preview) {
      toast({
        variant: "warning",
        title: "No Preview Available",
        description: "This track doesn't have a preview. Open in Spotify to listen.",
        action: (
          <button 
            onClick={() => window.open(`https://open.spotify.com/track/${currentTrack.id}`, '_blank')}
            className="rounded bg-green-500 px-3 py-1 text-sm font-medium text-white"
          >
            Open
          </button>
        )
      });
      return;
    }
    setIsPlaying(prev => !prev);
  };

  // Handle sign out
  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  // Get current tracks list based on active view
  const getCurrentTracks = () => {
    switch (activeView) {
      case 'search':
        return searchResults;
      case 'liked':
        return likedSongs;
      case 'feed':
      default:
        return tracks;
    }
  };

  return (
    <PageTransition>
      <div className="flex h-screen w-full flex-col bg-[#0f0f19] text-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Music className="h-7 w-7 text-blue-500" />
            <h1 className="text-xl font-bold">MoodTunes</h1>
          </div>
          
          <div className="hidden items-center space-x-8 md:flex">
            <button 
              onClick={() => setActiveView('feed')}
              className={`flex items-center gap-2 px-2 py-1 ${activeView === 'feed' ? 'text-blue-500' : 'text-white/80 hover:text-white'}`}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              onClick={() => setActiveView('search')}
              className={`flex items-center gap-2 px-2 py-1 ${activeView === 'search' ? 'text-blue-500' : 'text-white/80 hover:text-white'}`}
            >
              <Search size={18} />
              <span>Explore</span>
            </button>
            <button 
              onClick={() => setActiveView('history')}
              className={`flex items-center gap-2 px-2 py-1 ${activeView === 'history' ? 'text-blue-500' : 'text-white/80 hover:text-white'}`}
            >
              <History size={18} />
              <span>History</span>
            </button>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar for mobile */}
          <aside className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/90 px-2 py-3 backdrop-blur-lg md:hidden">
            <div className="flex items-center justify-around">
              <button 
                onClick={() => setActiveView('feed')}
                className={`flex flex-col items-center p-2 ${activeView === 'feed' ? 'text-blue-500' : 'text-white/70'}`}
              >
                <Home size={20} />
                <span className="mt-1 text-xs">Home</span>
              </button>
              <button 
                onClick={() => setActiveView('search')}
                className={`flex flex-col items-center p-2 ${activeView === 'search' ? 'text-blue-500' : 'text-white/70'}`}
              >
                <Search size={20} />
                <span className="mt-1 text-xs">Explore</span>
              </button>
              <button 
                onClick={() => setActiveView('history')}
                className={`flex flex-col items-center p-2 ${activeView === 'history' ? 'text-blue-500' : 'text-white/70'}`}
              >
                <History size={20} />
                <span className="mt-1 text-xs">History</span>
              </button>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto pb-24">
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} loading={loading} />
            
            <div className="container mx-auto max-w-7xl p-6">
              {/* Mood Selector (only on feed view) */}
              {activeView === 'feed' && (
                <EmotionSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
              )}
              
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                  <p className="mt-4 text-white/70">Loading tracks...</p>
                </div>
              )}
              
              {error && (
                <div className="mx-auto my-8 flex max-w-md items-center rounded-lg bg-red-500/20 p-4 text-red-200">
                  <span className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-800/50">!</span>
                  <p>{error}</p>
                </div>
              )}
              
              {/* Current View Title and Description */}
              <div className="mb-8">
                {activeView === 'feed' && (
                  <>
                    <h1 className="text-4xl font-bold capitalize">
                      {selectedMood === 'discovery' ? 'Discover New Music' : `${selectedMood} Music`}
                    </h1>
                    <p className="mt-2 text-white/70">
                      {selectedMood === 'discovery' 
                        ? 'Discover great new tracks curated just for you.' 
                        : `Music that matches your ${selectedMood} mood.`}
                    </p>
                  </>
                )}
                
                {activeView === 'search' && (
                  <>
                    <h1 className="text-4xl font-bold">Search Results</h1>
                    <p className="mt-2 text-white/70">
                      {searchResults.length > 0 
                        ? `Found ${searchResults.length} tracks for your search.` 
                        : 'Search for your favorite songs, artists or albums.'}
                    </p>
                  </>
                )}
                
                {activeView === 'liked' && (
                  <>
                    <h1 className="text-4xl font-bold">Your Liked Tracks</h1>
                    <p className="mt-2 text-white/70">
                      {likedSongs.length > 0 
                        ? `You have ${likedSongs.length} liked tracks.` 
                        : 'Start adding tracks to your liked collection.'}
                    </p>
                  </>
                )}

                {activeView === 'history' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-bold">Your Dashboard</h1>
                      <p className="mt-2 text-white/70">
                        Track your mood and music recommendation history.
                      </p>
                    </div>
                    {moodHistory.length > 0 && (
                      <button 
                        onClick={clearHistory}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
                      >
                        Clear history
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* History View */}
              {activeView === 'history' && (
                <div className="space-y-6">
                  {moodHistory.length > 0 ? (
                    moodHistory.map(historyItem => (
                      <MoodHistoryItem
                        key={historyItem.id}
                        historyItem={historyItem}
                        isPlaying={isPlaying}
                        currentTrackId={currentTrack?.id || null}
                        onPlay={(trackId) => {
                          const track = historyItem.tracks.find(t => t.id === trackId);
                          if (track) playTrack(track, historyItem.tracks);
                        }}
                        onToggleLike={(trackId) => {
                          const track = historyItem.tracks.find(t => t.id === trackId);
                          if (track) toggleLike(track);
                        }}
                        isLiked={isLiked}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <History className="h-16 w-16 text-white/30" />
                      <h3 className="mt-6 text-xl font-semibold">No history yet</h3>
                      <p className="mt-2 max-w-md text-white/60">
                        Your mood selections and music recommendations will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Track Grid */}
              {!loading && !error && getCurrentTracks().length > 0 && activeView !== 'history' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {getCurrentTracks().map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying}
                      isCurrentTrack={currentTrack?.id === track.id}
                      onPlay={() => playTrack(track)}
                      onToggleLike={() => toggleLike(track)}
                      isLiked={isLiked(track.id)}
                    />
                  ))}
                </div>
              )}
              
              {/* Empty State */}
              {!loading && !error && getCurrentTracks().length === 0 && activeView !== 'history' && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Music className="h-16 w-16 text-white/30" />
                  <h3 className="mt-6 text-xl font-semibold">
                    {activeView === 'liked' 
                      ? 'No liked tracks yet' 
                      : activeView === 'search' 
                        ? 'No search results found' 
                        : 'No tracks available'}
                  </h3>
                  <p className="mt-2 max-w-md text-white/60">
                    {activeView === 'liked' 
                      ? 'Start liking songs to add them to your collection.' 
                      : activeView === 'search' 
                        ? 'Try searching for different keywords.' 
                        : 'Try selecting a different mood.'}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
        
        {/* Music Player - Fixed at the bottom */}
        {currentTrack && (
          <MusicPlayer
            currentTrack={currentTrack}
            tracks={getCurrentTracks()}
            isPlaying={isPlaying}
            onTogglePlay={togglePlayPause}
            onPrevious={playPreviousTrack}
            onNext={playNextTrack}
            onToggleLike={toggleLike}
            isLiked={isLiked}
          />
        )}
        
        {/* Footer - Only shows when not playing music */}
        {!currentTrack && (
          <footer className="mt-auto border-t border-white/10 bg-black/30 px-6 py-6 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <Music className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold">MoodTunes</h2>
                </div>
                
                <p className="text-sm text-white/60">© 2023 MoodTunes. All rights reserved.</p>
                
                <div className="flex gap-6">
                  <a href="#" className="text-white/60 hover:text-white">Privacy Policy</a>
                  <a href="#" className="text-white/60 hover:text-white">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
