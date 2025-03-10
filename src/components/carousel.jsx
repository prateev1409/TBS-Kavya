"use client";

const Carousel = ({ title, description, buttonText, images }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-['IBM_Plex_Sans'] text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 font-['IBM_Plex_Sans'] mb-6">
          {description}
        </p>
        <button
          className="bg-gray-900 dark:bg-gray-800 text-white font-['Poppins'] font-bold px-6 py-2 rounded-md 
                     hover:bg-gray-700 dark:hover:bg-gray-700 transition-colors"
        >
          {buttonText}
        </button>
      </div>

      <div className="relative w-full md:w-1/2 h-[400px] flex items-center justify-end pl-8">
        <div className="relative" style={{ right: "-40px" }}>
          {images.map((image, index) => {
            const baseWidth = 320;
            const widthReduction = 60;
            const leftShift = 80;

            const width = baseWidth - index * widthReduction;
            const left = index * leftShift;

            return (
              <img
                key={index}
                src={image}
                alt={`Book cover ${index + 1}`}
                className="absolute rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2"
                style={{
                  width: `${width}px`,
                  right: `${left}px`,
                  zIndex: images.length - index,
                }}
              />
            );
          })}
        </div>
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