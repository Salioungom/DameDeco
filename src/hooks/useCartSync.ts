import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { cartService } from '@/services/cart.service';

export function useCartSync() {
  const { user, loadCart, getSessionId } = useStore();

  useEffect(() => {
    const syncCart = async () => {
      if (typeof window === 'undefined') return;

      const sessionId = getSessionId();
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (user && token && sessionId) {
        try {
          await cartService.mergeGuestCart(sessionId);
          await loadCart();
        } catch (error) {
          console.error('Erreur lors de la fusion du panier:', error);
        }
      }
    };

    syncCart();
  }, [user, loadCart, getSessionId]);

  const forceSync = async () => {
    await loadCart();
  };

  return {
    forceSync
  };
}
