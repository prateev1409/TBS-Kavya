// src/components/book.jsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function BookCard({ book, onExpand }) {
  return (
    <div
      className="cursor-pointer transform transition-transform hover:scale-105"
      onClick={onExpand}
    >
      <img
        src={book.cover}
        alt={`Cover of ${book.title}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-4 right-4 bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded-full shadow-md">
        ⭐{book.rating}/5
      </div>
    </div>
  );
}

function BookExpanded({ book, onClose }) {
  const router = useRouter(); // ✅ Hook should be here!

  return (
    <div
      className="fixed inset-0 bg-background-dark bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background-light dark:bg-background-dark p-6 rounded-2xl max-w-4xl w-full shadow-xl relative font-body"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-xl text-text-light dark:text-text-dark"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-48 h-72 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded-full shadow-md">
              ⭐{book.rating}/5
            </div>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-header font-bold mb-2 text-text-light dark:text-text-dark">
              {book.title}
            </h2>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p className="text-text-light dark:text-text-dark mb-2">
              <strong>Genre:</strong> {book.genre}
            </p>
            <p className="text-text-light dark:text-text-dark mb-4">
              {book.description}
            </p>
            {book.audioSummary && (
              <audio controls className="w-full mb-4">
                <source src={book.audioSummary} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            <button
              className="mt-4 bg-background-dark dark:bg-background-light text-text-dark dark:text-text-light px-4 py-2 rounded-lg hover:bg-primary-dark"
              onClick={() => router.push(`/BookCafeSelector?bookId=${book.id}`)}
            >
              Get it at a Cafe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



function Book({ book }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div onClick={() => setExpanded(true)}>
        <BookCard book={book} onExpand={() => setExpanded(true)} />
      </div>
      {expanded && <BookExpanded book={book} onClose={() => setExpanded(false)} />}
    </>
  );
}

export default Book;
