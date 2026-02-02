'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [requires2FA, setRequires2FA] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                    setRoles([data.user.role]);
                    setRequires2FA(data.user.requires2FA || false);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setRoles([]);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
                setIsAuthenticated(false);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            setUser(null);
            setIsAuthenticated(false);
            setRoles([]);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshAccessToken = async (): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/refresh', { 
                method: 'POST', 
                credentials: 'include' 
            });
            if (res.ok) {
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
            return false;
        }
    };

    return { 
        user, 
        loading, 
        isAuthenticated,
        roles,
        requires2FA,
        logout,
        refreshAccessToken
    };
}
