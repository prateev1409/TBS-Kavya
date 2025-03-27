"use client";
import Link from "next/link";
import { useAuth } from "../app/Hooks/useAuth";

const Header = ({ location, onLocationChange, onSearch }) => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="border-b border-border-light dark:border-border-dark px-2 md:px-8 py-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center">
          <Link href="/">
            <div className="w-full h-12 cursor-pointer">
              {!isLoggedIn ? (
                <>
                  <img
                    src="/ExpandedLogo-Lightmode.png"
                    alt="The Book Shelves Logo"
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <img
                    src="/ExpandedLogo-Darkmode.png"
                    alt="The Book Shelves Logo"
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </>
              ) : (
                <>
                  <img
                    src="/Logo-Lightmode.png"
                    alt="The Book Shelves Logo"
                    className="w-full h-full object-contain dark:hidden"
                  />
                  <img
                    src="/Logo-Darkmode.png"
                    alt="The Book Shelves Logo"
                    className="w-full h-full object-contain hidden dark:block"
                  />
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-3xl md:flex hidden">
          <div className="relative flex items-center bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-full p-2 w-full">
            {isLoggedIn && (
              <div className="min-w-[180px] border-r border-border-light dark:border-border-dark pr-4 mr-4">
                <div className="flex items-center gap-2 text-text-light dark:text-text-dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            )}
            <div className={`flex-1 ${isLoggedIn ? "bg-background-light dark:bg-background-dark" : ""} rounded-full flex items-center`}>
              <input
                type="text"
                name="search"
                placeholder={isLoggedIn ? "Search with Book name, Author, Publication or Café name" : "Search with name, Author or Publication"}
                className="flex-1 text-sm text-text-light dark:text-text-dark outline-none bg-transparent px-3 py-1.5"
                onChange={onSearch}
              />
              <button
                onClick={onSearch}
                className="ml-2 p-2 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark rounded-full hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Section (consolidated) */}
        <div className="flex-1 flex md:hidden items-center">
          <div className="flex-1 flex items-center bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-full p-2">
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="flex-1 text-sm text-text-light dark:text-text-dark outline-none bg-transparent px-3 py-1.5"
              onChange={onSearch}
            />
            <button
              onClick={onSearch}
              className="ml-2 p-2 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark rounded-full hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark font-header"
          >
            How it works ?
          </Link>
          <Link
            href="/discover"
            className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark font-header"
          >
            Discover
          </Link>
          {isLoggedIn ? (
            <Link href="/profile">
              <button className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-light dark:text-text-dark"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </button>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark font-header"
            >
              Log in
            </Link>
          )}
        </nav>

        {/* Mobile Profile Button */}
        <div className="md:hidden flex items-center">
          {isLoggedIn ? (
            <Link href="/profile">
              <button className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-light dark:text-text-dark"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </button>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="text-text-light dark:text-text-dark hover:text-primary-light dark:hover:text-primary-dark font-header"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;