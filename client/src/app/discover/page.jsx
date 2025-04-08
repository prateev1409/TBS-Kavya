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
  const [cafeFilters, setCafeFilters] = useState({ distance: "", pricing: "" });
  const [bookFilters, setBookFilters] = useState({ 
    author: "", 
    language: "", 
    genre: "",
    hasAudio: false,
    hasDownload: false 
  });
  const [books, setBooks] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [error, setError] = useState(null);
  const [bookFilterOptions, setBookFilterOptions] = useState({
    authors: [], languages: [], genres: [],
  });
  const [cafeFilterOptions, setCafeFilterOptions] = useState({
    locations: [], average_bills: [], ratings: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const cafeFilterRef = useRef(null);
  const bookFilterRef = useRef(null);

  const filterRef = useRef(null);

  const handleFilterClick = (filterName) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleClickOutside = (event) => {
    const isCafe = cafeFilterRef.current && cafeFilterRef.current.contains(event.target);
    const isBook = bookFilterRef.current && bookFilterRef.current.contains(event.target);
  
    if (!isCafe && !isBook) {
      setActiveFilter(null);
    }
  };

  // Fetch book filter options
  const fetchBookFilters = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/filters`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch book filters");
      const { authors, languages, genres } = await res.json();
      setBookFilterOptions({
        authors: authors.slice(0, 5),
        languages: languages.slice(0, 5),
        genres: genres.slice(0, 5),
      });
    } catch (err) {
      console.error("Error fetching book filters:", err.message);
      setError(err.message);
    }
  };

  // Fetch cafe filter options
  const fetchCafeFilters = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes/filters`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch cafe filters");
      const { locations, average_bills, ratings } = await res.json();
      setCafeFilterOptions({
        locations: locations.slice(0, 5),
        average_bills: average_bills.sort((a, b) => a - b).slice(0, 3),
        ratings: ratings.sort((a, b) => a - b).slice(0, 5),
      });
    } catch (err) {
      console.error("Error fetching cafe filters:", err.message);
      setError(err.message);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const query = new URLSearchParams({
        available: true,
        ...(searchQuery && { name: searchQuery }),
        ...(bookFilters.author && { author: bookFilters.author }),
        ...(bookFilters.language && { language: bookFilters.language }),
        ...(bookFilters.genre && { genre: bookFilters.genre }),
        ...(bookFilters.hasAudio && { hasAudio: true }), // Only books with audio_url
        ...(bookFilters.hasDownload && { hasDownload: true }), // Only books with pdf_url
      }).toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch books");
      const data = await res.json();
      const mappedBooks = data.map((book) => ({
        book_id: book.book_id,
        title: book.name,
        cover: book.image_url || "https://picsum.photos/150",
        genre: book.genre,
        author: book.author,
        publisher: book.publisher,
        description: book.description,
        audioSummary: book.audio_url,
        pdfUrl: book.pdf_url,
        ratings: book.ratings,
        language: book.language,
        available: book.available,
        is_free: book.is_free,
      }));
      setBooks(mappedBooks);
    } catch (err) {
      console.error("Error fetching books:", err.message);
      setError(err.message);
    } finally {
      setLoadingBooks(false);
    }
  };
  // Fetch cafes
  const fetchCafes = async () => {
    setLoadingCafes(true);
    try {
      const query = new URLSearchParams({
        ...(searchQuery && { name: searchQuery }),
        ...(cafeFilters.distance && { distance: cafeFilters.distance }),
        ...(cafeFilters.pricing && { average_bill: cafeFilters.pricing }),
      }).toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch cafes");
      const data = await res.json();
      const mappedCafes = data.map((cafe) => ({
        id: cafe.cafe_id,
        name: cafe.name,
        image: cafe.image_url || "https://picsum.photos/150",
        distance: cafe.distance || "N/A",
        priceRange: `₹${cafe.average_bill}`,
        rating: cafe.ratings,
        location: cafe.location,
        audioSummary: cafe.audio_url,
        specialties: cafe.specials,
        discounts: `${cafe.discount}%`,
        description: cafe.description || "No description available",
      }));
      setCafes(mappedCafes);
    } catch (err) {
      console.error("Error fetching cafes:", err.message);
      setError(err.message);
    } finally {
      setLoadingCafes(false);
    }
  };

  // Handle filter changes
  const handleCafeFilterChange = (filterType, value) => {
    setCafeFilters((prev) => ({ ...prev, [filterType]: value }));
    setActiveFilter(null);
  };

  const handleBookFilterChange = (filterType, value) => {
    if (filterType === "hasAudio" || filterType === "hasDownload") {
      setBookFilters((prev) => ({ ...prev, [filterType]: value }));
    } else {
      setBookFilters((prev) => ({ ...prev, [filterType]: value || "" }));
    }
    setActiveFilter(null);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Fetch data on mount and when filters/search change
  useEffect(() => {
    fetchBookFilters();
    fetchCafeFilters();
    fetchBooks();
    fetchCafes();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [bookFilters, searchQuery]);

  useEffect(() => {
    fetchCafes();
  }, [cafeFilters, searchQuery]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header
        location="New Town, Kolkata"
        onLocationChange={() => {}}
        onSearch={handleSearch}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Section - Hidden during search */}
        {!searchQuery && (
          <section className="mb-16">
              <h1 className="text-4xl font-header font-bold mb-12">
                Discover Your Next Reading Adventure 
              </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MustVisitCafe />
              <MustReadBook />
            </div>
          </section>
        )}

        {/* Filters & Lists Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-header font-semibold mb-6">Nearby Cafes</h2>
          <div className="flex gap-4 mb-8" ref={cafeFilterRef}>
            <div className="relative">
              <button
                onClick={() => handleFilterClick("distance")}
                className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
              >
                {cafeFilters.distance || "Distance"}
                <svg
                  className={`w-4 h-4 transition-transform ${activeFilter === "distance" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFilter === "distance" && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-20 animate-slideDown">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="distance"
                        value=""
                        checked={cafeFilters.distance === ""}
                        onChange={() => handleCafeFilterChange("distance", "")}
                      />
                      <span>Reset</span>
                    </label>
                    {["1km", "3km", "5km"].map((dist) => (
                      <label
                        key={dist}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="distance"
                          value={dist}
                          checked={cafeFilters.distance === dist}
                          onChange={() => handleCafeFilterChange("distance", dist)}
                        />
                        <span>Within {dist}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => handleFilterClick("pricing")}
                className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
              >
                {cafeFilters.pricing ? `₹${cafeFilters.pricing}` : "Pricing"}
                <svg
                  className={`w-4 h-4 transition-transform ${activeFilter === "pricing" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeFilter === "pricing" && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-20 animate-slideDown">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="radio"
                        name="pricing"
                        value=""
                        checked={cafeFilters.pricing === ""}
                        onChange={() => handleCafeFilterChange("pricing", "")}
                      />
                      <span>Reset</span>
                    </label>
                    {cafeFilterOptions.average_bills.map((bill) => (
                      <label
                        key={bill}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="pricing"
                          value={bill}
                          checked={cafeFilters.pricing === String(bill)}
                          onChange={() => handleCafeFilterChange("pricing", String(bill))}
                        />
                        <span>₹{bill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Cafes List */}
          <section className="mb-16">
            {loadingCafes ? (
              <div className="text-gray-600">Loading cafes...</div>
            ) : cafes.length === 0 ? (
              <div className="text-gray-600">No cafes found.</div>
            ) : (
              <CafeExpansion cafes={cafes} />
            )}
          </section>

          {/* Available Books List */}
          <section className="mb-16">
            <h2 className="text-2xl font-header font-semibold mb-6">Available Books</h2>
            <div className="flex gap-4 mb-8 flex-wrap" ref={bookFilterRef}>
              <div className="relative">
                <button
                  onClick={() => handleFilterClick("author")}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
                >
                  {bookFilters.author || "Author"}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeFilter === "author" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFilter === "author" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-20 animate-slideDown">
                    <input
                      type="text"
                      name="author-search"
                      placeholder="Search authors..."
                      className="w-full p-2 border rounded mb-2 text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark"
                      value={bookFilters.author}
                      onChange={(e) => handleBookFilterChange("author", e.target.value)}
                    />
                    <div className="max-h-48 overflow-y-auto">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="author"
                          value=""
                          checked={bookFilters.author === ""}
                          onChange={(e) => handleBookFilterChange("author", e.target.value)}
                        />
                        <span>Reset</span>
                      </label>
                      {bookFilterOptions.authors.map((author) => (
                        <label
                          key={author}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="author"
                            value={author}
                            checked={bookFilters.author === author}
                            onChange={(e) => handleBookFilterChange("author", e.target.value)}
                          />
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
                  {bookFilters.language || "Language"}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeFilter === "language" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFilter === "language" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-20 animate-slideDown">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="language"
                          value=""
                          checked={bookFilters.language === ""}
                          onChange={(e) => handleBookFilterChange("language", e.target.value)}
                        />
                        <span>Reset</span>
                      </label>
                      {bookFilterOptions.languages.map((language) => (
                        <label
                          key={language}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="language"
                            value={language}
                            checked={bookFilters.language === language}
                            onChange={(e) => handleBookFilterChange("language", e.target.value)}
                          />
                          <span>{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => handleFilterClick("genre")}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 hover:border-gray-400 transition-colors"
                >
                  {bookFilters.genre || "Genre"}
                  <svg
                    className={`w-4 h-4 transition-transform ${activeFilter === "genre" ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFilter === "genre" && (
                  <div className="absolute top-full mt-2 w-48 bg-white dark:bg-background-dark border rounded-lg shadow-lg p-2 z-20 animate-slideDown">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="genre"
                          value=""
                          checked={bookFilters.genre === ""}
                          onChange={(e) => handleBookFilterChange("genre", e.target.value)}
                        />
                        <span>Reset</span>
                      </label>
                      {bookFilterOptions.genres.map((genre) => (
                        <label
                          key={genre}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="genre"
                            value={genre}
                            checked={bookFilters.genre === genre}
                            onChange={(e) => handleBookFilterChange("genre", e.target.value)}
                          />
                          <span>{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Downloadable Checkbox with Circular Styling */}
              <div className="relative">
                <label className="flex items-center space-x-2 p-2 border rounded-full hover:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    className="circular-checkbox"
                    checked={bookFilters.hasAudio}
                    onChange={(e) => handleBookFilterChange("hasAudio", e.target.checked)}
                  />
                  <span>Audio Enabled</span>
                </label>
              </div>
              {/* Downloadable Checkbox with Circular Styling */}
              <div className="relative">
                <label className="flex items-center space-x-2 p-2 border rounded-full hover:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    className="circular-checkbox"
                    checked={bookFilters.hasDownload}
                    onChange={(e) => handleBookFilterChange("hasDownload", e.target.checked)}
                  />
                  <span>Downloadable</span>
                </label>
              </div>
            </div>
            {loadingBooks ? (
              <div className="text-gray-600">Loading books...</div>
            ) : books.length === 0 ? (
              <div className="text-gray-600">No books found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Book key={book.book_id} book={book} />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      <Footer />
      <ThemeToggle />

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        /* Circular Checkbox Styling */
        .circular-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #4b5563; /* gray-600 */
          border-radius: 50%;
          background-color: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .circular-checkbox:checked {
          border-color: #3b82f6; /* blue-500 */
          background-color: #3b82f6;
        }

        .circular-checkbox:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .circular-checkbox:hover {
          border-color: #6b7280; /* gray-500 */
        }

        .circular-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* blue-500/30 */
        }

        /* Dark mode adjustments */
        .dark .circular-checkbox {
          border-color: #9ca3af; /* gray-400 */
        }

        .dark .circular-checkbox:checked {
          border-color: #60a5fa; /* blue-400 */
          background-color: #60a5fa;
        }

        .dark .circular-checkbox:hover {
          border-color: #d1d5db; /* gray-300 */
        }
      `}</style>
    </div>
  );
}

export default MainComponent;