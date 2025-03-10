
import { ApiResponse, Track, MoodCategory } from '@/types/music';

const SHAZAM_API_KEY = 'acdfdaf683mshb9e4695beda4392p1840fcjsn7bab59b866f4';
const SHAZAM_API_HOST = 'shazam.p.rapidapi.com';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': SHAZAM_API_KEY,
    'X-RapidAPI-Host': SHAZAM_API_HOST
  }
};

export const searchMusic = async (term: string, limit: number = 10): Promise<Track[]> => {
  try {
    const url = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent(term)}&locale=en-US&offset=0&limit=${limit}`;
    
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('API request failed');
    
    const data: ApiResponse = await response.json();
    
    if (!data.tracks?.hits?.length) {
      return [];
    }
    
    return data.tracks.hits.map(item => ({
      id: item.track.key,
      title: item.track.title,
      artist: item.track.subtitle,
      albumArt: item.track.images?.coverart || 'https://via.placeholder.com/150',
      preview: item.track.hub?.actions?.find(action => action.type === 'uri')?.uri || null
    }));
  } catch (error) {
    console.error('Error searching music:', error);
    throw error;
  }
};

export const getMoodBasedRecommendations = async (mood: MoodCategory): Promise<Track[]> => {
  // Map moods to search terms
  const moodMapping: Record<string, string> = {
    happy: 'happy upbeat pop',
    sad: 'sad emotional ballad',
    energetic: 'energetic workout rock',
    romantic: 'love songs romantic',
    calm: 'relaxing calm ambient',
    melancholy: 'melancholy indie',
    night: 'night chill electronic',
    discovery: 'top hits'
  };
  
  const searchTerm = moodMapping[mood] || 'popular music';
  
  try {
    const tracks = await searchMusic(searchTerm, 10);
    // Tag tracks with the mood
    return tracks.map(track => ({ ...track, mood }));
  } catch (error) {
    console.error(`Error getting ${mood} recommendations:`, error);
    throw error;
  }
};

export const fetchTopCharts = async (): Promise<Track[]> => {
  try {
    return await searchMusic('top 40 hits', 10);
  } catch (error) {
    console.error('Error fetching top charts:', error);
    throw error;
  }
};
