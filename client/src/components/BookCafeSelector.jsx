import { useState } from "react";
import CafeCard from "./cafe"; // Reusing your existing CafeCard component

function BookCafeSelector({ book, cafes }) {
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (cafe) => {
    setSelectedCafe(cafe);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
        Select a Cafe to get "{book.title}"
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            onClick={() => handleSelect(cafe)}
            className={`border-2 rounded-lg ${
              selectedCafe?.id === cafe.id
                ? "border-primary shadow-lg"
                : "border-transparent"
            }`}
          >
            <CafeCard cafe={cafe} onExpand={() => {}} />
          </div>
        ))}
      </div>

      {selectedCafe && (
        <div className="mt-6">
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            onClick={() => setShowConfirm(true)}
          >
            Get this Book
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-background-light dark:bg-background-dark p-6 rounded-2xl w-full max-w-md shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-xl text-text-light dark:text-text-dark"
              onClick={() => setShowConfirm(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-header font-bold mb-4 text-text-light dark:text-text-dark">
              Confirm your action
            </h2>
            <p className="text-text-light dark:text-text-dark mb-4">
              So you want to get <strong>{book.title}</strong> from{" "}
              <strong>{selectedCafe.name}</strong>, {selectedCafe.location}?
            </p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => {
                // You can handle booking logic here
                alert(
                  `Book "${book.title}" reserved at "${selectedCafe.name}"`
                );
                setShowConfirm(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookCafeSelector;
