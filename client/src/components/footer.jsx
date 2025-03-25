import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background-light dark:bg-background-dark px-4 md:px-8 py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Row 1: Logo and "Contact" Text */}
        <div className="flex justify-between items-center">
          <div className="w-[]">
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
          <div>
            <Link
              href="/contact"
              className="text-text-light dark:text-text-dark text-3xl font-header hover:text-primary-light dark:hover:text-primary-dark transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Row 2: Description and Detailed Contact Info with Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Description */}
          <div className="md:w-1/2">
            <p className="text-text-light dark:text-text-dark font-body text-lg leading-relaxed mb-4 md:mb-0">
              Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences.
            </p>
            <p className="text-text-light dark:text-text-dark font-body text-lg">
              Sip, read, and connect with us today!
            </p>
          </div>
          {/* Detailed Contact Info */}
          <div className="md:w-1/2 text-right mt-8 md:mt-0">
            <div className="text-text-light dark:text-text-dark font-body">
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@thebookshelves.com</p>
              <p>123 Book Street, Reading City, RC 12345</p>
            </div>
            <div className="flex space-x-4 mt-4 justify-end">
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

        <div className="flex justify-between items-center pt-8 border-t border-border-light dark:border-border-dark">
  {/* Left Links */}
  <div className="flex space-x-8">
    <Link
      href="/how-it-works"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      How it works ?
    </Link>
    <Link
      href="#"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      Terms of Use
    </Link>
    <Link
      href="#"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      Sales and Refunds
    </Link>
  </div>

  {/* Right Links */}
  <div className="flex space-x-8">
    <Link
      href="/Subscription"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      Subscription
    </Link>
    <Link
      href="#"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
    >
      Careers
    </Link>
    <Link
      href="#"
      className="text-text-light dark:text-text-dark font-body hover:text-primary-light dark:hover:text-primary-dark transition-colors"
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
