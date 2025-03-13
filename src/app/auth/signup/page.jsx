"use client"; // Added "use client" directive
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

    console.log("Sign up attempted with:", formData);
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    setError("Google sign-in not implemented yet");
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
      setTimeout(() => setPasswordVisible(false), 15000);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
      setTimeout(() => setConfirmPasswordVisible(false), 15000);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-background-dark p-4">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-bold text-black dark:text-text-dark">
            Create Account
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 dark:text-text-dark focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 dark:text-text-dark focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
                className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-700 dark:text-text-dark focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
              >
                {confirmPasswordVisible ? "🙈" : "👁️"}
              </button>
            </div>

            {error && (
              <div className="rounded-full bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black dark:bg-primary-dark px-4 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
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
              className="w-full rounded-full border border-black bg-white dark:bg-background-dark px-4 py-3 text-base font-medium text-black dark:text-text-dark transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <i className="fab fa-google mr-2"></i>
              Continue with Google
            </button>

            <button className="w-full rounded-full border border-black bg-white dark:bg-background-dark px-4 py-3 text-base font-medium text-black dark:text-text-dark transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <i className="fab fa-apple mr-2"></i>
              Continue with Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-text-dark">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-black dark:text-primary-dark hover:text-gray-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white dark:bg-background-dark p-12">
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