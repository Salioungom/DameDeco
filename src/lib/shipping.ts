import apiClient from './api-client';
import { safeApiCall } from './error-handler';
import type {
  ShippingSettings,
  ShippingSettingsCreate,
  ShippingSettingsUpdate,
  ShippingZone,
  ShippingZoneCreate,
  ShippingZoneUpdate,
  ShippingMethod,
  ShippingMethodCreate,
  ShippingMethodUpdate,
  ShippingCalculateRequest,
  ShippingCalculateResponse,
} from './types/shipping';

// Shipping API functions
export const shippingAPI = {
  // Settings
  getSettings: (): Promise<{ data: ShippingSettings | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.get<ShippingSettings>('/api/v1/admin/shipping/settings');
      return response.data;
    });
  },

  // Public endpoint to get shipping settings (read-only)
  getPublicSettings: (): Promise<{ data: ShippingSettings | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.get<ShippingSettings>('/api/v1/shipping/settings');
      return response.data;
    });
  },

  createSettings: (data: ShippingSettingsCreate): Promise<{ data: ShippingSettings | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.post<ShippingSettings>('/api/v1/admin/shipping/settings', data);
      return response.data;
    });
  },

  updateSettings: (data: ShippingSettingsUpdate): Promise<{ data: ShippingSettings | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.put<ShippingSettings>('/api/v1/admin/shipping/settings', data);
      return response.data;
    });
  },

  // Zones
  getZones: (skip = 0, limit = 20, activeOnly = true): Promise<{ data: ShippingZone[] | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.get<ShippingZone[]>(
        `/api/v1/admin/shipping/zones?skip=${skip}&limit=${limit}&active_only=${activeOnly}`
      );
      return response.data;
    });
  },

  createZone: (data: ShippingZoneCreate): Promise<{ data: ShippingZone | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.post<ShippingZone>('/api/v1/admin/shipping/zones', data);
      return response.data;
    });
  },

  getZoneById: (id: number): Promise<{ data: ShippingZone | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.get<ShippingZone>(`/api/v1/admin/shipping/zones/${id}`);
      return response.data;
    });
  },

  updateZone: (id: number, data: ShippingZoneUpdate): Promise<{ data: ShippingZone | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.put<ShippingZone>(`/api/v1/admin/shipping/zones/${id}`, data);
      return response.data;
    });
  },

  deleteZone: (id: number): Promise<{ data: null; error: any }> => {
    return safeApiCall(async () => {
      await apiClient.delete(`/api/v1/admin/shipping/zones/${id}`);
      return null;
    });
  },

  // Methods
  getMethods: (skip = 0, limit = 20, zoneId?: number, activeOnly = true): Promise<{ data: ShippingMethod[] | null; error: any }> => {
    return safeApiCall(async () => {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        active_only: activeOnly.toString(),
      });
      
      if (zoneId) params.append('zone_id', zoneId.toString());
      
      const response = await apiClient.get<ShippingMethod[]>(`/api/v1/admin/shipping/methods?${params}`);
      return response.data;
    });
  },

  createMethod: (data: ShippingMethodCreate): Promise<{ data: ShippingMethod | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.post<ShippingMethod>('/api/v1/admin/shipping/methods', data);
      return response.data;
    });
  },

  getMethodById: (id: number): Promise<{ data: ShippingMethod | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.get<ShippingMethod>(`/api/v1/admin/shipping/methods/${id}`);
      return response.data;
    });
  },

  updateMethod: (id: number, data: ShippingMethodUpdate): Promise<{ data: ShippingMethod | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.put<ShippingMethod>(`/api/v1/admin/shipping/methods/${id}`, data);
      return response.data;
    });
  },

  deleteMethod: (id: number): Promise<{ data: null; error: any }> => {
    return safeApiCall(async () => {
      await apiClient.delete(`/api/v1/admin/shipping/methods/${id}`);
      return null;
    });
  },

  // Public API - Calculate shipping cost
  calculateShippingCost: (data: ShippingCalculateRequest): Promise<{ data: ShippingCalculateResponse | null; error: any }> => {
    return safeApiCall(async () => {
      const response = await apiClient.post<ShippingCalculateResponse>('/api/v1/shipping/calculate', data);
      return response.data;
    });
  },
};

export default apiClient;
