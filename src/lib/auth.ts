import apiClient from './api-client';
import { LoginCredentials, RegisterData, AuthResponse, User } from './types';

// Auth API functions
export const authAPI = {
  // Inscription
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Connexion
  login: async (identifiant: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      identifiant,
      password
    });
    return response.data;
  },

  // Vérification email
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  // Mot de passe oublié
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Réinitialisation mot de passe
  resetPassword: async (token: string, new_password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      new_password
    });
    return response.data;
  },

  // Obtenir les infos utilisateur connecté
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async (refresh_token: string): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh', { refresh_token });
    return response.data;
  },

  // Déconnexion
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Admin API functions
export const adminAPI = {
  // Security endpoints
  getSecuritySummary: () => apiClient.get('/admin/security/summary'),

  getSecurityEvents: (params?: any) => apiClient.get('/admin/security/events', { params }),

  getActiveSessions: () => apiClient.get('/admin/security/sessions/active'),

  getSecurityAlerts: () => apiClient.get('/admin/security/alerts'),

  getSecuritySettings: () => apiClient.get('/admin/security/settings'),

  updateSecuritySettings: (settings: any) => apiClient.put('/admin/security/settings', settings),

  // User management
  getUsers: (params?: any) => apiClient.get('/admin/users', { params }),

  getUserById: (id: string) => apiClient.get(`/admin/users/${id}`),

  createUser: (userData: any) => apiClient.post('/admin/users', userData),

  updateUser: (id: string, userData: any) => apiClient.put(`/admin/users/${id}`, userData),

  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

  // System management
  getSystemStatus: () => apiClient.get('/admin/system/status'),

  getSystemLogs: (params?: any) => apiClient.get('/admin/system/logs', { params }),

  getSystemMetrics: () => apiClient.get('/admin/system/metrics'),
};

export default apiClient;
