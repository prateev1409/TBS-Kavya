import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(0); // Track last refresh time
    const isLoggedIn = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const refreshToken = useCallback(async () => {
        const now = Date.now();
        if (now - lastRefresh < 5000) {
            // Prevent refreshing more than once every 5 seconds
            console.log('Token refresh throttled');
            return token;
        }

        try {
            const oldToken = localStorage.getItem('token');
            if (!oldToken) {
                throw new Error('No token found for refresh');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${oldToken}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await res.json();
            const newToken = data.token;
            console.log('Token refreshed:', newToken);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setLastRefresh(now);
            return newToken;
        } catch (err) {
            console.error('Error refreshing token:', err);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            router.push('/auth/signin');
            return null;
        }
    }, [token, lastRefresh, router]);

    // Proactively refresh token before it expires
    useEffect(() => {
        const checkToken = async () => {
            if (!token) return;

            try {
                const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilExpiry = decoded.exp - currentTime;

                if (timeUntilExpiry < 300) {
                    // Refresh token if it expires in less than 5 minutes
                    await refreshToken();
                }
            } catch (err) {
                console.error('Error decoding token:', err.message);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                router.push('/auth/signin');
            }
        };

        const interval = setInterval(checkToken, 60000); // Check every 1 minute
        checkToken(); // Check immediately on mount

        return () => clearInterval(interval); // Clear interval on unmount
    }, [token, refreshToken, router]);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/auth/signin');
    };

    return { user, setUser, token, refreshToken, logout, isLoggedIn };
};