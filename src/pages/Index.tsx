
import { Link } from "react-router-dom";
import { Music, HeadphonesIcon, Zap } from "lucide-react";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-5">
      <PageTransition>
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-6">
              <div className="mx-auto md:mx-0 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Music for <br />Every Mood
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Discover personalized music recommendations based on how you feel. Let your emotions guide your musical journey.
              </p>

              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-4">
                <Link to="/login" className="w-full md:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="bg-white text-gray-800 hover:bg-white/90"
                  >
                    Get Started
                  </Button>
                </Link>

                <Link to="/signup" className="w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="border-white text-white hover:bg-white/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-400 rounded-full filter blur-xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-xl opacity-60"></div>
              
              <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="absolute -top-3 -right-3 bg-blue-500 rounded-full p-2 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex items-center mb-6">
                  <HeadphonesIcon className="h-10 w-10 text-white mr-4" />
                  <h2 className="text-xl font-bold text-white">MoodTunes</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {['happy', 'energetic', 'calm', 'romantic'].map((mood) => (
                    <div key={mood} className="flex items-center bg-white/10 rounded-lg p-3">
                      <div className={`h-10 w-10 rounded-md ${
                        mood === 'happy' ? 'bg-yellow-500' : 
                        mood === 'energetic' ? 'bg-red-500' : 
                        mood === 'calm' ? 'bg-green-500' : 
                        'bg-pink-500'
                      } flex items-center justify-center mr-3`}>
                        <Music className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{mood} Music</p>
                        <p className="text-xs text-white/70">Personalized for you</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-white/80 text-sm">
                  Music that matches your emotions
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Index;
