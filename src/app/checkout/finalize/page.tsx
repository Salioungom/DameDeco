'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCartWithProducts } from '@/hooks/useCartWithProducts';
import { useStore } from '@/store/useStore';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutFinalize, OrderCheckoutData } from '@/components/checkout/CheckoutFinalize';
import OrderService from '@/services/order.service';

export default function CheckoutFinalizePage() {
  const router = useRouter();
  const { cart: storeCart, clearCart, getSessionId } = useStore();
  const { cart: cartWithProducts, loading } = useCartWithProducts();
  const { resetCheckout } = useCheckoutStore();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const redirectRef = useRef(false);

  useEffect(() => {
    if (!loading && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [loading, initialLoadDone]);

  useEffect(() => {
    if (redirectRef.current || authLoading || !initialLoadDone) return;
    if (!isAuthenticated) {
      redirectRef.current = true;
      router.push('/login?redirect=/checkout/finalize');
      return;
    }
    if (storeCart.length === 0) {
      redirectRef.current = true;
      router.push('/cart');
    }
  }, [initialLoadDone, isAuthenticated, authLoading, storeCart.length, router]);

  const handlePlaceOrder = async (data: OrderCheckoutData) => {
    if (cartWithProducts.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const normalizePhone = (val: string) => {
        let p = val.trim().replace(/\s+/g, '');
        if (!p) return '';
        if (p.startsWith('00221')) p = '+221' + p.slice(5);
        if (!p.startsWith('+221')) p = '+221' + p;
        return p.replace(/[^\d+]/g, '');
      };

      const shippingAddress = data.deliveryMethod === 'pickup'
        ? { first_name: '', last_name: '', address: '', street: '', city: '', country: 'Sénégal', phone: '' }
        : {
            first_name: data.firstName?.trim() || '',
            last_name: data.lastName?.trim() || '',
            address: data.address?.trim() || '',
            street: data.address?.trim() || '',
            city: data.city?.trim() || 'Dakar, Sénégal',
            country: data.country?.trim() || 'Sénégal',
            phone: normalizePhone(data.phone || '') || '',
          };

      if (data.deliveryMethod !== 'pickup') {
        if (!shippingAddress.first_name || !shippingAddress.last_name || !shippingAddress.phone || !shippingAddress.address) {
          throw new Error('Veuillez remplir tous les champs de livraison');
        }
      }

      const paymentMethodMap: Record<string, string> = {
        wave: 'wave',
        orange: 'orange_money',
        'Orange Money': 'orange_money',
        cod: 'cash',
        cash: 'cash',
      };

      const deliveryMethodMap: Record<string, string> = {
        delivery: 'home_delivery',
        pickup: 'store_pickup',
      };

      await OrderService.createOrderFromCart(
        cartWithProducts,
        shippingAddress,
        paymentMethodMap[data.paymentMethod] || data.paymentMethod,
        'XOF',
        deliveryMethodMap[data.deliveryMethod] || data.deliveryMethod,
      );

      redirectRef.current = true;
      clearCart(getSessionId());
      resetCheckout();
      router.push('/checkout/success');
    } catch (err: any) {
      console.error('Erreur création commande:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!initialLoadDone) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <CheckoutHeader
        activeStep={1}
        onBack={() => router.push('/checkout')}
      />
      <CheckoutFinalize
        items={cartWithProducts}
        onPlaceOrder={handlePlaceOrder}
        isProcessing={isProcessing}
        error={error}
      />
    </div>
  );
}
