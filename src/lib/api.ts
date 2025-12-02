import axios from 'axios';
import { Product, Category, Order, Customer } from './types';

const api = axios.create({
    baseURL: '/api',
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

// Mock functions for now as we don't have full API routes for everything yet
// but we want to prepare the structure
export const getOrders = async (): Promise<Order[]> => {
    // In a real app: const response = await api.get<Order[]>('/orders');
    // For now, we import from data.ts directly in components or use a mock route
    // But to satisfy the requirement of using Axios, we should create routes for these too.
    // Let's assume we will create them.
    const response = await api.get<Order[]>('/orders');
    return response.data;
};

export default api;
