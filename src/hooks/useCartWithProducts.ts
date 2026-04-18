import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { CartItem } from '@/services/cart.service';

export interface CartItemWithProduct extends CartItem {
  product: Product | null;
}

export function useCartWithProducts() {
  const { cart, cartLoading } = useStore();
  const [cartWithProducts, setCartWithProducts] = useState<CartItemWithProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      if (!cart || cart.length === 0) {
        setCartWithProducts([]);
        return;
      }

      setProductsLoading(true);
      try {
        // Récupérer tous les produits
        const productsResponse = await getProducts();
        
        if (productsResponse && productsResponse.items) {
          const productsMap = new Map(
            productsResponse.items.map((p: Product) => [p.id, p])
          );

          // Associer chaque item du panier avec son produit
          const cartWithProductsData: CartItemWithProduct[] = cart.map((item) => ({
            ...item,
            product: productsMap.get(item.product_id.toString()) || productsMap.get(item.product_id as any) || null,
          }));

          setCartWithProducts(cartWithProductsData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // En cas d'erreur, utiliser les items sans produits
        setCartWithProducts(cart.map((item) => ({ ...item, product: null })));
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [cart]);

  return {
    cart: cartWithProducts,
    loading: cartLoading || productsLoading,
  };
}
