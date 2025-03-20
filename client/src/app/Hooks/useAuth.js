import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to refresh token: ${errorData.error || res.statusText}`);
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      console.log('Token refreshed:', data.token);
      return data.token;
    } catch (err) {
      console.error('Token refresh failed:', err.message);
      localStorage.removeItem('token');
      window.location.href = '/auth/signin';
      return null;
    }
  }, []); // Empty dependency array since refreshToken doesn't depend on any props or state

  const signOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/signin';
  };

  return { isLoggedIn, signOut, refreshToken };
}