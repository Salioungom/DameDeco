'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email?: string;
    phone?: string;
    role: 'admin' | 'client' | 'superadmin';
    full_name: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    requires2FA: boolean;
    roles: ('admin' | 'superadmin' | 'client')[];
}

interface AuthContextType extends AuthState {
    loading: boolean;
    login: (identifier: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string; user?: User }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<boolean>;
    verifyOTP: (otp: string, method: 'totp' | 'email') => Promise<boolean>;
    refetchUser: () => Promise<void>;
}

interface RegisterData {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        requires2FA: false,
        roles: [],
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
            console.log('AuthContext - Token from localStorage:', token);
            console.log('AuthContext - localStorage keys:', Object.keys(localStorage));
            
            if (!token) {
                console.log('AuthContext - No token found');
                setState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    requires2FA: false,
                    roles: [],
                });
                return;
            }

            console.log('AuthContext - Calling http://localhost:8000/api/v1/auth/me...');
            const res = await fetch('http://localhost:8000/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            console.log('AuthContext - /api/v1/auth/me response status:', res.status);
            
            if (res.ok) {
                const data = await res.json();
                console.log('AuthContext - /api/v1/auth/me response data:', data);
                const user = data.user || data; // Supporter les deux formats
                console.log('AuthContext - Extracted user:', user);
                
                if (!user) {
                    console.log('AuthContext - No user found in response');
                    setState({
                        user: null,
                        accessToken: token,
                        isAuthenticated: false,
                        requires2FA: false,
                        roles: [],
                    });
                } else {
                    console.log('AuthContext - User authenticated successfully:', user.role);
                    setState({
                        user,
                        accessToken: token,
                        isAuthenticated: true,
                        requires2FA: data.requires2FA || false,
                        roles: user.role ? [user.role] : [],
                    });
                }
            } else {
                console.log('AuthContext - /api/v1/auth/me failed, status:', res.status);
                const errorData = await res.text();
                console.log('AuthContext - Error response:', errorData);
                // Token invalid, clear it
                localStorage.removeItem('accessToken');
                localStorage.removeItem('token');
                setState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    requires2FA: false,
                    roles: [],
                });
            }
        } catch (error) {
            console.error('AuthContext - Error fetching user:', error);
            setState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                requires2FA: false,
                roles: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (identifier: string, password: string) => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    identifiant: identifier,  // L'API attend 'identifiant' avec un 't'
                    password: password
                }),
            });

            const data = await res.json();
            console.log('Login response:', data);

            if (!res.ok) {
                // Afficher les détails de l'erreur pour le débogage
                console.error('Login error details:', data);
                throw new Error(data.detail?.[0]?.msg || data.message || 'Échec de la connexion');
            }

            // Vérifier si la 2FA est requise
            if (data.requires_2fa) {
                setState(prev => ({
                    ...prev,
                    requires2FA: true,
                    user: data.user || null
                }));
                return { success: true, requires2FA: true, user: data.user };
            }

            // Stocker le token
            const tokenToStore = data.access_token || data.token;
            if (tokenToStore) {
                localStorage.setItem('accessToken', tokenToStore);
                console.log('Access token stored:', tokenToStore.substring(0, 20) + '...');
            } else {
                console.log('No token found in response data');
            }

            // Mettre à jour l'état
            setState({
                user: data.user,
                accessToken: tokenToStore,
                isAuthenticated: true,
                requires2FA: false,
                roles: data.user?.role ? [data.user.role] : []
            });

            return { success: true, user: data.user };

        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Erreur de connexion' 
            };
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (res.ok) {
                return { success: true };
            } else {
                return { success: false, error: responseData.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            if (state.accessToken) {
                await fetch('http://localhost:8000/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${state.accessToken}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            setState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                requires2FA: false,
                roles: [],
            });
            router.push('/login');
        }
    };

    const refreshAccessToken = async () => {
        try {
            const res = await fetch('/api/v1/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (res.ok) {
                const { accessToken } = data;
                localStorage.setItem('accessToken', accessToken);
                setState(prev => ({ ...prev, accessToken }));
                return true;
            } else {
                await logout();
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            await logout();
            return false;
        }
    };

    const verifyOTP = async (otp: string, method: 'totp' | 'email') => {
        try {
            const res = await fetch('/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp, method }),
            });

            const data = await res.json();

            if (res.ok) {
                const { user, accessToken } = data;
                localStorage.setItem('accessToken', accessToken);
                setState({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    requires2FA: false,
                    roles: user.role ? [user.role] : [],
                });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            return false;
        }
    };

    const refetchUser = async () => {
        setLoading(true);
        await fetchUser();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                loading,
                login,
                register,
                logout,
                refreshAccessToken,
                verifyOTP,
                refetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
