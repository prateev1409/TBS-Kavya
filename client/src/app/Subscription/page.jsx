"use client";
import Link from "next/link";
import { useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SubscriptionPlan from "../../components/subscriptionplans";
import ThemeToggle from "../../components/ThemeToggle";
import { useUser } from "../Hooks/useUser";

function MainComponent() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isCodeApplied, setIsCodeApplied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: user, loading: userLoading } = useUser();

  const codes = ["DINKY100", "KAVYA100", "LEO100", "KASIS100"];

  const plans = [
    {
      id: 1,
      tier: "Basic",
      name: "Basic Plan",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80",
      features: [
        "Borrow 1 book at a time",
        "7-day borrowing period",
        "5% discount at partner cafes",
      ],
    },
    {
      id: 2,
      tier: "Standard",
      name: "Standard Plan",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      features: [
        "Borrow 3 books at a time",
        "21-day borrowing period",
        "15% discount at partner cafes",
        "Reading community access",
      ],
    },
    {
      id: 3,
      tier: "Premium",
      name: "Premium Plan",
      price: 19.99,
      image: "",
      features: [
        "Borrow 3 books at a time",
        "21-day borrowing period",
        "15% discount at partner cafes",
        "Reading community access",
        "Early access to new releases",
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
        setSelectedPlan((prevSelectedPlan) =>
      prevSelectedPlan?.id === plan.id ? null : plan
    );
  };

  const handleSubscribe = async () => {
    try {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!selectedPlan) return;
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: selectedPlan.tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError('Failed to process subscription');
    }
  };

  const handleApplyCode = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (codes.includes(code)) {
      setMessage("Your subscription is free, Just pay the deposit");
      setIsCodeApplied(true);
      setSelectedPlan(null);
    } else {
      setMessage("Invalid code");
    }
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginRedirect = () => {
    window.location.href = "/auth/signin?callbackUrl=/subscriptions";
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-warning-light dark:text-warning-dark">{error}</div>
      </div>
    );
  }

  const footerData = {
    description:
      "Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences.",
    subtext: "Sip, read, and connect with us today!",
    linksLeft: [
      { href: "/how-it-works", text: "How it works ?" },
      { href: "#", text: "Terms of Use" },
      { href: "#", text: "Sales and Refunds" },
    ],
    linksRight: [
      { href: "/Subscription", text: "Subscription" },
      { href: "#", text: "Careers" },
      { href: "#", text: "Meet the team" },
      { href: "#", text: "Contact" },
    ],
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-header font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-text-light dark:text-text-dark max-w-2xl mx-auto">
            Select the perfect plan for your reading journey. Unlock access to
            our extensive collection of books and exclusive features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <SubscriptionPlan
              key={plan.id}
              plan={{
                name: plan.name,
                price: plan.price,
                booksPerMonth: plan.features.length,
                cafeDiscount:
                  plan.tier === "Basic"
                    ? 5
                    : plan.tier === "Standard"
                    ? 10
                    : 15,
                features: plan.features,
              }}
              isSelected={selectedPlan?.id === plan.id}
              onSelect={() => handleSelectPlan(plan)}
              isCurrentPlan={user?.subscription_tier === plan.tier}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleApplyCode}
            className="ml-4 bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-4 py-2 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
          >
            Apply Code
          </button>
          {message && <div className="mt-4 text-success">{message}</div>}
        </div>

        <div className="mt-12 text-center">
          {!user ? (
            <button
              onClick={() => setShowLoginPrompt(true)}
              className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-8 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
            >
              {isCodeApplied ? "Pay Deposit" : selectedPlan ? "Confirm Subscription" : "Try free content"}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-8 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
            >
              {isCodeApplied ? <Link href="/payments">Pay Deposit</Link> : selectedPlan ? <Link href="/payments">Confirm Subscription</Link> : <Link href="/">Try free content</Link>}
            </button>
          )}
        </div>
      </div>
      <Footer
        description={footerData.description}
        subtext={footerData.subtext}
        linksLeft={footerData.linksLeft}
        linksRight={footerData.linksRight}
      />
      <ThemeToggle />

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg text-gray-800 dark:text-gray-200">
              Log in to subscribe or enjoy the free content
            </p>
            <button
              onClick={handleLoginRedirect}
              className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-4 py-2 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
            >
              Sign In
            </button>
            <button
              onClick={handleCloseLoginPrompt}
              className="ml-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;