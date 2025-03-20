import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const refreshToken = async () => {
        try {
            const oldToken = localStorage.getItem('token');
            if (!oldToken) {
                throw new Error('No token found for refresh');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${oldToken}`, // Include the old token in the refresh request
                },
            });

            if (!res.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await res.json();
            const newToken = data.token;
            console.log('Token refreshed:', newToken);
            return newToken;
        } catch (err) {
            console.error('Error refreshing token:', err);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/auth/signin');
    };

    return { user, setUser, refreshToken, logout };
};