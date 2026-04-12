/**
 * @file /services/order.service.ts
 * @description Service dédié à la gestion des commandes avec API v1
 * @version 1.0.0
 * @author DameDéco Team
 */

import { getOrders, getOrderById, createOrder, cancelOrder, getOrderPayments } from '@/lib/api';
import { Order, CartItem } from '@/lib/types';

// Types pour les statuts de commande
export const ORDER_STATUS = {
  PENDING: 'pending' as const,
  CONFIRMED: 'confirmed' as const,
  PROCESSING: 'processing' as const,
  SHIPPED: 'shipped' as const,
  DELIVERED: 'delivered' as const,
  CANCELLED: 'cancelled' as const,
  REFUNDED: 'refunded' as const
};

export const PAYMENT_STATUS = {
  PENDING: 'pending' as const,
  PROCESSING: 'processing' as const,
  PAID: 'paid' as const,
  FAILED: 'failed' as const,
  REFUNDED: 'refunded' as const
};

export const PAYMENT_METHODS = {
  PAYDUNYA: 'paydunya' as const,
  WAVE: 'wave' as const,
  ORANGE_MONEY: 'orange-money' as const,
  CASH: 'cash' as const,
  PAYPAL: 'paypal' as const
};

// Types pour les réponses API
export interface OrderResponse extends Order {
  order_number: string;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  currency: string;
  shipping_address: {
    street: string;
    city: string;
    country: string;
    phone: string;
  };
  items_count?: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  total_price: string;
  product: {
    id: number;
    name: string;
    sku: string;
    cover_image_url?: string;
    images?: Array<{
      id: number;
      image_url: string;
      alt_text?: string;
      is_cover: boolean;
    }>;
  };
}

export interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  created_at: string;
}

// Interface pour la création de commande
export interface CreateOrderData {
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
}

// Service de gestion des commandes
export class OrderService {
  /**
   * Récupérer la liste des commandes du client
   */
  static async getCustomerOrders(
    page: number = 0,
    limit: number = 20,
    status?: keyof typeof ORDER_STATUS
  ): Promise<OrderResponse[]> {
    try {
      const orders = await getOrders(page, limit, status);
      return orders;
    } catch (error) {
      console.error('Erreur récupération commandes:', error);
      throw new Error('Impossible de récupérer les commandes');
    }
  }

  /**
   * Récupérer les détails d'une commande
   */
  static async getOrderDetails(orderId: string | number): Promise<OrderResponse> {
    try {
      const order = await getOrderById(orderId);
      return order;
    } catch (error) {
      console.error('Erreur détails commande:', error);
      throw new Error('Impossible de récupérer les détails de la commande');
    }
  }

  /**
   * Créer une nouvelle commande à partir du panier
   */
  static async createOrderFromCart(
    cartItems: CartItem[],
    shippingAddress: {
      street: string;
      city: string;
      country: string;
      phone: string;
    },
    paymentMethod: string = PAYMENT_METHODS.PAYDUNYA,
    currency: string = 'XOF'
  ): Promise<OrderResponse> {
    try {
      // Transformer les items du panier au format API
      const orderItems = cartItems.map(item => {
        const price = item.priceType === 'wholesale' 
          ? item.product.wholesale_price 
          : item.product.price;
        
        return {
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: price || 0
        };
      });

      const orderData: CreateOrderData = {
        items: orderItems,
        shipping_address: shippingAddress,
        currency,
        payment_method: paymentMethod,
        order_type: 'standard'
      };

      const order = await createOrder(orderData);
      return order;
    } catch (error) {
      console.error('Erreur création commande:', error);
      throw new Error('Impossible de créer la commande');
    }
  }

  /**
   * Annuler une commande du client
   */
  static async cancelCustomerOrder(orderId: string | number): Promise<OrderResponse> {
    try {
      const cancelledOrder = await cancelOrder(orderId);
      return cancelledOrder;
    } catch (error) {
      console.error('Erreur annulation commande:', error);
      throw new Error('Impossible d\'annuler la commande');
    }
  }

  /**
   * Modifier une commande du client
   */
  static async modifyOrder(orderId: string | number, modifications: Array<{
    action: 'add' | 'remove' | 'update';
    product_id: number;
    quantity?: number;
    unit_price?: number;
  }>): Promise<OrderResponse> {
    try {
      // Import des utilitaires d'authentification
      const { getAuthToken, getAuthHeaders } = await import('@/lib/authUtils');
      
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier une commande. Veuillez vous reconnecter.');
      }

      const response = await fetch(`/api/v1/orders/${orderId}/modify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: modifications })
      });

      if (!response.ok) {
        const error = await response.json();
        let errorMessage = 'Impossible de modifier la commande';
        
        // Gestion des erreurs spécifiques du backend
        if (error.detail) {
          if (typeof error.detail === 'string') {
            errorMessage = error.detail;
          } else if (error.detail.msg) {
            errorMessage = error.detail.msg;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Gestion spécifique de l'erreur de credentials
        if (errorMessage.includes('credentials') || errorMessage.includes('Could not validate credentials')) {
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
        }
        
        throw new Error(errorMessage);
      }

      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error('Erreur modification commande:', error);
      
      // Si l'erreur est liée à l'authentification, on peut proposer la reconnexion
      if (error instanceof Error && error.message.includes('reconnecter')) {
        // Optionnellement, on pourrait déclencher une reconnexion automatique
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
      
      throw error;
    }
  }

  /**
   * Récupérer les paiements d'une commande
   */
  static async getOrderPayments(orderId: string | number): Promise<Payment[]> {
    try {
      const payments = await getOrderPayments(orderId);
      return payments as Payment[];
    } catch (error) {
      console.error('Erreur récupération paiements:', error);
      throw new Error('Impossible de récupérer les paiements');
    }
  }

  /**
   * Formater le montant en devise locale
   */
  static formatAmount(amount: string | number, currency: string = 'XOF'): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'FRF', // Pas de XOF dans Intl, utiliser FRF pour format
      minimumFractionDigits: 0
    }).format(numAmount).replace('FRF', currency);
  }

  /**
   * Formater la date en français
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-SN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtenir la couleur du statut pour l'UI
   */
  static getStatusColor(status: string): 'success' | 'warning' | 'info' | 'default' | 'error' {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'refunded':
        return 'error';
      default:
        return 'default';
    }
  }

  /**
   * Obtenir le libellé du statut en français
   */
  static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée',
      'refunded': 'Remboursée'
    };
    return labels[status] || status;
  }

  /**
   * Obtenir le libellé du statut de paiement en français
   */
  static getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'processing': 'En traitement',
      'paid': 'Payé',
      'failed': 'Échoué',
      'refunded': 'Remboursé'
    };
    return labels[status] || status;
  }
}

export default OrderService;
