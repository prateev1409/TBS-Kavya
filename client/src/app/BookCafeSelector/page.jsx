"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";

export default function BookCafeSelector() {
  const { refreshToken } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingCafes, setLoadingCafes] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  // Fetch all books
  const fetchBooks = async () => {
    if (loadingBooks) return;
    setLoadingBooks(true);
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Failed to refresh token");
        }
        localStorage.setItem("token", token);
        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!retryRes.ok) {
          const errorData = await retryRes.json();
          throw new Error(`Failed to fetch books: ${errorData.error || retryRes.statusText}`);
        }
        const retryData = await retryRes.json();
        setBooks(retryData);
      } else if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to fetch books: ${errorData.error || res.statusText}`);
      } else {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err.message);
      if (err.message.includes("Failed to refresh token")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch cafes for a specific book
  const fetchCafes = async (bookId) => {
    if (loadingCafes) return;
    setLoadingCafes(true);
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Failed to refresh token");
        }
        localStorage.setItem("token", token);
        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/book/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!retryRes.ok) {
          const errorData = await retryRes.json();
          throw new Error(`Failed to fetch cafes: ${errorData.error || retryRes.statusText}`);
        }
        const retryData = await retryRes.json();
        setCafes(retryData);
      } else if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to fetch cafes: ${errorData.error || res.statusText}`);
      } else {
        const data = await res.json();
        setCafes(data);
      }
    } catch (err) {
      console.error("Error fetching cafes:", err);
      setError(err.message);
      if (err.message.includes("Failed to refresh token")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setLoadingCafes(false);
    }
  };

  // Create a transaction when "Request The Book" is clicked
  const requestBook = async (cafeId) => {
    if (transactionLoading) return;
    setTransactionLoading(true);
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: selectedBookId,
          cafe_id: cafeId,
          status: "pickup_pending",
        }),
      });

      if (res.status === 401) {
        token = await refreshToken();
        if (!token) {
          throw new Error("Failed to refresh token");
        }
        localStorage.setItem("token", token);
        const retryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            book_id: selectedBookId,
            cafe_id: cafeId,
            status: "pickup_pending",
          }),
        });
        if (!retryRes.ok) {
          const errorData = await retryRes.json();
          throw new Error(`Failed to create transaction: ${errorData.error || retryRes.statusText}`);
        }
        alert("Book requested successfully!");
      } else if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to create transaction: ${errorData.error || res.statusText}`);
      } else {
        alert("Book requested successfully!");
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(err.message);
      if (err.message.includes("Failed to refresh token")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setTransactionLoading(false);
    }
  };

  // Fetch books on page load
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch cafes when a book is selected
  const handleTryItOut = (bookId) => {
    setSelectedBookId(bookId);
    fetchCafes(bookId);
    // Scroll to the cafes section
    document.getElementById("cafes-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Section 1: Books */}
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Select Your Favorite Book</h1>
          {loadingBooks ? (
            <div className="text-gray-600">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="text-gray-600">No books found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.book_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={book.image_url || "https://picsum.photos/150"} // Updated placeholder
                    alt={book.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                    <p className="text-gray-600">by {book.author}</p>
                    <p className="text-gray-500 text-sm mt-1">Genre: {book.genre || "N/A"}</p>
                    <p className="text-gray-500 text-sm">Language: {book.language}</p>
                    <p className="text-yellow-500 mt-1">Rating: {book.ratings}/5</p>
                    <button
                      onClick={() => handleTryItOut(book.book_id)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try It Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Cafes (shown only if a book is selected) */}
        {selectedBookId && (
          <section id="cafes-section">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Cafes with Your Selected Book
            </h1>
            {loadingCafes ? (
              <div className="text-gray-600">Loading cafes...</div>
            ) : cafes.length === 0 ? (
              <div className="text-gray-600">No cafes found for this book.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cafes.map((cafe) => (
                  <div
                    key={cafe.cafe_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-800">{cafe.name}</h2>
                      <p className="text-gray-600">Location: {cafe.location}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Average Bill: ₹{cafe.average_bill}
                      </p>
                      <p className="text-gray-500 text-sm">Discount: {cafe.discount}%</p>
                      <p className="text-yellow-500 mt-1">Rating: {cafe.ratings}/5</p>
                      <p className="text-gray-500 text-sm">
                        Specials: {cafe.specials || "N/A"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Owner: {cafe.cafe_owner_id || "N/A"}
                      </p>
                      <button
                        onClick={() => requestBook(cafe.cafe_id)}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        disabled={transactionLoading}
                      >
                        {transactionLoading ? "Requesting..." : "Request The Book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}