
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Mail, Phone } from "lucide-react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import PageTransition from "@/components/PageTransition";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-5">
      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <PageTransition>
          <div className="mb-8">
            <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white">Create account</h1>
            <p className="text-white/90">Fill in your details to get started</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <PageTransition delay={100}>
              <InputField
                id="username"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                icon={<User className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>
            
            <PageTransition delay={150}>
              <InputField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>

            <PageTransition delay={200}>
              <InputField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>

            <PageTransition delay={250}>
              <InputField
                id="mobile"
                label="Mobile"
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                icon={<Phone className="w-5 h-5 text-gray-500" />}
                className="bg-white/90 backdrop-blur-sm"
                required
              />
            </PageTransition>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-8 bg-white text-gray-800 hover:bg-white/90"
            >
              Create
            </Button>

            <div className="text-center">
              <p className="text-white/80 mb-4">Or create account using social media</p>
              <div className="flex justify-center space-x-4">
                {/* Social media buttons would go here */}
              </div>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-white/90">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </PageTransition>
      </main>
    </div>
  );
};

export default Signup;
