import { useState } from "react";

function CafeCard({ cafe, onExpand }) {
  return (
    <div
      className="cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onExpand(cafe)}
    >
      <img
        src={cafe.image}
        alt={`Image of ${cafe.name}`}
        className="w-full h-[280px] object-cover rounded-lg"
      />
      <h3 className="text-lg font-header font-bold mt-2 text-text-light dark:text-text-dark">
        {cafe.name}
      </h3>
      <p className="text-text-light dark:text-text-dark">{cafe.distance} km away</p>
    </div>
  );
}

function CafeExpanded({ cafe, onClose }) {
  if (!cafe) return null;

  return (
    <div className="fixed inset-0 bg-background-dark bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-2xl max-w-4xl w-full shadow-xl relative font-body">
        <button className="absolute top-4 right-4 text-xl text-text-light dark:text-text-dark" onClick={onClose}>
          ✖
        </button>
        <div className="flex flex-col md:flex-row">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-header font-bold mb-2 text-text-light dark:text-text-dark">{cafe.name}</h2>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Location:</strong> {cafe.location}
            </p>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Distance:</strong> {cafe.distance} km
            </p>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Specialties:</strong> {cafe.specialties}
            </p>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Special Discounts:</strong> {cafe.discounts}
            </p>
            <p className="text-text-light dark:text-text-dark mb-4">
              <strong>Price Range:</strong> {cafe.priceRange}
            </p>
            <p className="text-text-light dark:text-text-dark mb-4">{cafe.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CafeExpansion({ cafes }) {
  const [selectedCafe, setSelectedCafe] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} onExpand={setSelectedCafe} />
        ))}
      </div>
      {selectedCafe && <CafeExpanded cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />}
    </div>
  );
}

export default CafeExpansion;
