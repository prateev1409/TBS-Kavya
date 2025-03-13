"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Carousel = ({ title, description, buttonText, images }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxRightShift = isMobile ? 0 : 20;
  let dynamicRightShift = 0;
  if (!isMobile) {
    dynamicRightShift =
      images.length === 1
        ? maxRightShift
        : (maxRightShift / images.length) * 1.7;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-[70%] pr-0 md:pr-32 mb-2 md:mb-0 relative z-10">
        <h1 className="text-4xl md:text-5xl font-header text-primary-light dark:text-primary-dark mb-4">
          {title}
        </h1>
        <p className="text-secondary-light dark:text-secondary-dark font-body mb-6">
          {description}
        </p>
        <Link
          href={
            buttonText === "Browse New Releases" ? "/books/new-releases" :
            buttonText === "Explore Classics" ? "/books/classics" :
            buttonText === "Find Location" ? "/cafes" : "#"
          }
          className="inline-block bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark font-button font-bold px-6 py-2 rounded-md hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors"
        >
          {buttonText}
        </Link>
      </div>

      <div
        className="relative w-full md:w-[30%] h-[300px] md:h-[400px] flex items-center mt-8 md:mt-0"
        style={{
          transform: isMobile ? "none" : `translateX(${-dynamicRightShift}px)`,
        }}
      >
        {isMobile ? (
          <div
            className="relative"
            style={{
              width: `${220 + (images.length - 1) * (50 - 30)}px`,
              margin: "0 auto",
              height: "300px",
            }}
          >
            {images.map((image, index) => {
              const baseWidth = 220;
              const widthReduction = 30;
              const leftShift = 50;
              const verticalShift = 15;

              const width = baseWidth - index * widthReduction;
              const left = index * leftShift;
              const top = index * verticalShift;

              return (
                <img
                  key={index}
                  src={image}
                  alt={`Book cover ${index + 1}`}
                  className="absolute rounded-lg shadow-lg pointer-events-none"
                  style={{
                    width: `${width}px`,
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: images.length - index,
                  }}
                />
              );
            })}
          </div>
        ) : (
          images.map((image, index) => {
            const baseWidth = 280;
            const widthReduction = 40;
            const leftShift = 80;
            const width = baseWidth - index * widthReduction;
            const left = index * leftShift;
            return (
              <img
                key={index}
                src={image}
                alt={`Book cover ${index + 1}`}
                className="absolute rounded-lg shadow-lg pointer-events-none transition-transform duration-300 hover:-translate-y-2"
                style={{
                  width: `${width}px`,
                  left: `${left}px`,
                  zIndex: images.length - index,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

const CarouselStory = () => {
  const sampleData = {
    title: "Featured Books",
    description: "Discover our latest collection of must-read books",
    buttonText: "Browse Collection",
    images: ["/book1.png", "/book2.png", "/book3.png"],
  };

  const singleImageData = {
    title: "Book of the Month",
    description: "Check out our featured book for this month",
    buttonText: "Learn More",
    images: ["/book1.png"],
  };

  const twoImageData = {
    title: "Staff Picks",
    description: "Recommended reads from our book experts",
    buttonText: "View Selection",
    images: ["/book1.png", "/book2.png"],
  };

  return (
    <div className="space-y-8">
      <Carousel {...sampleData} />
      <Carousel {...singleImageData} />
      <Carousel {...twoImageData} />
    </div>
  );
};

export default Carousel;