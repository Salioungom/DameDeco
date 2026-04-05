import axios, { AxiosError } from 'axios';
import { useState, useCallback, useEffect } from 'react';

// Enhanced error types for better type safety
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  isServerError?: boolean;
  isClientError?: boolean;
}

// Safe error handling utility
export class ApiErrorHandler {
  static isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }

  static extractErrorMessage(error: unknown): string {
    if (this.isAxiosError(error)) {
      // Server responded with error
      if (error.response) {
        const data = error.response.data as any;
        return (
          data?.detail ||
          data?.message ||
          data?.error ||
          `Server error (${error.response.status})`
        );
      }
      
      // Request was made but no response received
      if (error.request) {
        if (error.code === 'ECONNABORTED') {
          return 'La requête a expiré. Veuillez réessayer.';
        }
        return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      }
      
      // Network or configuration error
      return error.message || 'Erreur de configuration de la requête';
    }

    // Non-Axios errors
    if (error instanceof Error) {
      return error.message;
    }

    return 'Une erreur inattendue est survenue.';
  }

  static classifyError(error: unknown): ApiError {
    const message = this.extractErrorMessage(error);
    
    if (this.isAxiosError(error)) {
      const apiError: ApiError = {
        message,
        code: error.code,
        details: error.response?.data,
      };

      if (error.response) {
        apiError.status = error.response.status;
        apiError.isServerError = error.response.status >= 500;
        apiError.isClientError = error.response.status >= 400 && error.response.status < 500;
      } else {
        apiError.isNetworkError = true;
        apiError.isTimeout = error.code === 'ECONNABORTED';
      }

      return apiError;
    }

    return {
      message,
      isNetworkError: false,
      isTimeout: false,
      isServerError: false,
      isClientError: false,
    };
  }

  static shouldRetry(error: unknown): boolean {
    const apiError = this.classifyError(error);
    
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      apiError.isNetworkError === true ||
      apiError.isTimeout === true ||
      (apiError.isServerError === true && (apiError.status || 0) >= 500)
    );
  }

  static isAuthError(error: unknown): boolean {
    if (this.isAxiosError(error)) {
      return error.response?.status === 401 || error.response?.status === 403;
    }
    return false;
  }
}

// Safe API wrapper with error handling
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    customErrorHandler?: (error: unknown) => string;
    retryCount?: number;
    retryDelay?: number;
  }
): Promise<{ data: T | null; error: ApiError | null }> {
  const { customErrorHandler, retryCount = 0, retryDelay = 1000 } = options || {};
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const data = await apiCall();
      return { data, error: null };
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) or auth errors
      if (ApiErrorHandler.isAuthError(error) || ApiErrorHandler.classifyError(error).isClientError) {
        break;
      }
      
      // Retry logic
      if (attempt < retryCount && ApiErrorHandler.shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        continue;
      }
      
      break;
    }
  }

  const apiError = ApiErrorHandler.classifyError(lastError);
  
  // Apply custom error handler if provided
  if (customErrorHandler) {
    apiError.message = customErrorHandler(lastError);
  }

  // Handle auth errors automatically
  if (ApiErrorHandler.isAuthError(lastError)) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      // Redirect to login page (but avoid infinite redirects)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }

  return { data: null, error: apiError };
}

// React hook for safe API calls
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function createSafeApiHook<T>(
  apiCall: () => Promise<T>,
  options?: {
    customErrorHandler?: (error: unknown) => string;
    retryCount?: number;
    retryDelay?: number;
    immediate?: boolean;
  }
) {
  return function useSafeApi(): UseApiState<T> {
    const [state, setState] = useState<{
      data: T | null;
      loading: boolean;
      error: ApiError | null;
    }>({
      data: null,
      loading: options?.immediate !== false,
      error: null,
    });

    const execute = useCallback(async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await safeApiCall(apiCall, options);
      
      setState({
        data: result.data,
        loading: false,
        error: result.error,
      });
    }, [apiCall]);

    useEffect(() => {
      if (options?.immediate !== false) {
        execute();
      }
    }, [execute]);

    return {
      ...state,
      refetch: execute,
    };
  };
}

// Export utilities for backward compatibility
export const handleApiError = ApiErrorHandler.extractErrorMessage;
export const isAxiosError = ApiErrorHandler.isAxiosError;
