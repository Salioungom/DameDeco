// Types pour les données
import { Product } from './types';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  paymentMethod: string;
  shippingAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Données mock pour les clients (conservées temporairement)
export const customers: Customer[] = [
  {
    id: '1',
    name: 'Marie Diop',
    email: 'marie.diop@email.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    totalOrders: 5,
    totalSpent: 250000,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Ahmadou Bâ',
    email: 'ahmadou.ba@email.com',
    phone: '+221 76 987 65 43',
    address: 'Thiès, Sénégal',
    totalOrders: 3,
    totalSpent: 180000,
    joinDate: '2024-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@email.com',
    phone: '+221 78 456 78 90',
    address: 'Saint-Louis, Sénégal',
    totalOrders: 8,
    totalSpent: 420000,
    joinDate: '2023-12-10',
    status: 'active'
  }
];

// Données mock pour les commandes (conservées temporairement)
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'Marie Diop',
    items: [
      {
        productId: '1',
        productName: 'Ensemble draps luxe 6 pièces',
        quantity: 2,
        price: 45000,
        total: 90000
      }
    ],
    total: 90000,
    status: 'delivered',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    paymentMethod: 'Wave',
    shippingAddress: 'Dakar, Sénégal'
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customerName: 'Ahmadou Bâ',
    items: [
      {
        productId: '2',
        productName: 'Rideaux premium 3 pièces',
        quantity: 1,
        price: 35000,
        total: 35000
      },
      {
        productId: '4',
        productName: 'Moquette luxueuse grande taille',
        quantity: 1,
        price: 85000,
        total: 85000
      }
    ],
    total: 120000,
    status: 'processing',
    orderDate: '2024-02-25',
    paymentMethod: 'Orange Money',
    shippingAddress: 'Thiès, Sénégal'
  }
];

// Tableau vide pour les catégories (sera chargé depuis l'API)
export const categories: any[] = [];

// Tableau vide pour les produits (sera chargé depuis l'API)
export const products: Product[] = [];
