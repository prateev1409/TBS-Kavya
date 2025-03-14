"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle
import { useUser } from "../../hooks/useUser"; // Assuming useUser is a custom hook

function MainComponent() {
  const { data: user, loading, refetch } = useUser();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const subscriptionDetails = {
    basic: {
      booksAllowed: 1,
      borrowPeriod: "7 days",
      cafeDiscount: "5%",
    },
    standard: {
      booksAllowed: 2,
      borrowPeriod: "14 days",
      cafeDiscount: "10%",
    },
    premium: {
      booksAllowed: 3,
      borrowPeriod: "21 days",
      cafeDiscount: "15%",
    },
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin";
    return null;
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to update email");

      await refetch();
      setShowEmailForm(false);
    } catch (err) {
      setError("Failed to update email");
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) throw new Error("Failed to update phone");

      await refetch();
      setShowPhoneForm(false);
    } catch (err) {
      setError("Failed to update phone number");
    }
  };

  const currentPlan = user.subscription_tier
    ? subscriptionDetails[user.subscription_tier]
    : null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-border-light dark:border-border-dark"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-backgroundSCD-light dark:bg-backgroundSCD-dark flex items-center justify-center">
                <i className="fas fa-user text-4xl text-text-light dark:text-text-dark"></i>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold font-header text-text-light dark:text-text-dark">
            {user.name || "No Name Set"}
          </h1>
          <p className="mt-1 text-sm text-text-light dark:text-text-dark font-body">
            Customer ID: {user.id}
          </p>
        </div>
        <div className="flex items-center justify-between px-6 py-3 rounded-full border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
          <div>
            <h2 className="text-2xl font-bold font-header text-text-light dark:text-text-dark capitalize">
              {user.subscription_tier?.toUpperCase()} SUBSCRIPTION
            </h2>
            <p className="text-text-light dark:text-text-dark font-body">
              Valid until{" "}
              {new Date(user.subscription_valid_until).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          <a
            href="/subscriptions"
            className="inline-flex items-center px-6 py-2.5 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark font-button rounded-full hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
          >
            Upgrade Subscription
          </a>
        </div>

        <div className="space-y-4">
          {showEmailForm ? (
            <form onSubmit={handleUpdateEmail} className="space-y-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-2 font-body"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark rounded-full font-button hover:bg-primary-light dark:hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="px-4 py-2 border border-border-light dark:border-border-dark rounded-full font-button hover:bg-backgroundSCD-light dark:hover:bg-backgroundSCD-dark"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between px-6 py-3 rounded-full border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
              <div className="font-body text-text-light dark:text-text-dark">{user.email}</div>
              <button
                onClick={() => setShowEmailForm(true)}
                className="px-4 py-2 text-primary-light dark:text-primary-dark rounded-full border border-primary-light dark:border-primary-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors font-button"
              >
                Update Email
              </button>
            </div>
          )}

          {showPhoneForm ? (
            <form onSubmit={handleUpdatePhone} className="space-y-3">
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-full border border-border-light dark:border-border-dark px-4 py-2 font-body"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark rounded-full font-button hover:bg-primary-light dark:hover:bg-primary-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhoneForm(false)}
                  className="px-4 py-2 border border-border-light dark:border-border-dark rounded-full font-button hover:bg-backgroundSCD-light dark:hover:bg-backgroundSCD-dark"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between px-6 py-3 rounded-full border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
              <div className="font-body text-text-light dark:text-text-dark">
                {user.phone || "Not set"}
              </div>
              <button
                onClick={() => setShowPhoneForm(true)}
                className="px-4 py-2 text-primary-light dark:text-primary-dark rounded-full border border-primary-light dark:border-primary-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors font-button"
              >
                Update Phone
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/account/logout"
            className="inline-block px-6 py-2 text-sm font-medium text-warning-light dark:text-warning-dark border border-warning-light dark:border-warning-dark rounded-full hover:bg-warning-light dark:hover:bg-warning-dark transition-colors"
          >
            Log Out
          </a>
        </div>

        {error && (
          <div className="bg-warning-light dark:bg-warning-dark text-warning-light dark:text-warning-dark p-3 rounded-lg font-body">
            {error}
          </div>
        )}
      </div>
      <ThemeToggle /> {/* Add ThemeToggle component */}
    </div>
  );
}

export default MainComponent;


