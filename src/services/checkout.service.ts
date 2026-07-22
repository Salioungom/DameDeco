/**
 * @file /services/checkout.service.ts
 * @description Service dédié au flux de commande avec API v1
 * @version 3.0.0
 * @author DameDéco Team
 */

import { safeApiCall } from '@/lib/error-handler';
import { api } from '@/lib/api';
import { cartService } from '@/services/cart.service';
import { DeliveryOption, PromoCodeValidation, PromoCodeRequest, Order } from '@/lib/types';

export interface CartSummaryResponse {
  total_items: number;
  total_unique_products: number;
  subtotal: number;
  total: number;
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
  async getCartItems(isGuest: boolean = false) {
    if (isGuest) {
      return cartService.getGuestCart();
    }
    return cartService.getCart();
  },

  async getCartSummary(isGuest: boolean = false) {
    if (isGuest) {
      return cartService.getGuestCartSummary();
    }
    return cartService.getCartSummary();
  },

  async getDeliveryOptions(): Promise<{ data: DeliveryOption[] | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get('/api/v1/delivery-rules/delivery-options/');
      return response.data;
    });
  },

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

  async createOrder(orderData: CreateOrderRequest): Promise<{ data: Order | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.post<Order>('/api/v1/orders/', orderData);
      return response.data;
    });
  },

  async getOrderById(orderId: string | number): Promise<{ data: Order | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get<Order>(`/api/v1/orders/${orderId}`);
      return response.data;
    });
  },

  async getOrderPayments(orderId: string | number): Promise<{ data: any[] | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.get<any[]>(`/api/v1/orders/${orderId}/payments`);
      return response.data;
    });
  }
};

export default checkoutService;
