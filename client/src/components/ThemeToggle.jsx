import useTheme from '../app/Hooks/useTheme';

const ThemeToggle = () => {
  const [isDarkMode, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 sm:right-[1rem] p-2 bg-primary-light dark:bg-primary-dark rounded-full shadow-lg font-button z-50"
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke={isDarkMode ? "#FFFFFF" : "#1F2937"} // White in dark mode, dark gray in light mode
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  );
};

export default ThemeToggle;