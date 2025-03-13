"use client"; // Added "use client" directive
import { useState } from "react";
import Link from "next/link";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    console.log("Sign in attempted with:", { email, password });
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setError("Google sign-in not implemented yet");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-ibm-plex-sans">
            Hello Reader!
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-3 rounded-full border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
                <a
                  href="#"
                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-6 text-sm text-gray-600 hover:text-black"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-full text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full border border-black px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
            >
              <i className="fab fa-google text-xl"></i>
              <span className="text-black">Continue with Google</span>
            </button>

            <button className="w-full border border-black px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
              <i className="fab fa-apple text-xl"></i>
              <span className="text-black">Continue with Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600 text-sm">
            New here?{" "}
            <Link href="/auth/signup" className="text-black hover:underline">
              Sign up instead
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
        <div className="relative">
          <img
            src="/reading-illustration.svg"
            alt="Person reading a book with floating elements"
            className="w-full max-w-lg"
          />
          <div className="absolute -top-12 right-0 animate-float">
            <img
              src="/planet.svg"
              alt="Floating planet"
              className="w-16 h-16"
            />
          </div>
          <div className="absolute top-1/4 -left-8 animate-float-delayed">
            <img
              src="/lightbulb.svg"
              alt="Floating lightbulb"
              className="w-12 h-12"
            />
          </div>
          <div className="absolute bottom-0 right-12 animate-float-slow">
            <img src="/leaf.svg" alt="Floating leaf" className="w-10 h-10" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;