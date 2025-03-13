import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle

function MainComponent() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-background-dark p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-background-dark p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-text-dark">
          Sign Out
        </h1>

        <button
          onClick={handleSignOut}
          className="w-full rounded-full bg-black dark:bg-primary-dark px-4 py-3 text-base font-medium text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>

      <ThemeToggle /> {/* Add ThemeToggle component */}
    </div>
  );
}

export default MainComponent;
