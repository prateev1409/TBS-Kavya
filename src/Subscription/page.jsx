"use client";
import { useState } from "react";
import SubscriptionPlan from "../../components/SubscriptionPlan";
function MainComponent() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [error, setError] = useState(null);
    const { data: user, loading: userLoading } = useUser();
    const plans = [
      {
        id: 1,
        tier: "basic",
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
        tier: "standard",
        name: "Standard Plan",
        price: 14.99,
        image:
          "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        features: [
          "Borrow 2 books at a time",
          "14-day borrowing period",
          "10% discount at partner cafes",
          "Reading community access",
        ],
        popular: true,
      },
      {
        id: 3,
        tier: "premium",
        name: "Premium Plan",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
        features: [
          "Borrow 3 books at a time",
          "21-day borrowing period",
          "15% discount at partner cafes",
          "Reading community access",
          "Early access to new releases",
        ],
      },
    ];
    const handleSelectPlan = async (plan) => {
      if (!user) {
        window.location.href = "/account/signin?callbackUrl=/subscriptions";
        return;
      }
      setSelectedPlan(plan);
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
          <div className="text-red-600">{error}</div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-roboto">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto font-roboto">
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
                    plan.tier === "basic"
                      ? 5
                      : plan.tier === "standard"
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
  
          {selectedPlan && (
            <div className="mt-12 text-center">
              <button
                onClick={handleSubscribe}
                className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-roboto"
              >
                Confirm Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  
  