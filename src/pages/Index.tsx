
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-5">
      <PageTransition>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-white mb-4">Welcome</h1>
            <p className="text-white/90">Please choose an option to continue</p>
          </div>

          <div className="space-y-4">
            <Link to="/login" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="bg-white text-gray-800 hover:bg-white/90"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/signup" className="block w-full">
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
      </PageTransition>
    </div>
  );
};

export default Index;
