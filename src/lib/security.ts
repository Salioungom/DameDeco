import apiClient from './api-client';
import { SecurityEvent, Session } from './types';

// Security API functions
export const securityAPI = {
  // Security summary
  getSecuritySummary: () => apiClient.get('/admin/security/summary'),
  
  // Security events
  getSecurityEvents: (params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    eventType?: string;
  }) => apiClient.get('/admin/security/events', { params }),

  // Active sessions
  getActiveSessions: () => apiClient.get('/admin/security/sessions/active'),

  revokeSession: (sessionId: string) =>
    apiClient.post(`/admin/security/sessions/${sessionId}/revoke`),

  // Cleanup security data
  cleanupSecurityData: () => apiClient.post('/admin/security/cleanup'),

  // Security stats
  getIPActivityStats: (params?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }) => apiClient.get('/admin/security/stats/ip-activity', { params }),

  getUserActivityStats: (params?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }) => apiClient.get('/admin/security/stats/user-activity', { params }),
};

export default apiClient;
