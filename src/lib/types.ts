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

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number; // Prix avant promo
    wholesalePrice: number;
    description: string;
    image: string;
    images: string[];
    stock: number;
    pieces?: number;
    popular?: boolean;
    reviews?: Review[];
    averageRating?: number;
    reviewCount?: number;
}

export interface Order {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment: string;
    items: number;
    source?: 'website' | 'whatsapp';
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
