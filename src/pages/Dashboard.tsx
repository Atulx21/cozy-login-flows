
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Search, Home, History, LogOut, Heart, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  preview: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [activeView, setActiveView] = useState('feed'); // 'feed', 'search', 'liked'
  const [feedTracks, setFeedTracks] = useState<Track[]>([]);
  
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef<HTMLInputElement>(null);

  // Load liked songs from localStorage on initial render
  useEffect(() => {
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
      try {
        setLikedSongs(JSON.parse(savedLikedSongs));
      } catch (err) {
        console.error('Error loading liked songs:', err);
      }
    }
    
    // Load feed data
    fetchFeedData();
  }, []);

  // Save liked songs to localStorage when updated
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Fetch feed data (trending or recommended tracks)
  const fetchFeedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Using a default term to get some popular tracks for the feed
      const url = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent('top hits')}&locale=en-US&offset=0&limit=10`;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_SHAZAM_API || 'YOUR_SHAZAM_API_KEY',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      if (data.tracks?.hits) {
        const formattedTracks = data.tracks.hits.map((item: any) => ({
          id: item.track.key,
          title: item.track.title,
          artist: item.track.subtitle,
          albumArt: item.track.images?.coverart || 'https://via.placeholder.com/150',
          preview: item.track.hub?.actions?.find((action: any) => action.type === 'uri')?.uri || null
        }));
        setFeedTracks(formattedTracks);
      } else {
        setFeedTracks([]);
        setError('No feed tracks found');
      }
    } catch (err) {
      console.error('Error fetching feed data:', err);
      setError('Failed to load feed. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search function
  const searchShazam = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    setActiveView('search');
    
    try {
      const url = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent(searchTerm)}&locale=en-US&offset=0&limit=5`;
      
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_SHAZAM_API || 'YOUR_SHAZAM_API_KEY',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      
      if (data.tracks?.hits) {
        const formattedTracks = data.tracks.hits.map((item: any) => ({
          id: item.track.key,
          title: item.track.title,
          artist: item.track.subtitle,
          albumArt: item.track.images?.coverart || 'https://via.placeholder.com/150',
          preview: item.track.hub?.actions?.find((action: any) => action.type === 'uri')?.uri || null
        }));
        setTracks(formattedTracks);
      } else {
        setTracks([]);
        setError('No tracks found');
      }
    } catch (err) {
      console.error('Error fetching from Shazam:', err);
      setError('Failed to search tracks. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
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

  // Playback controls
  const playTrack = (track: Track, trackList?: Track[]) => {
    const list = trackList || (activeView === 'liked' ? likedSongs : activeView === 'feed' ? feedTracks : tracks);
    const trackIndex = list.findIndex(t => t.id === track.id);
    
    if (track.preview) {
      setCurrentTrackIndex(trackIndex);
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setError('No preview available for this track');
    }
  };

  const playPreviousTrack = () => {
    const currentList = activeView === 'liked' ? likedSongs : activeView === 'feed' ? feedTracks : tracks;
    if (currentList.length === 0 || currentTrackIndex <= 0) return;
    const newIndex = currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
    setCurrentTrack(currentList[newIndex]);
    setIsPlaying(true);
  };

  const playNextTrack = () => {
    const currentList = activeView === 'liked' ? likedSongs : activeView === 'feed' ? feedTracks : tracks;
    if (currentList.length === 0 || currentTrackIndex >= currentList.length - 1) return;
    const newIndex = currentTrackIndex + 1;
    setCurrentTrackIndex(newIndex);
    setCurrentTrack(currentList[newIndex]);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // Progress and volume controls
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (Number(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchShazam();
    }
  };

  // Audio handling effects
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleError = (e: any) => {
      console.error('Audio error:', e);
      setError('Error playing audio');
      setIsPlaying(false);
    };

    audio.addEventListener('error', handleError);
    
    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (currentTrack?.preview) {
      audio.src = currentTrack.preview;
      audio.load();
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Playback error:', err);
          setError('Failed to play track');
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Play error:', err);
        setError('Failed to play track');
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime || 0);
      if (progressBarRef.current && duration) {
        progressBarRef.current.value = String((audio.currentTime / duration) * 100);
      }
    };
    
    const setAudioEnd = () => {
      setCurrentTime(0);
      if (progressBarRef.current) {
        progressBarRef.current.value = '0';
      }
      const currentList = activeView === 'liked' ? likedSongs : activeView === 'feed' ? feedTracks : tracks;
      if (currentTrackIndex < currentList.length - 1) {
        playNextTrack();
      } else {
        setIsPlaying(false);
      }
    };
    
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', setAudioEnd);
    
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', setAudioEnd);
    };
  }, [currentTrackIndex, tracks, likedSongs, feedTracks, activeView]);

  // Handle sign out
  const handleSignOut = () => {
    navigate('/');
  };

  // Render track list helper function
  const renderTrackList = (trackList: Track[], listType: string) => {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trackList.map((track) => (
          <div 
            key={track.id} 
            className="relative overflow-hidden rounded-lg bg-black/20 text-white transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img 
                src={track.albumArt} 
                alt={track.title} 
                className="h-full w-full object-cover transition-transform hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button 
                onClick={() => playTrack(track, trackList)}
                className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
              >
                {currentTrack?.id === track.id && isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button 
                onClick={() => toggleLike(track)}
                className="absolute right-4 top-4 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-transform hover:scale-110"
              >
                <Heart 
                  size={20} 
                  className={isLiked(track.id) ? "fill-red-500 text-red-500" : "text-white"} 
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
          </div>
        ))}
      </div>
    );
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
              onClick={() => setActiveView('liked')}
              className={`flex items-center gap-2 px-2 py-1 ${activeView === 'liked' ? 'text-blue-500' : 'text-white/80 hover:text-white'}`}
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
                onClick={() => setActiveView('liked')}
                className={`flex flex-col items-center p-2 ${activeView === 'liked' ? 'text-blue-500' : 'text-white/70'}`}
              >
                <History size={20} />
                <span className="mt-1 text-xs">History</span>
              </button>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-24">
            {/* Search Bar */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-black/30 p-4 backdrop-blur-lg">
              <div className="mx-auto flex max-w-3xl items-center rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur-sm">
                <Search className="mr-3 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for songs, artists or albums..."
                  className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
                />
                <button 
                  onClick={searchShazam}
                  className="ml-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="container mx-auto max-w-7xl p-6">
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
              
              {/* Feed View */}
              {activeView === 'feed' && !loading && (
                <>
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold">Music for your mood</h1>
                    <p className="mt-2 text-white/70">Discover great music from our collection.</p>
                  </div>
                  
                  {feedTracks.length > 0 ? (
                    <div className="mb-10">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Your Daily Mix</h2>
                        <p className="text-white/60">Suggested tracks based on your listening habits</p>
                      </div>
                      
                      {renderTrackList(feedTracks, 'feed')}
                    </div>
                  ) : !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Music className="h-16 w-16 text-white/30" />
                      <h3 className="mt-6 text-xl font-semibold">Ready to discover music?</h3>
                      <p className="mt-2 max-w-md text-white/60">We'll suggest some great tracks for you.</p>
                    </div>
                  )}
                </>
              )}
              
              {/* Search Results View */}
              {activeView === 'search' && !loading && (
                <div className="mb-10">
                  {tracks.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Search Results</h2>
                        <p className="text-white/60">Results for "{searchTerm}"</p>
                      </div>
                      
                      {renderTrackList(tracks, 'search')}
                    </>
                  ) : !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="h-16 w-16 text-white/30" />
                      <h3 className="mt-6 text-xl font-semibold">Ready to search music?</h3>
                      <p className="mt-2 max-w-md text-white/60">Search for your favorite songs, artists, or albums to start listening</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Liked Songs View */}
              {activeView === 'liked' && !loading && (
                <div className="mb-10">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Listening History</h2>
                    <p className="text-white/60">{likedSongs.length} liked songs</p>
                  </div>
                  
                  {likedSongs.length > 0 ? (
                    renderTrackList(likedSongs, 'liked')
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Heart className="h-16 w-16 text-white/30" />
                      <h3 className="mt-6 text-xl font-semibold">No liked songs yet</h3>
                      <p className="mt-2 max-w-md text-white/60">Start liking songs to add them to your collection</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
        
        {/* Player Controls - Fixed at the bottom */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md md:bottom-0 md:py-4">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={currentTrack.albumArt} 
                  alt={currentTrack.title} 
                  className="h-12 w-12 rounded-md object-cover" 
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium">{currentTrack.title}</h3>
                  <p className="truncate text-xs text-white/70">{currentTrack.artist}</p>
                </div>
                <button 
                  onClick={() => toggleLike(currentTrack)}
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
                    className="rounded-full p-1 text-white/70 hover:text-white disabled:opacity-50"
                    onClick={playPreviousTrack}
                    disabled={currentTrackIndex <= 0}
                  >
                    <SkipBack size={20} />
                  </button>
                  
                  <button 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-white/90"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button 
                    className="rounded-full p-1 text-white/70 hover:text-white disabled:opacity-50"
                    onClick={playNextTrack}
                    disabled={currentTrackIndex >= (activeView === 'liked' ? likedSongs.length - 1 : activeView === 'feed' ? feedTracks.length - 1 : tracks.length - 1)}
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
                      ref={progressBarRef}
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
          </div>
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
