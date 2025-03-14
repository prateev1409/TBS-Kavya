// src/components/MustReadBook.jsx
"use client";

function MustReadBook() {
  return (
    <div className="bg-backgroundSCD-light dark:bg-backgroundSCD-dark rounded-2xl p-6">
      <h2 className="text-2xl font-header font-semibold mb-4">Must Read Book</h2>
      <div className="relative h-72 mb-4">
        <img
          src="/book1.png"
          alt="Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-tertiary-light dark:bg-tertiary-dark text-background-light dark:text-background-dark px-3 py-1 rounded-full text-sm font-medium">
          Trending
        </div>
      </div>
      <h3 className="text-xl font-header font-semibold mb-2">
        Tomorrow, and Tomorrow, and Tomorrow
      </h3>
      <p className="text-text-light dark:text-text-dark mb-3">By Gabrielle Zevin</p>
      <div className="flex items-center gap-4 text-sm text-text-light dark:text-text-dark">
        <span>⭐ 4.8/5</span>
        <span>📚 Fiction</span>
        <span>🏆 Best of 2023</span>
      </div>
    </div>
  );
}

export default MustReadBook;
