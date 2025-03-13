"use client";
import Footer from "../../components/footer"; // Corrected path
import Header from "../../components/header"; // Also corrected for consistency

function MainComponent() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        location="New York"
        onLocationChange={() => {}}
        onSearch={() => {}}
      />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="bg-[#EBF4F6] py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-bold mb-4 font-ibm-plex-sans">
                  Welcome To the Bookshelves
                </h1>
                <p className="text-xl text-gray-600 font-ibm-plex-sans">
                  A place where coffee and books blends seamlessly
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/books-coffee.svg"
                  alt="Books and coffee illustration"
                  className="w-full max-w-md h-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold font-ibm-plex-sans text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center gap-12 p-8 rounded-2xl bg-gray-50">
              <div className="md:w-1/3">
                <div className="text-6xl font-bold text-blue-600 font-ibm-plex-sans">
                  1
                </div>
                <h3 className="text-2xl font-bold mt-4 font-ibm-plex-sans">
                  Sign Up & Subscribe
                </h3>
                <p className="text-gray-600 mt-2 font-ibm-plex-sans">
                  Create an account and choose a subscription plan that works
                  for you.
                </p>
                <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition font-ibm-plex-sans">
                  View Plans
                </button>
              </div>
              <div className="md:w-2/3">
                <img
                  src="/signup-coffee.svg"
                  alt="Sign up illustration"
                  className="w-full h-[400px] object-contain rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12 p-8 rounded-2xl bg-gray-50">
              <div className="md:w-1/3">
                <div className="text-6xl font-bold text-blue-600 font-ibm-plex-sans">
                  2
                </div>
                <h3 className="text-2xl font-bold font-ibm-plex-sans mt-4">
                  Browse & Reserve
                </h3>
                <p className="text-gray-600 font-ibm-plex-sans mt-2">
                  Search for books and find them at your favorite cafés. Reserve
                  with just a click.
                </p>
                <div className="mt-6 relative">
                  <input
                    type="text"
                    placeholder="Find a book..."
                    name="book-search"
                    className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-600 font-ibm-plex-sans"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <img
                  src="/browse-illustration.svg"
                  alt="Illustration showing book browsing and reservation process"
                  className="w-full h-[400px] object-contain rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 p-8 rounded-2xl bg-gray-50">
              <div className="md:w-1/3">
                <div className="text-6xl font-bold text-blue-600 font-ibm-plex-sans">
                  3
                </div>
                <h3 className="text-2xl font-bold font-ibm-plex-sans mt-4">
                  Pick Up & Enjoy
                </h3>
                <p className="text-gray-600 font-ibm-plex-sans mt-2">
                  Visit your chosen café, show your reservation, and start
                  reading!
                </p>
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 font-ibm-plex-sans">
                    Your pickup location:
                  </p>
                  <p className="font-bold font-ibm-plex-sans">
                    Blue Tokai Coffee Roasters
                  </p>
                </div>
              </div>
              <div className="md:w-2/3">
                <img
                  src="/pickup-illustration.svg"
                  alt="Illustration of book pickup process at a cafe"
                  className="w-full h-[400px] object-contain rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-12 p-8 rounded-2xl bg-gray-50">
              <div className="md:w-1/3">
                <div className="text-6xl font-bold text-blue-600 font-ibm-plex-sans">
                  4
                </div>
                <h3 className="text-2xl font-bold mt-4 font-ibm-plex-sans">
                  Return Anytime
                </h3>
                <p className="text-gray-600 mt-2 font-ibm-plex-sans">
                  Drop off your book at any participating café when you're done.
                </p>
                <button className="mt-6 bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition font-ibm-plex-sans">
                  Request Return
                </button>
              </div>
              <div className="md:w-2/3">
                <img
                  src="/return-books.svg"
                  alt="Book return"
                  className="w-full h-[400px] object-contain rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold font-ibm-plex-sans mb-4">
              Ready to start your reading journey?
            </h2>
            <p className="text-gray-600 font-ibm-plex-sans mb-8">
              Join our community of book lovers and coffee enthusiasts today!
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition font-ibm-plex-sans">
              Join Us Now
            </button>
          </div>
        </div>
      </main>
      <Footer
        description="Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences."
        subtext="Sip, read, and connect with us today!"
        linksLeft={[
          { href: "#", text: "How it works ?" },
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
    </div>
  );
}

export default MainComponent;