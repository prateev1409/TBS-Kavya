import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle

function MainComponent() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md rounded-2xl bg-background-light dark:bg-background-dark p-8 shadow-xl border border-border-light dark:border-border-dark">
        <h1 className="mb-8 text-center text-3xl font-bold text-text-light dark:text-text-dark">
          Sign Out
        </h1>

        <button
          onClick={handleSignOut}
          className="w-full rounded-full bg-background-dark dark:bg-background-light px-4 py-3 text-base font-medium text-text-dark dark:text-text-light transition-colors hover:bg-primary-light dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>

      <ThemeToggle /> {/* Add ThemeToggle component */}
    </div>
  );
}

export default MainComponent;
