'use client';

import { CheckoutPage } from '@/components/CheckoutPage';
import { useStore } from '@/store/useStore';
import { useCartWithProducts, CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrderService from '@/services/order.service';

const DEFAULT_COUNTRY = 'Sénégal';

// ─── Fonction utilitaire de construction du payload ───────────────────────────────
function buildOrderPayload(
  data: import('@/components/CheckoutPage').OrderCheckoutData,
  deliveryMode: string,
  cartItems: CartItemWithProduct[]
) {
  const isPickup = deliveryMode === 'pickup';

  // Normalisation du téléphone
  const normalizePhone = (val: string) => {
    let p = val.trim().replace(/\s+/g, '');
    if (!p) return '';
    if (p.startsWith('00221')) p = '+221' + p.slice(5);
    if (!p.startsWith('+221')) p = '+221' + p;
    return p.replace(/[^\d+]/g, '');
  };

  // Construction de l'adresse selon le mode
  const shippingAddress = isPickup
    ? {
        first_name: '',
        last_name: '',
        address: '',
        street: '',
        city: '',
        country: DEFAULT_COUNTRY,
        phone: '',
      }
    : {
        first_name: data.firstName?.trim() || '',
        last_name: data.lastName?.trim() || '',
        address: data.address?.trim() || '',
        street: data.address?.trim() || '',
        city: data.city?.trim() || 'Dakar, Sénégal',
        country: data.country?.trim() || DEFAULT_COUNTRY,
        phone: normalizePhone(data.phone || '') || '',
      };

  // Validation pour le mode livraison
  if (!isPickup) {
    if (!shippingAddress.first_name || !shippingAddress.last_name ||
        !shippingAddress.phone || !shippingAddress.address) {
      throw new Error('Veuillez remplir tous les champs de livraison');
    }

    // Validation du nom de famille (lettres, espaces, tirets uniquement)
    if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(shippingAddress.last_name)) {
      throw new Error('Le nom ne doit contenir que des lettres, espaces ou tirets');
    }
  }

  // Mapping des méthodes
  const paymentMethodMap: Record<string, string> = {
    'wave': 'wave',
    'orange': 'orange_money',
    'Orange Money': 'orange_money',
    'cod': 'cash',
    'cash': 'cash',
  };

  const deliveryMethodMap: Record<string, string> = {
    'delivery': 'home_delivery',
    'pickup': 'store_pickup',
  };

  // Construction des items
  const orderItems = cartItems.map(item => {
    if (!item.product) {
      throw new Error(`Produit non trouvé pour l'item ${item.product_id}`);
    }
    const price = item.price_type === 'wholesale'
      ? item.product.wholesale_price
      : item.product.price;

    return {
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: Number(price) || 0,
    };
  });

  return {
    items: orderItems,
    shipping_address: shippingAddress,
    currency: 'XOF',
    payment_method: paymentMethodMap[data.paymentMethod] || data.paymentMethod,
    order_type: 'standard',
    mode: deliveryMethodMap[deliveryMode] || deliveryMode,
  };
}

export default function Page() {
    const { cart, clearCart, getSessionId } = useStore();
    const { cart: cartWithProducts } = useCartWithProducts();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);

    // Charger les données de la commande si orderId est présent
    useEffect(() => {
        const orderId = searchParams.get('orderId');
        if (orderId) {
            OrderService.getOrderDetails(orderId).then(order => {
                setOrderData(order);
                // Vider le panier une fois la commande chargée
                clearCart(getSessionId());
            }).catch(err => {
                console.error('Erreur lors du chargement de la commande:', err);
            });
        }
    }, [searchParams, getSessionId, clearCart]);

    const handlePlaceOrder = async (data: import('@/components/CheckoutPage').OrderCheckoutData) => {
        if (cartWithProducts.length === 0) {
            setError('Votre panier est vide');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // Construction du payload avec validation conditionnelle
            const orderPayload = buildOrderPayload(data, data.deliveryMethod, cartWithProducts);

            console.log('📦 Payload envoyé au backend:', orderPayload);

            const order = await OrderService.createOrderFromCart(
                cartWithProducts,
                orderPayload.shipping_address,
                orderPayload.payment_method,
                orderPayload.currency,
                orderPayload.mode,
            );

            clearCart(getSessionId());
            router.push('/checkout/success');

        } catch (err: any) {
            console.error('Erreur création commande:', err);
            setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <CheckoutPage
            items={cartWithProducts}
            onBack={() => router.back()}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            error={error}
            orderData={orderData}
        />
    );
}
