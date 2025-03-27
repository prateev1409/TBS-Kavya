import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background-light dark:bg-background-dark px-4 md:px-8 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Row 1: Logo and "Contact" Title (stacked on mobile) */}
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between">
          {/* Logo */}
          <div className="w-[200px] sm:w-[300px] mb-4 sm:mb-0">
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
          {/* Contact Title */}
          <div className="text-center sm:text-right">
            <Link
              href="/contact"
              className="text-text-light dark:text-text-dark text-2xl sm:text-3xl font-header hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Row 2: Description and Contact Info (stacked on mobile, left-aligned) */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="flex flex-col w-full sm:w-1/2 space-y-6 sm:space-y-0">
            {/* Description */}
            <div className="text-left">
              <p className="text-text-light dark:text-text-dark font-body text-base sm:text-lg leading-relaxed mb-4">
                Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences.
              </p>
              <p className="text-text-light dark:text-text-dark font-body text-base sm:text-lg">
                Sip, read, and connect with us today!
              </p>
            </div>
            {/* Contact Info (left-aligned on mobile) */}
            <div className="text-left">
              <div className="text-text-light dark:text-text-dark font-body text-sm sm:text-base">
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@thebookshelves.com</p>
                <p>123 Book Street, Reading City, RC 12345</p>
              </div>
              <div className="flex space-x-4 mt-4 justify-start">
                <a
                  href="https://facebook.com/thebookshelves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  <span>FB</span>
                </a>
                <a
                  href="https://instagram.com/thebookshelves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  <span>IG</span>
                </a>
                <a
                  href="https://linkedin.com/company/thebookshelves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                >
                  <span>LI</span>
                </a>
              </div>
            </div>
          </div>
          {/* Empty div to maintain layout on PC */}
          <div className="hidden sm:block sm:w-1/2"></div>
        </div>

        {/* Row 3: Links (stacked vertically on mobile, side by side on PC) */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-8 border-t border-border-light dark:border-border-dark space-y-6 sm:space-y-0">
          {/* Left Links */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 items-center">
            <Link
              href="/how-it-works"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              How it works?
            </Link>
            <Link
              href="#"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Sales and Refunds
            </Link>
          </div>

          {/* Right Links */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 items-center">
            <Link
              href="/Subscription"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Subscription
            </Link>
            <Link
              href="#"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-text-light dark:text-text-dark font-body text-sm sm:text-base hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;