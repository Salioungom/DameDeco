/**
 * @file /services/cart.service.ts
 * @description Service dédié à la gestion du panier avec API v1
 * @version 1.0.0
 * @author DameDéco Team
 */

import { safeApiCall } from '@/lib/error-handler';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';

export interface CartItem {
  id: number;
  user_id: string | null;
  session_id: string | null;
  product_id: number;
  quantity: number;
  unit_price: number;
  price_type: 'retail' | 'wholesale';
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  total_items: number;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  currency: string;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  currency: string;
}

export const cartService = {
  /**
   * Récupérer le panier complet
   */
  async getCart(sessionId?: string): Promise<{ data: CartResponse | null; error: any }> {
    return safeApiCall(async () => {
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.get('/api/v1/cartitems/cart', { params });
      return response.data;
    });
  },

  /**
   * Ajouter un article au panier
   */
  async addToCart(
    productId: string, 
    quantity: number = 1, 
    priceType: 'retail' | 'wholesale' = 'retail',
    sessionId?: string
  ): Promise<{ data: CartItem | null; error: any }> {
    return safeApiCall(async () => {
      const data: any = {
        product_id: productId,
        quantity,
        price_type: priceType
      };
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.post('/api/v1/cartitems/items', data, { params });
      return response.data;
    });
  },

  /**
   * Mettre à jour la quantité d'un article
   */
  async updateCartItem(itemId: string, quantity: number): Promise<{ data: CartItem | null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.put(`/api/v1/cartitems/items/${itemId}`, { quantity });
      return response.data;
    });
  },

  /**
   * Supprimer un article du panier
   */
  async removeFromCart(itemId: string): Promise<{ data: null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.delete(`/api/v1/cartitems/items/${itemId}`);
      return response.data;
    });
  },

  /**
   * Vider le panier complet
   */
  async clearCart(sessionId?: string): Promise<{ data: null; error: any }> {
    return safeApiCall(async () => {
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.delete('/api/v1/cartitems/cart', { params });
      return response.data;
    });
  },

  /**
   * Obtenir le résumé du panier
   */
  async getCartSummary(sessionId?: string): Promise<{ data: CartSummary | null; error: any }> {
    return safeApiCall(async () => {
      const params = sessionId ? { session_id: sessionId } : {};
      const response = await api.get('/api/v1/cartitems/cart/summary', { params });
      return response.data;
    });
  },

  /**
   * Fusionner le panier invité avec le panier utilisateur
   */
  async mergeGuestCart(sessionId: string): Promise<{ data: null; error: any }> {
    return safeApiCall(async () => {
      const response = await api.post('/api/v1/cartitems/merge-guest-cart', { session_id: sessionId });
      return response.data;
    });
  },

  /**
   * Créer une session invité
   */
  createGuestSession(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('guest_session');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('guest_session', sessionId);
    }
    return sessionId;
  },

  /**
   * Nettoyer la session invité après connexion
   */
  clearGuestSession(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('guest_session');
  }
};

export default cartService;
