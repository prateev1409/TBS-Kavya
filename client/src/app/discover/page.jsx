"use client";
import { useEffect, useRef, useState } from "react";
import Book from "../../components/book";
import CafeExpansion from "../../components/cafe";
import Footer from "../../components/footer";
import Header from "../../components/header";
import MustReadBook from "../../components/MustReadBook";
import MustVisitCafe from "../../components/MustVisitCafe";
import ThemeToggle from "../../components/ThemeToggle";

function MainComponent() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [cafeFilters, setCafeFilters] = useState({
    distance: "",
    pricing: "",
  });
  const [bookFilters, setBookFilters] = useState({
    author: "",
    language: "",
    genre: "",
  });

  const filterRef = useRef(null);

  const handleFilterClick = (filterName) => {
    if (activeFilter === filterName) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterName);
    }
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setActiveFilter(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const footerData = {
    description:
      "Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences.",
    subtext: "Sip, read, and connect with us today!",
    linksLeft: [
      { href: "#", text: "How it works ?" },
      { href: "#", text: "Terms of Use" },
      { href: "#", text: "Sales and Refunds" },
    ],
    linksRight: [
      { href: "/Subscription", text: "Subscription" },
      { href: "#", text: "Careers" },
      { href: "#", text: "Meet the team" },
      { href: "#", text: "Contact" },
    ],
  };

  // Dummy data for nearby cafes (non-expanded view)
  const nearbyCafes = [
    {
      id: 1,
      name: "Book & Bean",
      image: "/cafe1.png",
      distance: "0.8km",
      price: "$15",
      rating: "4.7",
    },
    {
      id: 2,
      name: "Chapter One Cafe",
      image: "/cafe2.png",
      distance: "1.2km",
      price: "$18",
      rating: "4.9",
    },
    {
      id: 3,
      name: "Literary Brew",
      image: "/cafe3.png",
      distance: "1.5km",
      price: "$12",
      rating: "4.8",
    },
    {
      id: 4,
      name: "Cafe Delight",
      image: "/cafe4.png",
      distance: "2.0km",
      price: "$10",
      rating: "4.6",
    },
    {
      id: 5,
      name: "Coffee Corner",
      image: "/cafe5.png",
      distance: "2.5km",
      price: "$20",
      rating: "4.5",
    },
    {
      id: 6,
      name: "Brewed Awakenings",
      image: "/cafe6.png",
      distance: "3.0km",
      price: "$8",
      rating: "4.4",
    },
  ];

  // Dummy data for available books
  const availableBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      cover: "/book1.png",
      rating: "4.4",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
      cover: "/book2.png",
      rating: "4.2",
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      genre: "Sci-Fi",
      cover: "/book3.png",
      rating: "3.4",
    },
    {
      id: 4,
      title: "Tomorrow",
      author: "Gabrielle Zevin",
      genre: "Fiction",
      cover: "/book4.png",
      rating: "2.4",
    },
    {
      id: 5,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      cover: "/book5.png",
      rating: "4.7",
    },
    {
      id: 6,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      genre: "Mystery",
      cover: "/book6.png",
      rating: "5.0",
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-header font-bold mb-12">
          Discover Your Next Reading Adventure
        </h1>

        {/* Featured Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MustVisitCafe />
            <MustReadBook />
          </div>
        </section>

        {/* Filters & Lists Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-header font-semibold mb-6">Nearby Cafes</h2>
          <div className="flex gap-4 mb-8" ref={filterRef}>
            <div className="relative">
              <button
                onClick={() => handleFilterClick("distance")}
                className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
              >
                Distance
                <svg
                  className={`w-4 h-4 transition-transform ${
                    activeFilter === "distance" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeFilter === "distance" && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-10 animate-slideDown">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="distance" value="1km" />
                      <span>Within 1km</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="distance" value="3km" />
                      <span>Within 3km</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="distance" value="5km" />
                      <span>Within 5km</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => handleFilterClick("pricing")}
                className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
              >
                Pricing
                <svg
                  className={`w-4 h-4 transition-transform ${
                    activeFilter === "pricing" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeFilter === "pricing" && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-10 animate-slideDown">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="pricing" value="low" />
                      <span>$ (Under $10)</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="pricing" value="medium" />
                      <span>$ ($10-$20)</span>
                    </label>
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="radio" name="pricing" value="high" />
                      <span>$ (Above $20)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Cafes List using existing CafeExpansion component */}
          <section className="mb-16">
            <h2 className="text-3xl font-header font-bold text-primary-light dark:text-primary-dark mb-6">
              Find a new Cafe!
            </h2>
            <CafeExpansion cafes={nearbyCafes} />
          </section>

          {/* Available Books List using existing Book component */}
          <section className="mb-16">
            <h2 className="text-2xl font-header font-semibold mb-6">Available Books</h2>
            <div className="flex gap-4 mb-8 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => handleFilterClick("author")}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
                >
                  Author
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      activeFilter === "author" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFilter === "author" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-10 animate-slideDown">
                    <input
                      type="text"
                      name="author-search"
                      placeholder="Search authors..."
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto">
                      {["Author 1", "Author 2", "Author 3"].map((author) => (
                        <label
                          key={author}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input type="checkbox" name={`author-${author}`} />
                          <span>{author}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => handleFilterClick("language")}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
                >
                  Language
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      activeFilter === "language" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFilter === "language" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-10 animate-slideDown">
                    {["English", "Spanish", "French", "German"].map(
                      (language) => (
                        <label
                          key={language}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input type="checkbox" name={`language-${language}`} />
                          <span>{language}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => handleFilterClick("genre")}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
                >
                  Genre
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      activeFilter === "genre" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFilter === "genre" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-10 animate-slideDown">
                    {[
                      "Fiction",
                      "Non-Fiction",
                      "Mystery",
                      "Science Fiction",
                      "Romance",
                    ].map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input type="checkbox" name={`genre-${genre}`} />
                        <span>{genre}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-header font-semibold mt-12 mb-6">Available Books</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableBooks.map((book) => (
                <Book key={book.id} book={book} />
              ))}
            </div>
          </section>
        </section>
      </div>

      <Footer
        description={footerData.description}
        subtext={footerData.subtext}
        linksLeft={footerData.linksLeft}
        linksRight={footerData.linksRight}
      />

      <ThemeToggle />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;