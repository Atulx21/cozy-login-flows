
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Smile, Frown, Zap, Heart, Sun, Cloud, Moon } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { MoodCategory } from '@/types/music';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);

  const moods = [
    {
      id: 'happy',
      name: 'Happy',
      icon: <Smile className="h-10 w-10" />,
      color: 'bg-yellow-500',
      description: 'Feeling joyful, content, or pleased'
    },
    {
      id: 'sad',
      name: 'Sad',
      icon: <Frown className="h-10 w-10" />,
      color: 'bg-blue-500',
      description: 'Feeling down, blue, or unhappy'
    },
    {
      id: 'energetic',
      name: 'Energetic',
      icon: <Zap className="h-10 w-10" />,
      color: 'bg-red-500',
      description: 'Feeling excited, motivated, or dynamic'
    },
    {
      id: 'romantic',
      name: 'Romantic',
      icon: <Heart className="h-10 w-10" />,
      color: 'bg-pink-500',
      description: 'Feeling loving, tender, or passionate'
    },
    {
      id: 'calm',
      name: 'Calm',
      icon: <Sun className="h-10 w-10" />,
      color: 'bg-green-500',
      description: 'Feeling relaxed, peaceful, or tranquil'
    },
    {
      id: 'melancholy',
      name: 'Melancholy',
      icon: <Cloud className="h-10 w-10" />,
      color: 'bg-purple-500',
      description: 'Feeling wistful, nostalgic, or reflective'
    },
    {
      id: 'night',
      name: 'Night',
      icon: <Moon className="h-10 w-10" />,
      color: 'bg-indigo-500',
      description: 'Feeling mysterious, atmospheric, or deep'
    },
    {
      id: 'discovery',
      name: 'Discover',
      icon: <Music className="h-10 w-10" />,
      color: 'bg-gray-500',
      description: 'Discover new music across all emotions'
    }
  ];

  const handleMoodSelect = (mood: MoodCategory) => {
    setSelectedMood(mood);
  };

  const handleContinue = () => {
    if (selectedMood) {
      navigate('/dashboard', { state: { mood: selectedMood } });
    } else {
      navigate('/dashboard');
    }
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#0f0f19] text-white">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Music className="h-7 w-7 text-blue-500" />
            <h1 className="text-xl font-bold">MoodTunes</h1>
          </div>
          
          <button 
            onClick={handleGetStarted}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
          </button>
        </header>
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute -bottom-[30%] right-[10%] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>
            
            <div className="relative container mx-auto px-6 text-center">
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
                Music for every <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Mood</span>
              </h1>
              
              <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
                Discover music perfectly tailored to your emotional state. Our intelligent system recommends tracks that resonate with how you're feeling right now.
              </p>
              
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-6 text-2xl font-semibold">How are you feeling today?</h2>
                
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id as MoodCategory)}
                      className={`flex flex-col items-center justify-center rounded-lg p-6 transition-all ${
                        selectedMood === mood.id
                          ? `${mood.color} text-white ring-4 ring-white/30`
                          : 'bg-black/20 text-white hover:bg-black/30'
                      }`}
                    >
                      <div className="mb-3">{mood.icon}</div>
                      <span className="font-medium">{mood.name}</span>
                      <p className="mt-2 text-xs opacity-80">{mood.description}</p>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleContinue}
                  disabled={!selectedMood}
                  className="mt-10 rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="mb-16 text-center text-4xl font-bold">How It Works</h2>
              
              <div className="grid gap-10 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20 mb-6">
                    <Smile className="h-12 w-12 text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Share Your Mood</h3>
                  <p className="text-white/70">
                    Select your current emotion from our intuitive interface, or let our system detect it for you.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/20 mb-6">
                    <Music className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Get Recommendations</h3>
                  <p className="text-white/70">
                    Receive personalized music suggestions that complement or enhance your emotional state.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 mb-6">
                    <Heart className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Track History</h3>
                  <p className="text-white/70">
                    Review your emotional journey and discover patterns in your music preferences over time.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-black/30">
            <div className="container mx-auto px-6 text-center">
              <h2 className="mb-6 text-4xl font-bold">Ready to match music to your mood?</h2>
              <p className="mx-auto mb-10 max-w-2xl text-white/70">
                Join MoodTunes today and transform how you experience music.
              </p>
              <button
                onClick={handleGetStarted}
                className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </section>
        </main>
        
        <footer className="border-t border-white/10 bg-black/30 px-6 py-10">
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold">MoodTunes</h2>
              </div>
              
              <p className="text-sm text-white/60">© 2023 MoodTunes. All rights reserved.</p>
              
              <div className="flex gap-6">
                <a href="#" className="text-white/60 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-white/60 hover:text-white">Terms of Service</a>
                <a href="#" className="text-white/60 hover:text-white">Contact Us</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
