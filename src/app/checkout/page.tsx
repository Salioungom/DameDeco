'use client';

import { CheckoutPage } from '@/components/CheckoutPage';
import { useStore } from '@/store/useStore';
import { useCartWithProducts, CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrderService from '@/services/order.service';

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

    const handlePlaceOrder = async () => {
        if (cartWithProducts.length === 0) {
            setError('Votre panier est vide');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // La commande est déjà créée depuis le panier et le panier est déjà vidé
            // Rediriger directement vers la page de succès
            setTimeout(() => {
                router.push('/checkout/success');
            }, 2000);

        } catch (err: any) {
            console.error('Erreur:', err);
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
