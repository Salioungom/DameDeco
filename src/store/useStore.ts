import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, User, Review } from '@/lib/types';

interface StoreState {
    cart: CartItem[];
    isCartOpen: boolean;
    user: User | null;
    favorites: string[];
    isAdmin: boolean;
    userType: 'retail' | 'wholesale';
    isDark: boolean;
    reviews: Record<string, Review[]>;

    // Actions
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: (isOpen?: boolean) => void;
    setUser: (user: User | null) => void;
    toggleFavorite: (productId: string) => void;
    toggleAdmin: () => void;
    setUserType: (type: 'retail' | 'wholesale') => void;
    toggleTheme: () => void;
    addReview: (productId: string, review: Omit<Review, 'id' | 'productId' | 'date'>) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            cart: [],
            isCartOpen: false,
            user: null,
            favorites: [],
            isAdmin: false,
            userType: 'retail',
            isDark: false,
            reviews: {},

            addToCart: (product, quantity = 1) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.product.id === product.id);
                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                            isCartOpen: true,
                        };
                    }
                    return {
                        cart: [...state.cart, {
                            product,
                            quantity,
                            priceType: state.userType,
                            addedAt: new Date().toISOString()
                        }],
                        isCartOpen: true,
                    };
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.product.id !== productId),
                })),

            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                })),

            clearCart: () => set({ cart: [] }),

            toggleCart: (isOpen) =>
                set((state) => ({
                    isCartOpen: typeof isOpen === 'boolean' ? isOpen : !state.isCartOpen,
                })),

            setUser: (user) => set({ user }),

            toggleFavorite: (productId) =>
                set((state) => {
                    const isFavorite = state.favorites.includes(productId);
                    return {
                        favorites: isFavorite
                            ? state.favorites.filter((id) => id !== productId)
                            : [...state.favorites, productId],
                    };
                }),

            toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

            setUserType: (type) => set({ userType: type }),

            toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

            addReview: (productId, review) =>
                set((state) => {
                    const newReview: Review = {
                        ...review,
                        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        productId,
                        date: new Date().toISOString(),
                    };

                    return {
                        reviews: {
                            ...state.reviews,
                            [productId]: [...(state.reviews[productId] || []), newReview],
                        },
                    };
                }),
        }),
        {
            name: 'ecommerce-store',
        }
    )
);
