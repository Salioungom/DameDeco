/**
 * @file /services/checkout.service.ts
 * @description Service dédié au flux de commande avec API v1
 * @version 1.0.0
 * @author DameDéco Team
 */

import { safeApiCall } from '@/lib/error-handler';
import { api } from '@/lib/api';
import { DeliveryOption, PromoCodeValidation, PromoCodeRequest, Order } from '@/lib/types';

export interface CartItemsResponse {
  items: {
    product: any;
    quantity: number;
    priceType: 'retail' | 'wholesale';
  }[];
  total: number;
  itemCount: number;
}

export interface CartSummaryResponse {
  total_items: number;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  currency: string;
}

export interface CreateOrderRequest {
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
  delivery_option_id?: string;
  promo_code?: string;
}

export const checkoutService = {
  /**
   * Récupérer les articles du panier
   * GET /api/v1/cartitems/cart
   */
  async getCartItems(sessionId?: string): Promise<{ data: CartItemsResponse | null; error: any }> {
    return safeApiCall(async () => {
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.get('/api/v1/cartitems/cart', { params });
      return response.data;
    });
  },

  /**
   * Obtenir le résumé du panier (sous-total)
   * GET /api/v1/cartitems/cart/summary
   */
  async getCartSummary(sessionId?: string): Promise<{ data: CartSummaryResponse | null; error: any }> {
    return safeApiCall(async () => {
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.get('/api/v1/cartitems/cart/summary', { params });
      return response.data;
    });
  },

  /**
   * Récupérer les options de livraison disponibles
   * GET /api/v1/delivery-rules/delivery-options/
   */
  async getDeliveryOptions(): Promise<{ data: DeliveryOption[] | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get('/api/v1/delivery-rules/delivery-options/');
      return response.data;
    });
  },

  /**
   * Valider un code promo
   * POST /api/v1/promo-codes/validate
   */
  async validatePromoCode(
    code: string,
    totalAmount: number
  ): Promise<{ data: PromoCodeValidation | null; error: any }> {
    return safeApiCall(async () => {
      const request: PromoCodeRequest = {
        code,
        total_amount: totalAmount
      };
      const response = await api.post('/api/v1/promo-codes/validate', request);
      return response.data;
    });
  },

  /**
   * Finaliser la commande
   * POST /api/v1/orders/
   */
  async createOrder(orderData: CreateOrderRequest): Promise<{ data: Order | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.post<Order>('/api/v1/orders/', orderData);
      return response.data;
    });
  },

  /**
   * Suivre une commande
   * GET /api/v1/orders/{order_id}
   */
  async getOrderById(orderId: string | number): Promise<{ data: Order | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get<Order>(`/api/v1/orders/${orderId}`);
      return response.data;
    });
  },

  /**
   * Vérifier le statut de paiement
   * GET /api/v1/orders/{order_id}/payments
   */
  async getOrderPayments(orderId: string | number): Promise<{ data: any[] | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get<any[]>(`/api/v1/orders/${orderId}/payments`);
      return response.data;
    });
  }
};

export default checkoutService;
