"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CafeCard } from "../../components/cafe"; // Import CafeCard as named export

// Dummy cafes, replace with real API or props later
const cafes = [
  { id: 1, name: "Cafe Mocha", image: "/mocha.jpg", rating: 4.5, distance: 2, location: "Downtown" },
  { id: 2, name: "Brew & Books", image: "/brew.jpg", rating: 4.2, distance: 3, location: "Uptown" },
  { id: 3, name: "Pages & Lattes", image: "/pages.jpg", rating: 4.8, distance: 1.5, location: "Midtown" },
];

export default function BookCafeSelector() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId"); // you'll fetch book details using this
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (cafe) => {
    setSelectedCafe(cafe);
  };

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-8 min-h-screen bg-background-light dark:bg-background-dark">
      <h1 className="text-3xl font-header mb-6 text-text-light dark:text-text-dark">
        Select a Cafe to Get the Book
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            onClick={() => handleSelect(cafe)}
            className={`border-2 ${
              selectedCafe?.id === cafe.id ? "border-primary" : "border-transparent"
            } rounded-xl p-1 transition-all`}
          >
            <CafeCard cafe={cafe} onExpand={() => {}} />
          </div>
        ))}
      </div>

      {selectedCafe && (
        <button
          onClick={handleConfirm}
          className="mt-8 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark"
        >
          Get this book
        </button>
      )}

      {/* Modal */}
      {showModal && selectedCafe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-background-dark p-6 rounded-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">
              So you want to get <span className="text-primary">Book #{bookId}</span> from{" "}
              <span className="text-primary">
                {selectedCafe.name}, {selectedCafe.location}
              </span>
              ?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCloseModal();
                  alert("Book confirmed!"); // replace with actual logic later
                }}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
