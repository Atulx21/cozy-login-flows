
import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Music, Zap, Heart, Sun, Cloud, Moon } from 'lucide-react';
import { MoodCategory } from '@/types/music';

interface EmotionSelectorProps {
  selectedMood: MoodCategory;
  onMoodSelect: (mood: MoodCategory) => void;
}

const moods = [
  {
    id: 'happy',
    name: 'Happy',
    icon: <Smile className="h-8 w-8" />,
    color: 'bg-yellow-500',
    description: 'Feeling joyful, content, or pleased'
  },
  {
    id: 'sad',
    name: 'Sad',
    icon: <Frown className="h-8 w-8" />,
    color: 'bg-blue-500',
    description: 'Feeling down, blue, or unhappy'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    icon: <Zap className="h-8 w-8" />,
    color: 'bg-red-500',
    description: 'Feeling excited, motivated, or dynamic'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    icon: <Heart className="h-8 w-8" />,
    color: 'bg-pink-500',
    description: 'Feeling loving, tender, or passionate'
  },
  {
    id: 'calm',
    name: 'Calm',
    icon: <Sun className="h-8 w-8" />,
    color: 'bg-green-500',
    description: 'Feeling relaxed, peaceful, or tranquil'
  },
  {
    id: 'melancholy',
    name: 'Melancholy',
    icon: <Cloud className="h-8 w-8" />,
    color: 'bg-purple-500',
    description: 'Feeling wistful, nostalgic, or reflective'
  },
  {
    id: 'night',
    name: 'Night',
    icon: <Moon className="h-8 w-8" />,
    color: 'bg-indigo-500',
    description: 'Feeling mysterious, atmospheric, or deep'
  },
  {
    id: 'discovery',
    name: 'Discover',
    icon: <Music className="h-8 w-8" />,
    color: 'bg-gray-500',
    description: 'Discover new music across all emotions'
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
            onClick={() => onMoodSelect(mood.id as MoodCategory)}
            className={`flex flex-col items-center justify-center rounded-xl p-4 transition-colors ${
              selectedMood === mood.id
                ? `${mood.color} text-white ring-4 ring-white/30`
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            <div className="mb-2">{mood.icon}</div>
            <span className="text-sm font-medium">{mood.name}</span>
            <p className="mt-1 text-xs opacity-80">{mood.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export const getMoodGenre = (moodId: string): string => {
  const mapping: Record<string, string> = {
    happy: 'pop',
    sad: 'blues',
    energetic: 'rock',
    romantic: 'r&b',
    calm: 'ambient',
    melancholy: 'indie',
    night: 'electronic',
    discovery: 'top hits'
  };
  return mapping[moodId] || 'top hits';
};

export default EmotionSelector;
