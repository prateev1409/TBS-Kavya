"use client";
import { useEffect, useState } from "react";
import Book from "../components/book";
import CafeExpansion from "../components/cafe";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import Header from "../components/header";
import ThemeToggle from "../components/ThemeToggle";

function TheBookShelves() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [books, setBooks] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [error, setError] = useState(null);

  // Carousel auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch books from the database
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please sign in again.");
        }
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch books");
      }

      const data = await res.json();
      // Map the API response to match Book component props
      const mappedBooks = data.map((book) => ({
        book_id: book.book_id,
        title: book.name,
        cover: book.image_url || "https://picsum.photos/150", // Fallback image
        genre: book.genre,
        author: book.author,
        publisher: book.publisher,
        description: book.description,
        audioSummary: book.audio_url,
        ratings: book.ratings,
        language: book.language,
        available: book.available,
        is_free: book.is_free,
      }));
      setBooks(mappedBooks);
    } catch (err) {
      console.error("Error fetching books:", err.message);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch cafes from the database
  const fetchCafes = async () => {
    setLoadingCafes(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please sign in again.");
        }
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch cafes");
      }

      const data = await res.json();
      // Map the API response to match CafeExpansion component props
      const mappedCafes = data.map((cafe) => ({
        id: cafe.cafe_id, // CafeExpansion expects 'id', but we'll use cafe_id
        name: cafe.name,
        image: cafe.image_url || "https://picsum.photos/200", // Fallback image
        distance: cafe.distance || "N/A", // Not in schema, assuming API might extend it later
        location: cafe.location,
        audioSummary: cafe.audio_url,
        specialties: cafe.specials,
        discounts: `${cafe.discount}%`,
        priceRange: `₹${cafe.average_bill}`,
        description: cafe.description || "No description available",
        rating: cafe.ratings, // CafeExpansion expects 'rating', not 'ratings'
      }));
      setCafes(mappedCafes);
    } catch (err) {
      console.error("Error fetching cafes:", err.message);
      setError(err.message);
      if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("token");
        window.location.href = "/auth/signin";
      }
    } finally {
      setLoadingCafes(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBooks();
    fetchCafes();
  }, []);

  const carouselSlides = [
    {
      id: 1,
      title: "New Releases",
      description:
        "Discover our latest collection of books fresh off the press. From thrilling mysteries to heartwarming romances, find your next favorite read among our new arrivals this week.",
      images: ["/book1.png", "/book2.png", "/book3.png"],
      buttonText: "Browse New Releases",
    },
    {
      id: 2,
      title: "Must Reads",
      description:
        "Immerse yourself in timeless classics and contemporary masterpieces. Our curated selection of must-read books features unforgettable stories that have captured readers' hearts.",
      images: ["/book1.png", "/book2.png"],
      buttonText: "Explore Classics",
    },
    {
      id: 3,
      title: "Visit Blue Tokai",
      description:
        "Experience the perfect blend of books and artisanal coffee at Blue Tokai. Our newest partner café offers a cozy atmosphere for your reading pleasure with expertly crafted beverages.",
      images: ["/bluetokai-logo.png"],
      buttonText: "Find Location",
    },
  ];

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
        onSearch={() => {}}
      />
      <main className="px-4 md:px-8 max-w-7xl mx-auto py-12">
        {/* Carousel Section */}
        <section className="relative mb-16 h-[650px] md:h-[400px] overflow-hidden">
          <div className="relative h-full bg-[url('/cafe-background.jpg')] bg-cover bg-center">
            {carouselSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <Carousel
                  title={slide.title}
                  description={slide.description}
                  buttonText={slide.buttonText}
                  images={slide.images}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-primary-light dark:bg-primary-dark"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Books Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-header text-primary-light dark:text-primary-dark mb-6">
            Read something new!
          </h2>
          {loadingBooks ? (
            <div className="text-gray-600">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="text-gray-600">No books available.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {books.map((book) => (
                <Book key={book.book_id} book={book} />
              ))}
            </div>
          )}
        </section>

        {/* Cafes Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-header text-primary-light dark:text-primary-dark mb-6">
            Find a new Cafe!
          </h2>
          {loadingCafes ? (
            <div className="text-gray-600">Loading cafes...</div>
          ) : cafes.length === 0 ? (
            <div className="text-gray-600">No cafes available.</div>
          ) : (
            <CafeExpansion cafes={cafes} />
          )}
        </section>

        <Footer
          description="Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences."
          subtext="Sip, read, and connect with us today!"
          linksLeft={[
            { href: "/how-it-works", text: "How it works?" },
            { href: "#", text: "Terms of Use" },
            { href: "#", text: "Sales and Refunds" },
          ]}
          linksRight={[
            { href: "/Subscription", text: "Subscription" },
            { href: "#", text: "Careers" },
            { href: "#", text: "Meet the team" },
            { href: "#", text: "Contact" },
          ]}
        />
      </main>
      <ThemeToggle />
    </div>
  );
}

export default TheBookShelves;