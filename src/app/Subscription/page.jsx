"use client";
import { useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SubscriptionPlan from "../../components/subscriptionplans";
import ThemeToggle from "../../components/ThemeToggle";
import { useUser } from "../Hooks/useUser";

function MainComponent() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const { data: user, loading: userLoading } = useUser();

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
    if (!user) {
      window.location.href = "/auth/signin?callbackUrl=/subscriptions";
      return;
    }
    setSelectedPlan((prevSelectedPlan) =>
      prevSelectedPlan?.id === plan.id ? null : plan
    );
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedPlan.tier }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Failed to process subscription");
    }
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

        {selectedPlan ? (
          <div className="mt-12 text-center">
            <button
              onClick={handleSubscribe}
              className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-8 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
            >
              Confirm Subscription
            </button>
          </div>
        ) : (
          <div className="mt-12 text-center">
            <button
              onClick={handleSubscribe}
              className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-8 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
            >
              Try free content
            </button>
          </div>
        )}
      </div>
      <Footer
        description={footerData.description}
        subtext={footerData.subtext}
        linksLeft={footerData.linksLeft}
        linksRight={footerData.linksRight}
      />
      <ThemeToggle />
    </div>
  );
}

export default MainComponent;
