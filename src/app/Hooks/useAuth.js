export function useAuth() {
    const signOut = () => {
      // Mock sign-out: clear token and redirect to sign-in
      localStorage.removeItem('token'); // Assuming token is stored here
      window.location.href = '/auth/signin';
    };
  
    return {
      signOut,
      // Add other auth-related data if needed (e.g., user, isAuthenticated)
    };
  }