"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function BookCard({ book, onExpand }) {
  return (
    <div
      className="cursor-pointer transform transition-transform hover:scale-105"
      onClick={onExpand}
    >
      <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white dark:bg-black text-black dark:text-white px-2 py-1 rounded-full shadow-md text-xs sm:text-sm">
          ⭐{book.ratings}/5
        </div>
      </div>
      <h3 className="text-sm sm:text-base font-header font-bold mt-2 text-text-light dark:text-text-dark text-center line-clamp-2">
        {book.title}
      </h3>
      <p className="text-xs sm:text-sm text-text-light dark:text-text-dark text-center line-clamp-1">
        {book.author}
      </p>
    </div>
  );
}

function BookExpanded({ book, onClose }) {
  const router = useRouter();
  const handleDownloadPdf = () => {
    if (book.pdfUrl) {
      // Open the PDF in a new tab for viewing or downloading
      window.open(book.pdfUrl, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background-dark bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-background-light dark:bg-background-dark p-4 rounded-2xl w-[90vw] max-w-md mx-auto my-4 shadow-xl relative font-body max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-lg sm:text-xl text-text-light dark:text-text-dark"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[200px] sm:max-w-[240px] mb-4">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-64 sm:h-72 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-white dark:bg-black text-black dark:text-white px-2 py-1 rounded-full shadow-md text-xs sm:text-sm">
              ⭐{book.ratings}/5
            </div>
          </div>
          <div className="w-full text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-header font-bold mb-2 text-text-light dark:text-text-dark">
              {book.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-light dark:text-text-dark mb-2">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="text-xs sm:text-sm text-text-light dark:text-text-dark mb-2">
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p className="text-xs sm:text-sm text-text-light dark:text-text-dark mb-2">
              <strong>Genre:</strong> {book.genre}
            </p>
            <p className="text-xs sm:text-sm text-text-light dark:text-text-dark mb-4">
              {book.description}
            </p>
            {book.audioSummary && (
              <audio controls className="w-full mb-4">
                <source src={book.audioSummary} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {book.pdfUrl && (
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                onClick={handleDownloadPdf}
              >
                View/Download Book in a Nutshell (PDF)
              </button>
            )}
            <button
              className="mt-4 bg-background-dark dark:bg-background-light text-text-dark dark:text-text-light px-4 py-2 rounded-lg hover:bg-primary-dark text-sm sm:text-base"
              onClick={() => router.push(`/BookCafeSelector?bookId=${book.book_id}`)}
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