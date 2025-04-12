"use client";
import { useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SubscriptionPlan from "../../components/subscriptionplans";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../Hooks/useAuth";
import { useUser } from "../Hooks/useUser";

function MainComponent() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isCodeApplied, setIsCodeApplied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: user, loading: userLoading, refetch: refetchUser } = useUser();
  const { refreshToken } = useAuth();

  const codes = ["DINKY100", "KAVYA100", "LEO100", "KASIS100"];

  const DEPOSIT_FEE = 29900; // ₹299 in paise
  const STANDARD_PLAN_FEE = 4900; // ₹49 in paise

  const plans = [
    {
      id: 2,
      tier: "standard",
      name: "Standard Plan",
      price: 49.0,
      image:
        "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      features: [
        "Borrow 3 books at a time",
        "21-day borrowing period",
        "15% discount at partner cafes",
        "Reading community access",
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan((prevSelectedPlan) =>
      prevSelectedPlan?.id === plan.id ? null : plan
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    try {
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }
      if (!selectedPlan && !isCodeApplied) {
        setError("Please select a plan or apply a valid coupon.");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay SDK. Please try again.");
        return;
      }

      let amount = DEPOSIT_FEE; // Default: only deposit
      if (!isCodeApplied && selectedPlan) {
        amount += STANDARD_PLAN_FEE; // Add plan fee if no coupon
      }

      let token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tier: selectedPlan?.tier || "standard",
            amount: amount / 100, // Convert paise to rupees for backend
            isCodeApplied,
          }),
        }
      );

      if (response.status === 401) {
        console.log("Token expired, refreshing token...");
        token = await refreshToken();
        if (!token) {
          setError("Failed to refresh token. Please log in again.");
          window.location.href = "/auth/signin";
          return;
        }
        localStorage.setItem("token", token);
        const retryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/create-subscription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tier: selectedPlan?.tier || "standard",
              amount: amount / 100,
              isCodeApplied,
            }),
          }
        );
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json();
          throw new Error(
            errorData.error || "Failed to create order after token refresh"
          );
        }
        const orderData = await retryResponse.json();
        initiatePayment(orderData, amount);
      } else {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create order");
        }
        const orderData = await response.json();
        initiatePayment(orderData, amount);
      }
    } catch (err) {
      console.error("Error initiating payment:", err.message);
      setError(err.message);
    }
  };

  const initiatePayment = async (orderData, amount) => {
    const options = {
      key: orderData.key,
      amount: amount, // Amount in paise
      currency: orderData.currency,
      name: "TheBookShelves Subscription",
      description: `Subscription Plan: standard${
        isCodeApplied ? " (Deposit Only)" : ""
      }`,
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          let token = localStorage.getItem("token");
          const verifyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/verify-subscription-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tier: selectedPlan?.tier || "standard",
                amount: amount / 100,
                isCodeApplied,
              }),
            }
          );

          if (verifyResponse.status === 401) {
            console.log("Token expired, refreshing token for verification...");
            token = await refreshToken();
            if (!token) {
              setError("Failed to refresh token. Please log in again.");
              window.location.href = "/auth/signin";
              return;
            }
            localStorage.setItem("token", token);
            const retryVerifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/verify-subscription-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  tier: selectedPlan?.tier || "standard",
                  amount: amount / 100,
                  isCodeApplied,
                }),
              }
            );
            if (!retryVerifyResponse.ok) {
              const errorData = await retryVerifyResponse.json();
              throw new Error(
                errorData.error || "Failed to verify payment after token refresh"
              );
            }
            const verifyData = await retryVerifyResponse.json();
            alert(verifyData.message);
            refetchUser();
            window.location.href = "/";
          } else {
            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || "Failed to verify payment");
            }
            const verifyData = await verifyResponse.json();
            alert(verifyData.message);
            refetchUser();
            window.location.href = "/";
          }
        } catch (err) {
          console.error("Error verifying payment:", err.message);
          setError(err.message);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone_number || "",
      },
      theme: {
        color: "#1D4ED8",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", (response) => {
      setError(`Payment failed: ${response.error.description}`);
    });
    paymentObject.open();
  };

  const handleApplyCode = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (codes.includes(code)) {
      setMessage("Coupon applied! Only deposit fee of ₹299 is required.");
      setIsCodeApplied(true);
      setSelectedPlan(null); // Deselect plan as coupon waives plan fee
    } else {
      setMessage("Invalid code");
      setIsCodeApplied(false);
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
            Select the perfect plan for your reading journey. Unlock access to our
            extensive collection of books and exclusive features.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="grid md:grid-cols-1 gap-8 max-w-6xl mx-auto justify-center">
            {plans.map((plan) => (
              <SubscriptionPlan
                key={plan.id}
                plan={{
                  name: plan.name,
                  price: plan.price,
                  booksPerMonth: plan.features.length,
                  disabled: false,
                  cafeDiscount: 10,
                  features: plan.features,
                }}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={() => handleSelectPlan(plan)}
                isCurrentPlan={user?.subscription_type === plan.tier}
              />
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleApplyCode}
            className="ml-4 bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-4 py-2 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
          >
            Apply Code
          </button>
          {message && (
            <div
              className={`mt-4 ${
                isCodeApplied ? "text-success" : "text-warning-light"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleSubscribe}
            className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark px-8 py-3 rounded-full hover:bg-primary-dark dark:hover:bg-primary-light transition-colors font-button"
          >
            {isCodeApplied
              ? "Pay Deposit (₹299)"
              : selectedPlan
              ? "Confirm Subscription (₹348)"
              : "Select a Plan"}
          </button>
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
              Log in to subscribe or apply a coupon
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