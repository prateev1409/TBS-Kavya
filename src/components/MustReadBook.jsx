// src/components/MustReadBook.jsx
"use client";

function MustReadBook() {
  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Must Read Book</h2>
      <div className="relative h-72 mb-4">
        <img
          src="/book-featured.jpg"
          alt="Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
          Trending
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Tomorrow, and Tomorrow, and Tomorrow
      </h3>
      <p className="text-gray-600 mb-3">By Gabrielle Zevin</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>⭐ 4.8/5</span>
        <span>📚 Fiction</span>
        <span>🏆 Best of 2023</span>
      </div>
    </div>
  );
}

export default MustReadBook;
