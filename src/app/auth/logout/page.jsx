function MainComponent() {
    const handleSignOut = async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Sign Out
          </h1>
  
          <button
            onClick={handleSignOut}
            className="w-full rounded-full bg-black px-4 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }
  