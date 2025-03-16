import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/signin';
  };

  return { isLoggedIn, signOut };
}