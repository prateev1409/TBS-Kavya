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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
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

  const books = [
    {
      id: 1,
      title: "The Midnight Hour",
      cover: "/book1.png",
      genre: "Mystery",
      author: "Author A",
      publisher: "Publisher A",
      description: "A thrilling mystery that will keep you on the edge of your seat.",
      audioSummary: "/audio1.mp3",
      rating: 4.2,
    },
    {
      id: 2,
      title: "Stellar Dreams",
      cover: "/book2.png",
      genre: "Science Fiction",
      author: "Author B",
      publisher: "Publisher B",
      description: "A journey into the unknown realms of space and time.",
      audioSummary: "/audio2.mp3",
      rating: 3.8,
    },
    {
      id: 3,
      title: "Love's Journey",
      cover: "/book3.png",
      genre: "Romance",
      author: "Author C",
      publisher: "Publisher C",
      description: "An enchanting story of love and destiny.",
      audioSummary: "/audio3.mp3",
      rating: 4.5,
    },
    {
      id: 4,
      title: "Dark Corners",
      cover: "/book4.png",
      genre: "Horror",
      author: "Author D",
      publisher: "Publisher D",
      description: "A spine-chilling tale that will haunt your dreams.",
      audioSummary: "/audio4.mp3",
      rating: 4.2,
    },
  ];

  const cafes = [
    {
      id: 1,
      name: "The Reading Room",
      image: "/cafe1.png",
      distance: "0.5",
      location: "Downtown",
      specialties: "Espresso & Croissants",
      discounts: "10% off for members",
      priceRange: "$$",
      description: "A cozy cafe perfect for long reading sessions.",
      rating: 4.2,
    },
    {
      id: 2,
      name: "Book & Bean",
      image: "/cafe2.png",
      distance: "1.2",
      location: "Midtown",
      specialties: "Organic Coffee & Snacks",
      discounts: "15% off on weekends",
      priceRange: "$$",
      description: "Enjoy a relaxed ambiance with great coffee.",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Chapter One",
      image: "/cafe3.png",
      distance: "1.8",
      location: "Uptown",
      specialties: "Gourmet Brews",
      discounts: "5% off for students",
      priceRange: "$$$",
      description: "A modern space for readers and coffee enthusiasts.",
      rating: 3.2,
    },
    {
      id: 4,
      name: "Storyline Cafe",
      image: "/cafe4.png",
      distance: "2.1",
      location: "City Center",
      specialties: "Artisan Coffee & Baked Goods",
      discounts: "20% off first-time visitors",
      priceRange: "$$",
      description: "A vibrant cafe with a creative atmosphere.",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Page Turner",
      image: "/cafe5.png",
      distance: "2.5",
      location: "Suburbs",
      specialties: "Light Meals & Coffee",
      discounts: "Free pastry with coffee",
      priceRange: "$",
      description: "A charming spot for quick coffee breaks.",
      rating: 4.2,
    },
    {
      id: 6,
      name: "Bookmark Bistro",
      image: "/cafe6.png",
      distance: "3.0",
      location: "Near University",
      specialties: "Café Classics",
      discounts: "Student discounts available",
      priceRange: "$$",
      description: "Ideal for students and casual meetings.",
      rating: 3.8,
    },
  ];

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.map((book) => (
              <Book key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Cafes Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-header text-primary-light dark:text-primary-dark mb-6">
            Find a new Cafe!
          </h2>
          <CafeExpansion cafes={cafes} />
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
      <ThemeToggle />
    </div>
  );
}

export default TheBookShelves;
