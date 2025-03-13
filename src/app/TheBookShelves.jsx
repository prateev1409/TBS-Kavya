"use client";
import { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import Footer from "../components/Footer";
import Header from "../components/header";

function MainComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [selectedGenre, setSelectedGenre] = useState("");
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
  const books = [
    {
      id: 1,
      title: "The Midnight Hour",
      cover: "/book1.png",
      genre: "Mystery",
    },
    {
      id: 2,
      title: "Stellar Dreams",
      cover: "/book2.png",
      genre: "Science Fiction",
    },
    { id: 3, title: "Love's Journey", cover: "/book3.png", genre: "Romance" },
    { id: 4, title: "Dark Corners", cover: "/book4.png", genre: "Horror" },
  ];
  const cafes = [
    {
      id: 1,
      name: "The Reading Room",
      image: "/cafe1.jpg",
      distance: "0.5 miles away",
    },
    {
      id: 2,
      name: "Book & Bean",
      image: "/cafe2.jpg",
      distance: "1.2 miles away",
    },
    {
      id: 3,
      name: "Chapter One",
      image: "/cafe3.jpg",
      distance: "1.8 miles away",
    },
    {
      id: 4,
      name: "Storyline Cafe",
      image: "/cafe4.jpg",
      distance: "2.1 miles away",
    },
    {
      id: 5,
      name: "Page Turner",
      image: "/cafe5.jpg",
      distance: "2.5 miles away",
    },
    {
      id: 6,
      name: "Bookmark Bistro",
      image: "/cafe6.jpg",
      distance: "3.0 miles away",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        location="New Town, kolkata"
        onLocationChange={() => {}}
        onSearch={() => {}}
      />
      <main className="px-4 md:px-8 max-w-7xl mx-auto py-12">
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
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold font-ibm-plex-sans text-gray-900 dark:text-white mb-6">
            Read something new!
          </h2>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="mb-8 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
              text-gray-900 dark:text-white bg-white dark:bg-gray-800 font-ibm-plex-sans"
            name="genre"
          >
            <option value="">Choose a genre</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
            <option value="Horror">Horror</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Non Fiction">Non Fiction</option>
          </select>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <img
                  src={book.cover}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-[280px] object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold font-ibm-plex-sans text-gray-900 dark:text-white mb-6">
            Find a new Cafe!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <img
                  src={cafe.image}
                  alt={`Interior of ${cafe.name}`}
                  className="w-full h-[200px] object-cover rounded-lg mb-3"
                />
                <h3 className="font-ibm-plex-sans font-semibold text-gray-900 dark:text-white">
                  {cafe.name}
                </h3>
                <p className="font-ibm-plex-sans text-gray-700 dark:text-gray-300 text-sm">
                  {cafe.distance}
                </p>
              </div>
            ))}
          </div>
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
            { href: "#", text: "Pricing" },
            { href: "#", text: "Careers" },
            { href: "#", text: "Meet the team" },
            { href: "#", text: "Contact" },
          ]}
        />
      </main>
    </div>
  );
}

export default MainComponent;