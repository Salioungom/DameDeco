'use client';

import { CheckoutPage } from '@/components/CheckoutPage';
import { useStore } from '@/store/useStore';
import { useCartWithProducts, CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrderService from '@/services/order.service';
import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
    const { cart, clearCart } = useStore();
    const { cart: cartWithProducts } = useCartWithProducts();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handlePlaceOrder = async () => {
        if (cartWithProducts.length === 0) {
            setError('Votre panier est vide');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // Créer la commande via le backend
            const order = await OrderService.createOrderFromCart(
                cartWithProducts,
                {
                    first_name: user?.full_name?.split(' ')[0] || 'Client',
                    last_name: user?.full_name?.split(' ').slice(1).join(' ') || 'Doe',
                    address: 'Adresse par défaut',
                    street: 'Adresse par défaut',
                    city: 'Dakar',
                    country: 'Sénégal',
                    phone: user?.phone || '770000000'
                },
                'wave',
                'XOF',
                'home_delivery'
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
            items={cartWithProducts}
            onBack={() => router.back()}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            error={error}
        />
    );
}
