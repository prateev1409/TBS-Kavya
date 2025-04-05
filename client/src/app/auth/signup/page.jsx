"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "../../../components/ThemeToggle";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
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

  const validateForm = () => {
    if (!formData.name || !formData.phone_number || !formData.email || !formData.password || !formData.confirmPassword) {
      return "Please fill in all fields";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Invalid email format";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      return "Password must contain at least one special character";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    if (!/^\d{10}$/.test(formData.phone_number)) {
      return "Phone number must be 10 digits";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="mb-8 text-center text-3xl font-bold text-text-light dark:text-text-dark">
            Create Account
          </h1>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleInputChange}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-3 text-text-light dark:text-text-dark focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                onChange={handleInputChange}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-3 text-text-light dark:text-text-dark focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-3 text-text-light dark:text-text-dark focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
              />
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-3 text-text-light dark:text-text-dark focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-light dark:text-text-dark"
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
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-3 text-text-light dark:text-text-dark focus:border-primary-light dark:focus:border-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 transition-colors"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-light dark:text-text-dark"
              >
                {confirmPasswordVisible ? "🙈" : "👁️"}
              </button>
            </div>
            {error && (
              <div className="rounded-full bg-warning-light dark:bg-warning-dark p-3 text-sm text-warning-light dark:text-warning-dark">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary-light dark:bg-primary-dark px-4 py-3 text-base font-medium text-text-light dark:text-text-dark transition-colors hover:bg-primary-light dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
          {/* Rest of the UI remains unchanged */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-border-light dark:border-border-dark"></div>
            <span className="px-4 text-text-light dark:text-text-dark text-sm">Or</span>
            <div className="flex-1 border-t border-border-light dark:border-border-dark"></div>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setError("Google sign-in not implemented yet")}
              className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-3 text-base font-medium text-text-light dark:text-text-dark transition-colors hover:bg-backgroundSCD-light dark:hover:bg-backgroundSCD-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2"
            >
              <i className="fab fa-google mr-2"></i>
              Continue with Google
            </button>
            <button className="w-full rounded-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 py-3 text-base font-medium text-text-light dark:text-text-dark transition-colors hover:bg-backgroundSCD-light dark:hover:bg-backgroundSCD-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2">
              <i className="fab fa-apple mr-2"></i>
              Continue with Apple
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-text-light dark:text-text-dark">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary-light dark:text-primary-dark hover:text-primary-light dark:hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-background-light dark:bg-background-dark p-12">
        <div className="relative">
          <img
            src="/Graphic 1.png"
            alt="Person reading a book with floating elements"
            className="w-full max-w-lg"
          />
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}

export default MainComponent;