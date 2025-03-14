import useTheme from '../app/Hooks/useTheme';

const ThemeToggle = () => {
  const [isDarkMode, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark rounded-full shadow-lg font-button"
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;