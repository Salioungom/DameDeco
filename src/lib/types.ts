export interface Category {
    id: string;
    name: string;
    icon: string;
    image: string;
}

export interface Review {
    id: string;
    productId: string;
    customerName: string;
    customerEmail?: string;
    rating: number; // 1-5
    comment: string;
    date: string;
    verified?: boolean; // Si le client a acheté le produit
    helpful?: number; // Nombre de "utile"
}

import { Product as ApiProduct } from '@/types/product';

export type Product = ApiProduct;

export interface Order {
    id: number;
    order_number: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
    total_amount: string;
    currency: string;
    shipping_address: {
        street: string;
        city: string;
        country: string;
        phone: string;
    };
    items: OrderItem[];
    created_at: string;
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
    };
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: 'retail' | 'wholesale';
    orders: number;
    totalSpent: number;
}


export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'client' | 'superadmin';
    type?: 'retail' | 'wholesale';
    avatar?: string;
    phone?: string;
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
}

export interface AuthResponse {
    user: User;
    token?: string;
    refreshToken?: string;
    message?: string;
}

export interface LoginCredentials {
    identifiant: string;
    password: string;
}

export interface RegisterData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface SecurityEvent {
    id: string;
    userId?: string;
    eventType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    ipAddress: string;
    userAgent?: string;
    timestamp: string;
    resolved?: boolean;
}

export interface Session {
    id: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    lastActivity: string;
    isActive: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
    priceType: 'retail' | 'wholesale';
    addedAt: string;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    itemCount: number;
    updatedAt: string;
}

export interface DeliveryOption {
    id: string;
    name: string;
    description: string;
    price: number;
    estimated_days: number;
    is_available: boolean;
    zones?: string[];
}

export interface PromoCodeValidation {
    valid: boolean;
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
    message?: string;
    code?: string;
    min_order_amount?: number;
}

export interface PromoCodeRequest {
    code: string;
    total_amount: number;
}
