
import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Music, Zap, Heart, Sun, Cloud, Moon } from 'lucide-react';

interface Mood {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  genre: string;
}

interface EmotionSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

const moods: Mood[] = [
  {
    id: 'happy',
    name: 'Happy',
    icon: <Smile className="h-8 w-8" />,
    color: 'bg-yellow-500',
    genre: 'pop'
  },
  {
    id: 'sad',
    name: 'Sad',
    icon: <Frown className="h-8 w-8" />,
    color: 'bg-blue-500',
    genre: 'blues'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    icon: <Zap className="h-8 w-8" />,
    color: 'bg-red-500',
    genre: 'rock'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    icon: <Heart className="h-8 w-8" />,
    color: 'bg-pink-500',
    genre: 'r&b'
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: <Sun className="h-8 w-8" />,
    color: 'bg-green-500',
    genre: 'ambient'
  },
  {
    id: 'melancholy',
    name: 'Melancholy',
    icon: <Cloud className="h-8 w-8" />,
    color: 'bg-purple-500',
    genre: 'indie'
  },
  {
    id: 'night',
    name: 'Night',
    icon: <Moon className="h-8 w-8" />,
    color: 'bg-indigo-500',
    genre: 'electronic'
  },
  {
    id: 'discovery',
    name: 'Discover',
    icon: <Music className="h-8 w-8" />,
    color: 'bg-gray-500',
    genre: 'top hits'
  }
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-white">How are you feeling today?</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(mood.id)}
            className={`flex flex-col items-center justify-center rounded-xl p-4 transition-colors ${
              selectedMood === mood.id
                ? `${mood.color} text-white ring-4 ring-white/30`
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <div className="mb-2">{mood.icon}</div>
            <span className="text-sm font-medium">{mood.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const getMoodGenre = (moodId: string): string => {
  const mood = moods.find(m => m.id === moodId);
  return mood ? mood.genre : 'top hits';
};

export default EmotionSelector;
