import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, User, Review } from '@/lib/types';
import { cartService, CartItem } from '@/services/cart.service';

interface StoreState {
    cart: CartItem[];
    isCartOpen: boolean;
    user: User | null;
    favorites: string[];
    isAdmin: boolean;
    userType: 'retail' | 'wholesale';
    isDark: boolean;
    reviews: Record<string, Review[]>;
    cartLoading: boolean;
    cartError: string | null;
    sessionId: string;

    // Actions
    loadCart: () => Promise<void>;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: (isOpen?: boolean) => void;
    setUser: (user: User | null) => void;
    toggleFavorite: (productId: string) => void;
    toggleAdmin: () => void;
    setUserType: (type: 'retail' | 'wholesale') => void;
    toggleTheme: () => void;
    addReview: (productId: string, review: Omit<Review, 'id' | 'productId' | 'date'>) => void;
    syncCartWithAPI: () => Promise<void>;
    getSessionId: () => string;
    regenerateSessionId: () => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            cart: [],
            isCartOpen: false,
            user: null,
            favorites: [],
            isAdmin: false,
            userType: 'retail',
            isDark: false,
            reviews: {},
            cartLoading: false,
            cartError: null,
            sessionId: typeof window !== 'undefined' 
                ? localStorage.getItem('guest_session_id') || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                : `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

            // Générer ou récupérer le session_id
            getSessionId: () => {
                let sessionId = get().sessionId;
                if (!sessionId) {
                    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    set({ sessionId });
                    // Sauvegarder dans localStorage pour la persistance
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('guest_session_id', sessionId);
                    }
                }
                return sessionId;
            },

            // Régénérer le session_id (utile après connexion)
            regenerateSessionId: () => {
                const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                set({ sessionId: newSessionId });
                // Sauvegarder dans localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('guest_session_id', newSessionId);
                }
            },

            // Charger le panier depuis l'API
            loadCart: async () => {
                set({ cartLoading: true, cartError: null });
                try {
                    const sessionId = get().getSessionId();
                    const result = await cartService.getCart(sessionId);
                    
                    if (result.error) {
                        set({ cartError: 'Impossible de charger le panier', cartLoading: false });
                        return;
                    }
                    
                    if (result.data) {
                        // Utiliser directement la structure du backend
                        const cartItems: CartItem[] = result.data.items || [];
                        set({ cart: cartItems, cartLoading: false });
                    } else {
                        set({ cart: [], cartLoading: false });
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement du panier:', error);
                    set({ cartError: 'Erreur lors du chargement du panier', cartLoading: false });
                }
            },

            // Ajouter au panier via l'API
            addToCart: async (product, quantity = 1) => {
                set({ cartLoading: true, cartError: null });
                try {
                    const sessionId = get().getSessionId();
                    const result = await cartService.addToCart(
                        product.id.toString(),
                        quantity,
                        get().userType,
                        sessionId
                    );
                    
                    if (result.error) {
                        set({ cartError: 'Impossible d\'ajouter au panier', cartLoading: false });
                        return;
                    }
                    
                    // Recharger le panier après l'ajout
                    await get().loadCart();
                    set({ isCartOpen: true, cartLoading: false });
                } catch (error) {
                    console.error('Erreur lors de l\'ajout au panier:', error);
                    set({ cartError: 'Impossible d\'ajouter au panier', cartLoading: false });
                }
            },

            // Mettre à jour la quantité via l'API
            updateQuantity: async (productId, quantity) => {
                if (quantity === 0) {
                    await get().removeFromCart(productId);
                    return;
                }
                
                set({ cartLoading: true, cartError: null });
                try {
                    const currentCart = get().cart;
                    const cartItem = currentCart.find(item => item.product_id.toString() === productId);
                    
                    if (!cartItem) {
                        set({ cartError: 'Article non trouvé dans le panier', cartLoading: false });
                        return;
                    }
                    
                    console.log('Mise à jour item - ID:', cartItem.id, 'product_id:', cartItem.product_id, 'nouvelle quantité:', quantity);
                    const result = await cartService.updateCartItem(
                        cartItem.id.toString(),
                        quantity
                    );
                    
                    if (result.error) {
                        set({ cartError: 'Erreur lors de la mise à jour du panier', cartLoading: false });
                        return;
                    }
                    
                    // Recharger le panier après la mise à jour
                    await get().loadCart();
                    set({ cartLoading: false });
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du panier:', error);
                    set({ cartError: 'Erreur lors de la mise à jour du panier', cartLoading: false });
                }
            },

            // Supprimer du panier via l'API
            removeFromCart: async (productId: string) => {
                set({ cartLoading: true, cartError: null });
                try {
                    const currentCart = get().cart;
                    const cartItem = currentCart.find(item => item.product_id.toString() === productId);
                    
                    if (!cartItem) {
                        set({ cartError: 'Article non trouvé dans le panier', cartLoading: false });
                        return;
                    }
                    
                    const result = await cartService.removeFromCart(cartItem.id.toString());
                    
                    if (result.error) {
                        set({ cartError: 'Erreur lors de la suppression du panier', cartLoading: false });
                        return;
                    }
                    
                    // Recharger le panier après la suppression
                    await get().loadCart();
                    set({ cartLoading: false });
                } catch (error) {
                    console.error('Erreur lors de la suppression du panier:', error);
                    set({ cartError: 'Erreur lors de la suppression du panier', cartLoading: false });
                }
            },

            // Vider le panier via l'API
            clearCart: async () => {
                set({ cartLoading: true, cartError: null });
                try {
                    const result = await cartService.clearCart();
                    
                    if (result.error) {
                        set({ cartError: 'Impossible de vider le panier', cartLoading: false });
                        return;
                    }
                    
                    set({ cart: [], cartLoading: false });
                } catch (error) {
                    console.error('Erreur lors du vidage du panier:', error);
                    set({ cartError: 'Impossible de vider le panier', cartLoading: false });
                }
            },

            // Synchroniser le panier local avec l'API
            syncCartWithAPI: async () => {
                await get().loadCart();
            },

            toggleCart: (isOpen) =>
                set((state) => ({
                    isCartOpen: typeof isOpen === 'boolean' ? isOpen : !state.isCartOpen,
                })),

            setUser: (user) => {
                set({ user });
                // Si l'utilisateur se connecte, fusionner le panier invité
                if (user) {
                    const sessionId = get().sessionId;
                    if (sessionId) {
                        cartService.mergeGuestCart(sessionId).then(() => {
                            // Recharger le panier après la fusion
                            get().loadCart();
                            // Régénérer le session_id pour éviter les conflits
                            get().regenerateSessionId();
                        });
                    }
                }
            },

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
            storage: createJSONStorage(() => localStorage),
            // Ne pas persister le panier car il vient de l'API
            // sessionId est géré manuellement avec localStorage
            partialize: (state) => ({
                user: state.user,
                favorites: state.favorites,
                isAdmin: state.isAdmin,
                userType: state.userType,
                isDark: state.isDark,
                reviews: state.reviews
            })
        }
    )
);
