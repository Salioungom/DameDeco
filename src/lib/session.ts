import apiClient from './api-client';
import { Session } from './types';

// Sessions API functions
export const sessionsAPI = {
  // User sessions
  getSessions: () => apiClient.get('/sessions'),

  logoutSession: (sessionId: string) =>
    apiClient.post(`/sessions/logout`, { sessionId }),

  logoutAllSessions: () => apiClient.post('/sessions/logout-all'),

  // Admin sessions
  getUserSessions: (userId: string) =>
    apiClient.get(`/admin/sessions/${userId}`),

  revokeAllUserSessions: (userId: string) =>
    apiClient.post(`/admin/sessions/${userId}/revoke-all`),
};

export default apiClient;
