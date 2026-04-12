/**
 * @file /hooks/useCartSync.ts
 * @description Hook pour gérer la synchronisation du panier (invité ↔ utilisateur)
 * @version 1.0.0
 * @author DameDéco Team
 */

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { cartService } from '@/services/cart.service';

export function useCartSync() {
  const { user, loadCart } = useStore();

  useEffect(() => {
    const syncCart = async () => {
      if (typeof window === 'undefined') return;

      const guestSession = sessionStorage.getItem('guest_session');
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      // Si l'utilisateur se connecte et a une session invité
      if (user && token && guestSession) {
        try {
          console.log('🔄 Fusion du panier invité avec le panier utilisateur...');
          await cartService.mergeGuestCart(guestSession);
          
          // Nettoyer la session invité
          cartService.clearGuestSession();
          
          // Recharger le panier
          await loadCart();
          
          console.log('✅ Fusion du panier réussie');
        } catch (error) {
          console.error('❌ Erreur lors de la fusion du panier:', error);
        }
      }
      
      // Si l'utilisateur se déconnecte, créer une nouvelle session invité
      if (!user && !guestSession) {
        cartService.createGuestSession();
      }
    };

    syncCart();
  }, [user, loadCart]);

  // Fonction pour forcer la synchronisation manuelle
  const forceSync = async () => {
    await loadCart();
  };

  return {
    forceSync
  };
}
