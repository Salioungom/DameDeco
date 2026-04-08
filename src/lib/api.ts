/**
 * @file /lib/api.ts
 * @description Instance Axios centralisée avec interceptors robustes
 * @version 2.0.0
 * @author DameDéco Team
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Product, Category, Order, Customer } from './types';

// Types pour les logs structurés
interface ApiLogData {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  error?: string;
  phase: 'request' | 'response' | 'error';
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// Configuration de l'environnement avec fallback sécurisé
const getApiConfig = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    // Log critique mais ne bloque pas le développement
    if (typeof window !== 'undefined') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL non défini. Utilisation du fallback localhost:8000');
      console.warn('📝 Veuillez créer/modifier .env.local et redémarrer le serveur');
    }
  }

  return {
    baseURL: apiUrl || 'http://localhost:8000',
    timeout: 15000, // 15 secondes
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
};

// Création de l'instance Axios
const createApiInstance = (): AxiosInstance => {
  const config = getApiConfig();
  
  const instance = axios.create(config);

  // Logger structuré pour le développement
  const log = (data: ApiLogData) => {
    if (process.env.NODE_ENV === 'development') {
      const { timestamp, method, url, status, duration, error, phase } = data;
      const emoji = phase === 'error' ? '❌' : phase === 'request' ? '📤' : '📥';
      
      console.log(
        `${emoji} API ${phase.toUpperCase()} ${timestamp} ${method} ${url}${status ? ` ${status}` : ''}${duration ? ` (${duration}ms)` : ''}`
      );
      
      if (error) {
        console.error(`   Error: ${error}`);
      }
    }
  };

  // Interceptor de requête
  instance.interceptors.request.use(
    (config: any) => {
      const startTime = Date.now();
      
      // Ajout du timestamp pour tracking
      config.metadata = { startTime };
      
      // Gestion sécurisée du localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        try {
          token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        } catch (error) {
          console.warn('⚠️ Accès localStorage échoué:', error);
        }
      }

      // Ajout du header d'authentification si token présent
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log de la requête
      log({
        timestamp: new Date().toISOString(),
        method: config.method?.toUpperCase() || 'UNKNOWN',
        url: config.url || 'unknown',
        phase: 'request',
      });

      return config;
    },
    (error) => {
      log({
        timestamp: new Date().toISOString(),
        method: 'UNKNOWN',
        url: 'unknown',
        error: error.message,
        phase: 'error',
      });
      return Promise.reject(error);
    }
  );

  // Interceptor de réponse
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const startTime = (response.config as any)?.metadata?.startTime;
      const duration = startTime ? Date.now() - startTime : undefined;

      // Log de la réponse réussie
      log({
        timestamp: new Date().toISOString(),
        method: response.config.method?.toUpperCase() || 'UNKNOWN',
        url: response.config.url || 'unknown',
        status: response.status,
        duration,
        phase: 'response',
      });

      return response;
    },
    (error: AxiosError) => {
      const startTime = (error.config as any)?.metadata?.startTime;
      const duration = startTime ? Date.now() - startTime : undefined;

      // Gestion structurée des erreurs
      let errorMessage = 'Erreur inconnue';
      let statusCode = 0;

      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        statusCode = error.response.status;
        const responseData = error.response.data as any;
        
        errorMessage = responseData?.detail || 
                     responseData?.message || 
                     responseData?.error || 
                     `HTTP ${statusCode}`;
        
        log({
          timestamp: new Date().toISOString(),
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          url: error.config?.url || 'unknown',
          status: statusCode,
          duration,
          error: errorMessage,
          phase: 'error',
        });
      } else if (error.request) {
        // La requête a été faite mais aucune réponse reçue
        errorMessage = 'Aucune réponse du serveur (réseau/timeout)';
        statusCode = 0;
        
        log({
          timestamp: new Date().toISOString(),
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          url: error.config?.url || 'unknown',
          error: errorMessage,
          phase: 'error',
        });
      } else {
        // Erreur de configuration ou autre
        errorMessage = error.message || 'Erreur de configuration';
        
        log({
          timestamp: new Date().toISOString(),
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          url: error.config?.url || 'unknown',
          error: errorMessage,
          phase: 'error',
        });
      }

      // Création d'une erreur structurée
      const structuredError = new Error(errorMessage) as any;
      structuredError.status = statusCode;
      structuredError.code = error.code;
      structuredError.config = error.config;
      structuredError.response = error.response;

      return Promise.reject(structuredError);
    }
  );

  return instance;
};

// Export de l'instance
export const api = createApiInstance();

// Export des utilitaires
export const apiUtils = {
  // Vérification de l'URL de l'API
  getApiUrl: () => getApiConfig().baseURL,
  
  // Vérification de la disponibilité de l'API
  checkApiHealth: async () => {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return { available: true, status: response.status };
    } catch (error) {
      return { available: false, error };
    }
  },

  // Gestion des erreurs standardisée
  handleApiError: (error: any): string => {
    if (error?.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Erreur lors de la communication avec le serveur';
  },

  // Extraction du message d'erreur pour l'UI
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'Erreur inconnue';
  }
};

// Export des types
export type { ApiResponse, ApiLogData };

export const getProducts = async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    search?: string;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    const response = await api.get<{ products: Product[]; total: number; page: number; totalPages: number }>('/products', { params });
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
};

export const searchProducts = async (query: string, params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    const response = await api.get<{ products: Product[]; total: number; page: number; totalPages: number }>('/products/search', { 
        params: { q: query, ...params } 
    });
    return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
};

// Orders API - Nouvelle version selon documentation API v1
export const getOrders = async (page = 0, limit = 20, status?: string): Promise<Order[]> => {
    const params = new URLSearchParams({
        skip: (page * limit).toString(),
        limit: limit.toString()
    });
    
    if (status) {
        params.append('status', status);
    }
    
    const response = await api.get<Order[]>(`/api/v1/orders/?${params}`);
    return response.data;
};

export const getOrderById = async (id: string | number): Promise<Order> => {
    const response = await api.get<Order>(`/api/v1/orders/${id}`);
    return response.data;
};

export const createOrder = async (orderData: {
    items: {
        product_id: string | number;
        quantity: number;
        unit_price: number;
    }[];
    shipping_address: {
        street: string;
        city: string;
        country: string;
        phone: string;
    };
    currency?: string;
    payment_method: string;
    order_type?: string;
}): Promise<Order> => {
    const response = await api.post<Order>('/api/v1/orders/', orderData);
    return response.data;
};

export const cancelOrder = async (id: string | number): Promise<Order> => {
    const response = await api.post<Order>(`/api/v1/orders/${id}/cancel`);
    return response.data;
};

export const getOrderPayments = async (id: string | number): Promise<any[]> => {
    const response = await api.get<any[]>(`/api/v1/orders/${id}/payments`);
    return response.data;
};

// Cart API
export const getCart = async (): Promise<{
    items: { product: Product; quantity: number; priceType: 'retail' | 'wholesale' }[];
    total: number;
    itemCount: number;
}> => {
    const response = await api.get('/cart');
    return response.data;
};

export const addToCart = async (productId: string, quantity: number, priceType: 'retail' | 'wholesale' = 'retail') => {
    const response = await api.post('/cart/items', { productId, quantity, priceType });
    return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
};

export const removeFromCart = async (itemId: string) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await api.delete('/cart');
    return response.data;
};

export default api;
