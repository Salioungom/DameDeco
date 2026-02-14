/**
 * @file /contexts/AuthContext.tsx
 * @description AuthContext robuste avec gestion d'états et erreurs structurées
 * @version 2.0.0
 * @author DameDéco Team
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, apiUtils } from '@/lib/api';

// Types pour l'authentification
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
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'pending_2fa';
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

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider principal
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        requires2FA: false,
        roles: [],
        status: 'idle',
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Gestion sécurisée du localStorage
    const getStoredToken = (): string | null => {
        if (typeof window === 'undefined') {
            console.warn('🔒 AuthContext: Tentative d\'accès localStorage côté server');
            return null;
        }

        try {
            return localStorage.getItem('accessToken') || localStorage.getItem('token');
        } catch (error) {
            console.warn('⚠️ AuthContext: Erreur accès localStorage:', error);
            return null;
        }
    };

    const clearStoredTokens = (): void => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            console.log('🗑️ AuthContext: Tokens cleared from localStorage');
        } catch (error) {
            console.warn('⚠️ AuthContext: Erreur suppression tokens:', error);
        }
    };

    const setStoredToken = (token: string): void => {
        if (typeof window === 'undefined') {
            console.warn('🔒 AuthContext: Tentative d\'écriture localStorage côté server');
            return;
        }

        try {
            localStorage.setItem('accessToken', token);
            console.log('✅ AuthContext: Token stored successfully');
        } catch (error) {
            console.warn('⚠️ AuthContext: Erreur stockage token:', error);
        }
    };

    // Mise à jour de l'état d'authentification
    const updateAuthState = (updates: Partial<AuthState>): void => {
        setState(prev => ({ ...prev, ...updates }));
    };

    // Gestion des erreurs API
    const handleAuthError = (error: any, context: string): string => {
        const errorMessage = apiUtils.getErrorMessage(error);
        console.error(`❌ AuthContext - ${context}:`, {
            error: errorMessage,
            status: error?.status,
            code: error?.code,
            timestamp: new Date().toISOString()
        });
        return errorMessage;
    };

    // Récupération des informations utilisateur
    const fetchUser = async (): Promise<void> => {
        // Protection contre l'exécution côté server
        if (typeof window === 'undefined') {
            console.log('🔒 AuthContext: fetchUser bloqué côté server');
            setLoading(false);
            return;
        }

        try {
            updateAuthState({ status: 'loading' });
            
            const token = getStoredToken();
            console.log('🔍 AuthContext - Token check:', token ? '✅ Token exists' : '❌ No token found');
            
            if (!token) {
                console.log('🔓 AuthContext - No token, setting unauthenticated state');
                updateAuthState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    requires2FA: false,
                    roles: [],
                    status: 'unauthenticated',
                });
                setLoading(false);
                return;
            }

            console.log('📡 AuthContext - Fetching user data...');
            
            const response = await api.get('/api/v1/auth/me', {
                timeout: 8000, // 8 secondes timeout
            });

            console.log('✅ AuthContext - User data received:', response.data);
            
            const user = response.data.user || response.data;
            if (!user) {
                throw new Error('No user data in API response');
            }

            updateAuthState({
                user,
                accessToken: token,
                isAuthenticated: true,
                requires2FA: response.data.requires2FA || false,
                roles: user.role ? [user.role] : [],
                status: 'authenticated',
            });

            console.log('✅ AuthContext - User authenticated successfully:', user.full_name);

        } catch (error: any) {
            const errorMessage = handleAuthError(error, 'fetchUser');
            
            // Gestion spécifique des erreurs 401
            if (error?.status === 401) {
                console.log('🔓 AuthContext - Unauthorized, clearing invalid token');
                clearStoredTokens();
            }

            updateAuthState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                requires2FA: false,
                roles: [],
                status: 'unauthenticated',
            });
        } finally {
            setLoading(false);
        }
    };

    // Connexion
    const login = async (identifier: string, password: string): Promise<{ success: boolean; requires2FA?: boolean; error?: string; user?: User }> => {
        if (typeof window === 'undefined') {
            return { success: false, error: 'Login not available server-side' };
        }

        try {
            updateAuthState({ status: 'loading' });
            
            console.log('🔐 AuthContext - Attempting login...');
            
            const response = await api.post('/api/v1/auth/login', {
                identifiant: identifier, // Backend attend 'identifiant'
                password: password,
            });

            console.log('✅ AuthContext - Login response received:', response.data);

            // Vérification 2FA
            if (response.data.requires_2fa) {
                updateAuthState({
                    requires2FA: true,
                    user: response.data.user || null,
                    status: 'pending_2fa',
                });
                return { success: true, requires2FA: true, user: response.data.user };
            }

            // Stockage du token
            const token = response.data.access_token || response.data.token;
            if (token) {
                setStoredToken(token);
            } else {
                console.warn('⚠️ AuthContext - No token in login response');
            }

            // Mise à jour état
            updateAuthState({
                user: response.data.user,
                accessToken: token,
                isAuthenticated: true,
                requires2FA: false,
                roles: response.data.user?.role ? [response.data.user.role] : [],
                status: 'authenticated',
            });

            console.log('✅ AuthContext - Login successful:', response.data.user?.full_name);
            return { success: true, user: response.data.user };

        } catch (error: any) {
            const errorMessage = handleAuthError(error, 'login');
            updateAuthState({ status: 'unauthenticated' });
            return { success: false, error: errorMessage };
        }
    };

    // Inscription
    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        if (typeof window === 'undefined') {
            return { success: false, error: 'Registration not available server-side' };
        }

        try {
            console.log('📝 AuthContext - Attempting registration...');
            
            const response = await api.post('/api/v1/auth/register', data);
            console.log('✅ AuthContext - Registration successful');
            
            return { success: true };

        } catch (error: any) {
            const errorMessage = handleAuthError(error, 'register');
            return { success: false, error: errorMessage };
        }
    };

    // Déconnexion
    const logout = async (): Promise<void> => {
        if (typeof window === 'undefined') {
            console.warn('🔒 AuthContext: Logout bloqué côté server');
            return;
        }

        try {
            console.log('🚪 AuthContext - Attempting logout...');
            
            if (state.accessToken) {
                await api.post('/api/v1/auth/logout', {}, { timeout: 5000 });
            }
        } catch (error: any) {
            // Ne pas bloquer la déconnexion en cas d'erreur réseau
            console.warn('⚠️ AuthContext - Logout API error:', apiUtils.getErrorMessage(error));
        } finally {
            clearStoredTokens();
            updateAuthState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                requires2FA: false,
                roles: [],
                status: 'unauthenticated',
            });
            
            console.log('🚪 AuthContext - Logout completed, redirecting to login');
            router.push('/login');
        }
    };

    // Rafraîchissement du token
    const refreshAccessToken = async (): Promise<boolean> => {
        if (typeof window === 'undefined') {
            return false;
        }

        try {
            console.log('🔄 AuthContext - Refreshing access token...');
            
            const response = await api.post('/api/v1/auth/refresh');
            const { accessToken } = response.data;
            
            setStoredToken(accessToken);
            updateAuthState({ accessToken });
            
            console.log('✅ AuthContext - Token refreshed successfully');
            return true;

        } catch (error: any) {
            console.error('❌ AuthContext - Token refresh failed:', error);
            await logout();
            return false;
        }
    };

    // Vérification OTP
    const verifyOTP = async (otp: string, method: 'totp' | 'email'): Promise<boolean> => {
        if (typeof window === 'undefined') {
            return false;
        }

        try {
            console.log('🔢 AuthContext - Verifying OTP...');
            
            const response = await api.post('/api/v1/auth/verify-otp', { otp, method });
            const { user, accessToken } = response.data;
            
            setStoredToken(accessToken);
            updateAuthState({
                user,
                accessToken,
                isAuthenticated: true,
                requires2FA: false,
                roles: user.role ? [user.role] : [],
                status: 'authenticated',
            });
            
            console.log('✅ AuthContext - OTP verification successful');
            return true;

        } catch (error: any) {
            handleAuthError(error, 'verifyOTP');
            return false;
        }
    };

    // Recharger les données utilisateur
    const refetchUser = async (): Promise<void> => {
        await fetchUser();
    };

    // Initialisation au montage du composant
    useEffect(() => {
        console.log('🚀 AuthContext - Initializing...');
        fetchUser();
    }, []);

    // Vérification de la santé de l'API au montage (optionnel)
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            apiUtils.checkApiHealth().then(result => {
                if (!result.available) {
                    console.warn('⚠️ AuthContext - API Health Check Failed:', result.error);
                } else {
                    console.log('✅ AuthContext - API Health Check Passed');
                }
            });
        }
    }, []);

    const contextValue: AuthContextType = {
        ...state,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
        verifyOTP,
        refetchUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook d'utilisation
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export des types
export type { User, AuthState, AuthContextType, RegisterData };
