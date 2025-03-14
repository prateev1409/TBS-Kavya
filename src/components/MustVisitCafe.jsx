// src/components/MustVisitCafe.jsx
"use client";

function MustVisitCafe() {
  return (
    <div className="bg-backgroundSCD-light dark:bg-backgroundSCD-dark rounded-2xl p-6">
      <h2 className="text-2xl font-header font-semibold mb-4">Must Visit Cafe</h2>
      <div className="relative h-72 mb-4">
        <img
          src="/cafe1.png"
          alt="The Reading Room - A cozy cafe with perfect lighting"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-tertiary-light dark:bg-tertiary-dark text-background-light dark:text-background-dark px-3 py-1 rounded-full text-sm font-medium">
          Featured
        </div>
      </div>
      <h3 className="text-xl font-header font-semibold mb-2">The Reading Room</h3>
      <p className="text-text-light dark:text-text-dark mb-3">
        A cozy corner with perfect lighting and endless books
      </p>
      <div className="flex items-center gap-4 text-sm text-text-light dark:text-text-dark">
        <span>⭐ 4.9/5</span>
        <span>📍 0.5km away</span>
        <span>💰 $</span>
      </div>
    </div>
  );
}

export default MustVisitCafe;
