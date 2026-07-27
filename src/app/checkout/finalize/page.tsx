'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useCartWithProducts } from '@/hooks/useCartWithProducts';
import { useStore } from '@/store/useStore';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutFinalize, OrderCheckoutData } from '@/components/checkout/CheckoutFinalize';
import OrderService, { OrderResponse, OrderItem } from '@/services/order.service';
import { CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { Product } from '@/lib/types';
import { Box, CircularProgress, Typography } from '@mui/material';

function orderItemsToCartItems(order: OrderResponse): CartItemWithProduct[] {
  return (order.items || []).map((item: OrderItem) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    price_type: 'retail' as const,
    created_at: order.created_at,
    updated_at: order.created_at,
    product: {
      id: String(item.product.id),
      name: item.product.name,
      slug: '',
      price: Number(item.unit_price),
      wholesale_price: Number(item.unit_price),
      sku: item.product.sku,
      inventory_quantity: 0,
      min_order_quantity: 1,
      status: 'active' as const,
      is_featured: false,
      is_new: false,
      category_id: 0,
      cover_image_url: (item.product as any).cover_image_url,
      images: (item.product as any).images?.map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || '',
        is_cover: img.is_cover,
      })),
      created_at: order.created_at,
      updated_at: order.created_at,
    } as Product,
  }));
}

function CheckoutFinalizeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { cart: storeCart, clearCart } = useStore();
  const { cart: cartWithProducts, loading, invalidateProductsCache } = useCartWithProducts();
  const { resetCheckout } = useCheckoutStore();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const redirectRef = useRef(false);

  const [orderItems, setOrderItems] = useState<CartItemWithProduct[] | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderResponse | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const isOrderMode = !!orderId;
  const displayItems = isOrderMode ? (orderItems || []) : cartWithProducts;

  useEffect(() => {
    if (!loading && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [loading, initialLoadDone]);

  useEffect(() => {
    if (isOrderMode && initialLoadDone && !orderItems && !orderLoading) {
      const fetchOrder = async () => {
        try {
          setOrderLoading(true);
          const order = await OrderService.getOrderDetails(orderId!);
          setOrderDetails(order);
          setOrderItems(orderItemsToCartItems(order));
        } catch (err: any) {
          setError(err.message || 'Impossible de charger les détails de la commande');
        } finally {
          setOrderLoading(false);
        }
      };
      fetchOrder();
    }
  }, [isOrderMode, orderId, initialLoadDone, orderItems, orderLoading]);

  useEffect(() => {
    if (redirectRef.current || authLoading || !initialLoadDone) return;
    if (!isAuthenticated) {
      redirectRef.current = true;
      router.push(`/login?redirect=/checkout/finalize${orderId ? `?orderId=${orderId}` : ''}`);
      return;
    }
    if (!isOrderMode && storeCart.length === 0) {
      redirectRef.current = true;
      router.push('/cart');
    }
  }, [initialLoadDone, isAuthenticated, authLoading, storeCart.length, router, isOrderMode, orderId]);

  const handlePlaceOrder = async (data: OrderCheckoutData) => {
    if (displayItems.length === 0) {
      setError('Aucun article à valider');
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

      if (isOrderMode && orderDetails) {
        redirectRef.current = true;
        resetCheckout();
        router.push(`/checkout/success?orderId=${orderDetails.id}`);
        return;
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
        'FCFA',
        deliveryMethodMap[data.deliveryMethod] || data.deliveryMethod,
        data.paymentPhone,
      );

      redirectRef.current = true;
      clearCart();
      invalidateProductsCache();
      resetCheckout();
      router.push('/checkout/success');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!initialLoadDone || (isOrderMode && orderLoading)) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Chargement de la commande...
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <CheckoutHeader
        activeStep={1}
        onBack={() => isOrderMode ? router.push(`/account/orders/${orderId}`) : router.push('/checkout')}
      />
      <CheckoutFinalize
        items={displayItems}
        onPlaceOrder={handlePlaceOrder}
        isProcessing={isProcessing}
        error={error}
      />
    </div>
  );
}

export default function CheckoutFinalizePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
        </Box>
      </div>
    }>
      <CheckoutFinalizeInner />
    </Suspense>
  );
}
