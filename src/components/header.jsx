"use client";
import React from "react";

const Header = ({ location, onLocationChange, onSearch }) => {
  return (
    <header className="border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">TBS</span>
          </div>
        </div>

        <div className="flex-1 max-w-3xl">
          <div className="relative flex items-center bg-white border border-gray-300 rounded-full p-2">
            <div className="min-w-[180px] border-r border-gray-300 pr-4 mr-4">
              <div className="flex items-center gap-2 text-gray-600">
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

            <div className="flex-1 bg-gray-50 rounded-full flex items-center">
              <input
                type="text"
                name="search"
                placeholder="Search with Book name, Author, Publication or Café name"
                className="flex-1 text-sm text-gray-600 outline-none bg-transparent px-3 py-1.5"
                onChange={onSearch}
              />
              <button
                onClick={onSearch}
                className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
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

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 font-['IBM_Plex_Sans']"
          >
            How it works ?
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 font-['IBM_Plex_Sans']"
          >
            Discover
          </a>
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
        </nav>

        <button className="md:hidden w-10 h-10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

function HeaderStory() {
  return (
    <div className="space-y-8">
      <Header
        location="New Town, kolkata"
        onLocationChange={() => console.log("Location changed")}
        onSearch={() => console.log("Search changed")}
      />
      <Header
        location="Mumbai Central"
        onLocationChange={() => console.log("Location changed")}
        onSearch={() => console.log("Search changed")}
      />
      <Header
        location="Connaught Place, Delhi"
        onLocationChange={() => console.log("Location changed")}
        onSearch={() => console.log("Search changed")}
      />
    </div>
  );
}

export default Header;