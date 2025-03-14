"use client";
import Link from "next/link"; // Added import for Link

const Footer = ({ description, subtext, linksLeft, linksRight }) => {
  return (
    <footer className="bg-background-light dark:bg-background-dark px-4 md:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
            <div className="w-4/5 h-auto">
              <img
                src="/ExpandedLogo-Lightmode.png"
                alt="The Book Shelves Logo"
                className="w-full h-auto object-contain dark:hidden"
              />
              <img
                src="/ExpandedLogo-Darkmode.png"
                alt="The Book Shelves Logo"
                className="w-full h-auto object-contain hidden dark:block"
              />
            </div>
          </div>
          <Link
            href="/contact"
            className="text-text-light dark:text-text-dark text-3xl font-header hover:text-primary-light dark:hover:text-primary-dark transition-colors"
          >
            Contact
          </Link>
        </div>

        <div className="max-w-2xl mb-32">
          <p className="text-text-light dark:text-text-dark font-body text-lg leading-relaxed mb-8">
            {description}
          </p>
          <p className="text-text-light dark:text-text-dark font-body text-lg">{subtext}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-border-light dark:border-border-dark">
          <div className="flex space-x-8">
            {linksLeft.map((link, index) => (
              <Link
                key={index}
                href={link.href === "#" && link.text === "How it works ?" ? "/how-it-works" : link.href}
                className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>
          <div className="flex space-x-8">
            {linksRight
              .filter((link) => link.text !== "Contact")
              .map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  {link.text}
                </Link>
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
      { href: "/Subscription", text: "Subscription" },
      { href: "#", text: "Careers" },
      { href: "#", text: "Meet the team" },
      { href: "#", text: "Contact" },
    ],
  };

  return <Footer {...sampleData} />;
};

export default Footer;