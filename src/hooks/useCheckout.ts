import { useState, useCallback } from 'react';
import { checkoutService, CartItemsResponse, CartSummaryResponse, CreateOrderRequest } from '@/services/checkout.service';
import { ApiError, ApiErrorHandler } from '@/lib/error-handler';
import { Order, DeliveryOption } from '@/lib/types';

export function useCheckout() {
  const [cartItems, setCartItems] = useState<CartItemsResponse | null>(null);
  const [cartSummary, setCartSummary] = useState<CartSummaryResponse | null>(null);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCartItems = useCallback(async (sessionId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.getCartItems(sessionId);
      
      if (result.error) {
        setError(result.error);
        setCartItems(null);
      } else {
        setCartItems(result.data);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setCartItems(null);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCartSummary = useCallback(async (sessionId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.getCartSummary(sessionId);
      
      if (result.error) {
        setError(result.error);
        setCartSummary(null);
      } else {
        setCartSummary(result.data);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setCartSummary(null);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeliveryOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.getDeliveryOptions();
      
      if (result.error) {
        setError(result.error);
        setDeliveryOptions([]);
      } else {
        setDeliveryOptions(result.data || []);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setDeliveryOptions([]);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const validatePromoCode = useCallback(async (code: string, totalAmount: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.validatePromoCode(code, totalAmount);
      
      if (result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      return { data: null, error: apiError };
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.createOrder(orderData);
      
      if (result.error) {
        setError(result.error);
        setOrder(null);
      } else {
        setOrder(result.data);
      }
      
      return result;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setOrder(null);
      return { data: null, error: apiError };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.getOrderById(orderId);
      
      if (result.error) {
        setError(result.error);
        setOrder(null);
      } else {
        setOrder(result.data);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setOrder(null);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderPayments = useCallback(async (orderId: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await checkoutService.getOrderPayments(orderId);
      
      if (result.error) {
        setError(result.error);
        setPayments([]);
      } else {
        setPayments(result.data || []);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setPayments([]);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetCheckout = useCallback(() => {
    setCartItems(null);
    setCartSummary(null);
    setDeliveryOptions([]);
    setOrder(null);
    setPayments([]);
    setError(null);
  }, []);

  return {
    // State
    cartItems,
    cartSummary,
    deliveryOptions,
    order,
    payments,
    loading,
    error,
    
    // Actions
    fetchCartItems,
    fetchCartSummary,
    fetchDeliveryOptions,
    validatePromoCode,
    createOrder,
    fetchOrderById,
    fetchOrderPayments,
    resetCheckout,
  };
}
