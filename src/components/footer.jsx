"use client";

const Footer = ({ description, subtext, linksLeft, linksRight }) => {
  return (
    <footer className="bg-[#1C1C1C] px-4 md:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1C1C1C] font-bold text-xl">TBS</span>
            </div>
            <span className="text-white text-2xl font-['IBM_Plex_Sans']">
              THE BOOK SHELVES
            </span>
          </div>
          <a
            href="#"
            className="text-white text-3xl font-['IBM_Plex_Sans'] hover:text-gray-300 transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="max-w-2xl mb-32">
          <p className="text-white font-['IBM_Plex_Sans'] text-lg leading-relaxed mb-8">
            {description}
          </p>
          <p className="text-white font-['IBM_Plex_Sans'] text-lg">{subtext}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-gray-700">
          <div className="flex space-x-8">
            {linksLeft.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-white font-['IBM_Plex_Sans'] hover:text-gray-300 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
          <div className="flex space-x-8">
            {linksRight
              .filter((link) => link.text !== "Contact")
              .map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white font-['IBM_Plex_Sans'] hover:text-gray-300 transition-colors"
                >
                  {link.text}
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterStory = () => {
  const sampleData = {
    description:
      "Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences.",
    subtext: "Sip, read, and connect with us today!",
    linksLeft: [
      { href: "/how-it-works", text: "How it works ?" },
      { href: "#", text: "Terms of Use" },
      { href: "#", text: "Sales and Refunds" },
    ],
    linksRight: [
      { href: "#", text: "Pricing" },
      { href: "#", text: "Careers" },
      { href: "#", text: "Meet the team" },
      { href: "#", text: "Contact" },
    ],
  };

  return <Footer {...sampleData} />;
};

export default Footer;