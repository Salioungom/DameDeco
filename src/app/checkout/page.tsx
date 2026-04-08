'use client';

import { CheckoutPage } from '@/components/CheckoutPage';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OrderService from '@/services/order.service';

export default function Page() {
    const { cart, clearCart } = useStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setError('Votre panier est vide');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // Créer la commande via le backend
            const order = await OrderService.createOrderFromCart(
                cart,
                {
                    street: 'Adresse par défaut',
                    city: 'Dakar',
                    country: 'Sénégal',
                    phone: '770000000'
                },
                'wave'
            );

            console.log('Commande créée avec succès:', order);

            // Vider le panier
            clearCart();

            // Rediriger vers la page de succès
            setTimeout(() => {
                router.push('/checkout/success');
            }, 2000);

        } catch (err: any) {
            console.error('Erreur lors de la création de la commande:', err);
            setError(err.message || 'Impossible de créer la commande. Veuillez réessayer.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <CheckoutPage
            items={cart}
            onBack={() => router.back()}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            error={error}
        />
    );
}
