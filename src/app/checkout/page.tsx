'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useCartWithProducts } from '@/hooks/useCartWithProducts';
import { useStore } from '@/store/useStore';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutRecap } from '@/components/checkout/CheckoutRecap';

export default function CheckoutRecapPage() {
  const router = useRouter();
  const { cart: storeCart } = useStore();
  const { cart: cartWithProducts, loading } = useCartWithProducts();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { setDeliveryFee, setEstimatedDays } = useCheckoutStore();
  const [shippingLoading, setShippingLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const redirectRef = useRef(false);

  useEffect(() => {
    if (!loading && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [loading, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone && !redirectRef.current && storeCart.length === 0) {
      redirectRef.current = true;
      router.push('/cart');
    }
  }, [initialLoadDone, storeCart.length, router]);

  // Estimate shipping on page load
  useEffect(() => {
    if (!initialLoadDone || cartWithProducts.length === 0) return;

    const subtotal = cartWithProducts.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price;
      return sum + (price || 0) * item.quantity;
    }, 0);

    if (subtotal === 0) return;

    setShippingLoading(true);
    fetch('/api/v1/shipping/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subtotal, deliveryMode: 'delivery' }),
    })
      .then((r) => r.json())
      .then((data) => {
        setDeliveryFee(Number(data.shippingCost) || 2000);
        setEstimatedDays(data.estimatedDays || '2-5 jours ouvrables');
      })
      .catch(() => {
        setDeliveryFee(2000);
        setEstimatedDays('2-5 jours ouvrables');
      })
      .finally(() => setShippingLoading(false));
  }, [initialLoadDone, cartWithProducts, setDeliveryFee, setEstimatedDays]);

  if (!initialLoadDone) {
    return null;
  }

  const handleContinue = () => {
    if (isAuthenticated) {
      router.push('/checkout/finalize');
    } else {
      setCheckingAuth(true);
      setTimeout(() => {
        router.push('/login?redirect=/checkout/finalize');
      }, 800);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <CheckoutHeader
        activeStep={0}
        onBack={() => router.push('/cart')}
      />
      <CheckoutRecap
        items={cartWithProducts}
        onContinue={handleContinue}
        onBackToCart={() => router.push('/cart')}
        shippingLoading={shippingLoading}
        checkingAuth={checkingAuth}
      />
    </div>
  );
}
