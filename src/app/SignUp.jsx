import { useState } from "react";

function MainComponent() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
    });
    const { signUpWithCredentials, signInWithGoogle } = useAuth();
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
  
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
  
      try {
        await signUpWithCredentials({
          email: formData.email,
          password: formData.password,
          callbackUrl: "/",
          redirect: true,
        });
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };
    const handleGoogleSignIn = async () => {
      try {
        await signInWithGoogle({
          callbackUrl: "/",
          redirect: true,
        });
      } catch (err) {
        setError("Failed to sign in with Google");
      }
    };
  
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-center text-3xl font-bold text-black">
              Create Account
            </h1>
  
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
              </div>
  
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
              </div>
  
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleInputChange}
                  className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
              </div>
  
              {error && (
                <div className="rounded-full bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}
  
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black px-4 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
  
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
  
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full rounded-full border border-black bg-white px-4 py-3 text-base font-medium text-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <i className="fab fa-google mr-2"></i>
                Continue with Google
              </button>
  
              <button className="w-full rounded-full border border-black bg-white px-4 py-3 text-base font-medium text-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                <i className="fab fa-apple mr-2"></i>
                Continue with Apple
              </button>
            </div>
  
            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/account/signin"
                className="font-medium text-black hover:text-gray-800"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
  
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-12">
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
  
  
  