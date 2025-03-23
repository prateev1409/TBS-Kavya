"use client";
import QRCode from "qrcode.react"; // Ensure qrcode.react is installed and imported correctly
import { useEffect, useState } from "react";
import ThemeToggle from "../../components/ThemeToggle"; // Ensure this is exported correctly
import { useUser } from "../Hooks/useUser";

function MainComponent() {
  const { data: user, loading, refetch } = useUser();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [previousTransactions, setPreviousTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [showQR, setShowQR] = useState({});

  const subscriptionDetails = {
    basic: { booksAllowed: 1, borrowPeriod: "7 days", cafeDiscount: "5%" },
    standard: { booksAllowed: 2, borrowPeriod: "14 days", cafeDiscount: "10%" },
    premium: { booksAllowed: 3, borrowPeriod: "21 days", cafeDiscount: "15%" },
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please sign in again.");
        }
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch transactions");
      }

      const transactions = await res.json();
      const userTransactions = transactions.filter(
        (t) => t.user_id.user_id === user.user_id
      );

      const previous = userTransactions.filter((t) =>
        ["picked_up", "dropped_off"].includes(t.status)
      );
      const pending = userTransactions.filter((t) =>
        ["pickup_pending", "dropoff_pending"].includes(t.status)
      );

      setPreviousTransactions(previous);
      setPendingTransactions(pending);
    } catch (err) {
      console.error("Error fetching transactions:", err.message);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone }),
        }
      );

      if (!response.ok) throw new Error("Failed to update phone");

      await refetch();
      setShowPhoneForm(false);
    } catch (err) {
      setError("Failed to update phone number");
    }
  };

  const toggleQR = (transactionId) => {
    setShowQR((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/auth/signin";
    return null;
  }

  const currentPlan = user.subscription_tier
    ? subscriptionDetails[user.subscription_tier]
    : null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
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
            Customer ID: {user.user_id || user.id}
          </p>
        </div>

        {/* Subscription Section */}
        <div className="flex items-center justify-between px-6 py-3 rounded-lg border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
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
            href="/Subscription"
            className="inline-flex items-center px-6 py-2.5 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark font-button rounded-full hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
          >
            Upgrade Subscription
          </a>
        </div>

        {/* Email/Phone Update Section */}
        <div className="space-y-4">
          {showEmailForm ? (
            <form onSubmit={handleUpdateEmail} className="space-y-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border-light dark:border-border-dark px-4 py-2 font-body"
              />
              <div className="flex space-x-2 justify-end">
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
            <div className="flex items-center justify-between px-6 py-3 rounded-lg border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
              <div className="font-body text-text-light dark:text-text-dark">
                {user.email}
              </div>
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
                className="w-full rounded-lg border border-border-light dark:border-border-dark px-4 py-2 font-body"
              />
              <div className="flex space-x-2 justify-end">
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
            <div className="flex items-center justify-between px-6 py-3 rounded-lg border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors">
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

        {/* Previous Transactions Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-header text-text-light dark:text-text-dark">
            Previous Transactions
          </h2>
          {loadingTransactions ? (
            <div className="text-text-light dark:text-text-dark">
              Loading transactions...
            </div>
          ) : previousTransactions.length === 0 ? (
            <div className="px-6 py-3 rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-body">
              No previous transactions found.
            </div>
          ) : (
            previousTransactions.map((transaction) => (
              <div
                key={transaction.transaction_id}
                className="flex items-center justify-between px-6 py-3 rounded-lg border border-border-light dark:border-border-dark hover:border-border-light dark:hover:border-border-dark transition-colors"
              >
                <div className="font-body text-text-light dark:text-text-dark">
                  <p>
                    <strong>Cafe:</strong> {transaction.cafe_id.name}
                  </p>
                  <p>
                    <strong>Book:</strong> {transaction.book_id.name}
                  </p>
                  <p>
                    <strong>Type:</strong>{" "}
                    {transaction.status === "picked_up" ? "Pickup" : "Drop-off"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pending Transactions Section (Table Format) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-header text-text-light dark:text-text-dark">
            Pending Transactions
          </h2>
          {loadingTransactions ? (
            <div className="text-text-light dark:text-text-dark">
              Loading transactions...
            </div>
          ) : pendingTransactions.length === 0 ? (
            <div className="px-6 py-3 rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-body">
              No pending transactions found.
            </div>
          ) : (
            <div className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
              <table className="w-full text-left text-text-light dark:text-text-dark font-body">
                <thead>
                  <tr className="bg-backgroundSCD-light dark:bg-backgroundSCD-dark">
                    <th className="px-4 py-2">Cafe</th>
                    <th className="px-4 py-2">Book</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransactions.map((transaction) => (
                    <tr
                      key={transaction.transaction_id}
                      className="border-t border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-2">{transaction.cafe_id.name}</td>
                      <td className="px-4 py-2">{transaction.book_id.name}</td>
                      <td className="px-4 py-2">
                        {transaction.status === "pickup_pending"
                          ? "Pickup"
                          : "Drop-off"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => toggleQR(transaction.transaction_id)}
                          className="px-4 py-1 text-primary-light dark:text-primary-dark rounded-full border border-primary-light dark:border-primary-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors font-button"
                        >
                          {showQR[transaction.transaction_id]
                            ? "Hide QR"
                            : "Show QR"}
                        </button>
                        {showQR[transaction.transaction_id] && (
                          <div className="mt-2">
                            <QRCode
                              value={`${transaction.transaction_id}.${user.user_id}`}
                              size={128}
                              bgColor="#ffffff"
                              fgColor="#000000"
                              level="H"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="text-center">
          <a
            href="/auth/logout"
            className="inline-block px-6 py-2 text-sm font-medium text-warning-light dark:text-warning-dark border border-warning-light dark:border-warning-dark rounded-full hover:bg-warning-light dark:hover:bg-warning-dark transition-colors"
          >
            Log Out
          </a>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-warning-light dark:bg-warning-dark text-warning-light dark:text-warning-dark p-3 rounded-lg font-body">
            {error}
          </div>
        )}
      </div>
      <ThemeToggle />
    </div>
  );
}

export default MainComponent;