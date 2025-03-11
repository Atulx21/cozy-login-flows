
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  preview: string | null;
  spotifyUri?: string; // New field for Spotify
  mood?: string;
}

export type MoodCategory = 'happy' | 'sad' | 'energetic' | 'romantic' | 'calm' | 'melancholy' | 'night' | 'discovery';

export interface ApiResponse {
  tracks?: {
    items?: Array<any>; // Spotify response structure
    hits?: Array<{
      track: {
        key: string;
        title: string;
        subtitle: string;
        images?: {
          coverart?: string;
        };
        hub?: {
          actions?: Array<{
            type: string;
            uri?: string;
          }>;
        };
      };
    }>;
  };
}

export interface MoodHistory {
  id: string;
  mood: MoodCategory;
  date: string;
  time: string;
  tracks: Track[];
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
