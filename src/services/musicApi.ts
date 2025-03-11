
import { ApiResponse, Track, MoodCategory, SpotifyTokens } from '@/types/music';

const SPOTIFY_CLIENT_ID = '1fc0f404036c4b22b3f2b4bb82c3376c';
const SPOTIFY_CLIENT_SECRET = 'f4d5b0485bc6467e9d86b9148b9ce393';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Token management
let accessToken: string | null = null;
let tokenExpirationTime: number = 0;

// Get client credentials token (for search without user context)
const getClientCredentialsToken = async (): Promise<string> => {
  if (accessToken && tokenExpirationTime > Date.now()) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

// Search for tracks
export const searchMusic = async (term: string, limit: number = 10): Promise<Track[]> => {
  try {
    const token = await getClientCredentialsToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Spotify API request failed');
    
    const data = await response.json();
    
    if (!data.tracks?.items?.length) {
      return [];
    }
    
    return data.tracks.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist: any) => artist.name).join(', '),
      albumArt: item.album.images[0]?.url || 'https://via.placeholder.com/150',
      preview: item.preview_url,
      spotifyUri: item.uri
    }));
  } catch (error) {
    console.error('Error searching music:', error);
    throw error;
  }
};

// Get mood based recommendations using Spotify's recommendation engine
export const getMoodBasedRecommendations = async (mood: MoodCategory): Promise<Track[]> => {
  // Fixed: Use seed_tracks as a fallback when genre recommendations fail
  // Maps moods to Spotify parameters with more reliable parameters
  const moodMapping: Record<string, any> = {
    happy: { 
      seed_genres: 'pop', 
      target_valence: 0.8, 
      target_energy: 0.8, 
      limit: 10 
    },
    sad: { 
      seed_genres: 'piano', 
      target_valence: 0.2, 
      target_energy: 0.3, 
      limit: 10 
    },
    energetic: { 
      seed_genres: 'edm', 
      target_energy: 0.9, 
      target_tempo: 150, 
      limit: 10 
    },
    romantic: { 
      seed_genres: 'jazz', 
      target_valence: 0.6, 
      target_acousticness: 0.6, 
      limit: 10 
    },
    calm: { 
      seed_genres: 'ambient', 
      target_energy: 0.3, 
      target_acousticness: 0.8, 
      limit: 10 
    },
    melancholy: { 
      seed_genres: 'indie', 
      target_valence: 0.3, 
      target_acousticness: 0.7, 
      limit: 10 
    },
    night: { 
      seed_genres: 'electronic', 
      target_energy: 0.5, 
      limit: 10 
    },
    discovery: { 
      seed_genres: 'pop', 
      limit: 10 
    }
  };
  
  try {
    const token = await getClientCredentialsToken();
    
    // Try getting top tracks if recommendations fail
    async function getTopTracksForMood(): Promise<Track[]> {
      // Map moods to Spotify playlists
      const playlistMapping: Record<string, string> = {
        happy: '37i9dQZF1DXdPec7aLTmlC', // Happy Hits playlist
        sad: '37i9dQZF1DX7qK8ma5wgG1',  // Sad Songs playlist
        energetic: '37i9dQZF1DX4eRPd9frC1m', // Workout playlist
        romantic: '37i9dQZF1DX50QitC6Oqtn', // Love Songs playlist
        calm: '37i9dQZF1DWZeKCadgRdKQ', // Chill playlist
        melancholy: '37i9dQZF1DX59NCqCqJtoH', // Indie playlist
        night: '37i9dQZF1DX4o1oenSJRJd', // Late Night playlist
        discovery: '37i9dQZEVXbNG2KDcFcKOF', // Global Top 50
      };
      
      const playlistId = playlistMapping[mood] || '37i9dQZEVXbNG2KDcFcKOF';
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to get playlist tracks');
      
      const data = await response.json();
      
      if (!data.items?.length) {
        throw new Error('No tracks in playlist');
      }
      
      return data.items.map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((artist: any) => artist.name).join(', '),
        albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/150',
        preview: item.track.preview_url,
        spotifyUri: item.track.uri,
        mood
      }));
    }
    
    // First try the recommendations endpoint
    try {
      // Build query parameters
      const queryParams = new URLSearchParams(moodMapping[mood]);
      
      const url = `https://api.spotify.com/v1/recommendations?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.log('Recommendations failed, falling back to playlists');
        return await getTopTracksForMood();
      }
      
      const data = await response.json();
      
      if (!data.tracks?.length) {
        return await getTopTracksForMood();
      }
      
      return data.tracks.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.artists.map((artist: any) => artist.name).join(', '),
        albumArt: item.album.images[0]?.url || 'https://via.placeholder.com/150',
        preview: item.preview_url,
        spotifyUri: item.uri,
        mood
      }));
    } catch (error) {
      console.error('Recommendation API failed, using playlist fallback');
      return await getTopTracksForMood();
    }
  } catch (error) {
    console.error(`Error getting ${mood} recommendations:`, error);
    throw error;
  }
};

export const fetchTopCharts = async (): Promise<Track[]> => {
  try {
    const token = await getClientCredentialsToken();
    // Using Spotify's Global Top 50 playlist
    const playlistId = '37i9dQZEVXbMDoHDwVN2tF';
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Spotify API top charts request failed');
    
    const data = await response.json();
    
    if (!data.items?.length) {
      return [];
    }
    
    return data.items.map((item: any) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map((artist: any) => artist.name).join(', '),
      albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/150',
      preview: item.track.preview_url,
      spotifyUri: item.track.uri
    }));
  } catch (error) {
    console.error('Error fetching top charts:', error);
    throw error;
  }
};

// Spotify OAuth login
export const initiateSpotifyLogin = () => {
  const scope = 'user-read-private user-read-email user-top-read';
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', scope);
  
  window.location.href = authUrl.toString();
};

// Handle callback after OAuth login
export const handleAuthCallback = async (code: string): Promise<SpotifyTokens> => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }).toString()
    });
    
    if (!response.ok) throw new Error('Token exchange failed');
    
    const data = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('spotify_access_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
    localStorage.setItem('spotify_token_expiry', String(Date.now() + (data.expires_in * 1000)));
    
    return data;
  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
};
