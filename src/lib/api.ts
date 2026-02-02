import axios from 'axios';
import { Product, Category, Order, Customer } from './types';

// Client API pour le frontend (utilise les routes Next.js comme proxy)
const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // Gestion automatique des cookies
});

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

// Orders API
export const getOrders = async (params?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
    const response = await api.get<{ orders: Order[]; total: number; page: number; totalPages: number }>('/orders', { params });
    return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
};

export const createOrder = async (orderData: {
    items: { productId: string; quantity: number; priceType: 'retail' | 'wholesale' }[];
    shippingAddress: any;
    paymentMethod: string;
}): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
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
