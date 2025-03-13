"use client"; // Added "use client" directive
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setTimeout(() => setPasswordVisible(false), 15000);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-background-dark">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-text-dark mb-8 font-ibm-plex-sans">
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
                className="w-full px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200 p-4 rounded-full text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-primary-dark text-white dark:text-black px-6 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full border border-black dark:border-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <i className="fab fa-google text-xl"></i>
              <span className="text-black dark:text-white">Continue with Google</span>
            </button>

            <button className="w-full border border-black dark:border-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <i className="fab fa-apple text-xl"></i>
              <span className="text-black dark:text-white">Continue with Apple</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            New here?{" "}
            <Link href="/auth/signup" className="text-black dark:text-white hover:underline">
              Sign up instead
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-12">
        <div className="relative">
          <img
            src="/Graphic 1.png"
            alt="Person reading a book with floating elements"
            className="w-full max-w-lg"
          />
        </div>
      </div>

      <ThemeToggle /> {/* Add ThemeToggle component */}
    </div>
  );
}

export default MainComponent;