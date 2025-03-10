
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  preview: string | null;
  mood?: string;
}

export type MoodCategory = 'happy' | 'sad' | 'energetic' | 'romantic' | 'calm' | 'melancholy' | 'night' | 'discovery';

export interface ApiResponse {
  tracks?: {
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
