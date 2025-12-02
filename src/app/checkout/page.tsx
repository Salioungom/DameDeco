'use client';

import { CheckoutPage } from '@/components/CheckoutPage';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { cart, clearCart } = useStore();
    const router = useRouter();

    const handlePlaceOrder = () => {
        clearCart();
        setTimeout(() => {
            router.push('/');
        }, 2000);
    };

    return (
        <CheckoutPage
            items={cart}
            onBack={() => router.back()}
            onPlaceOrder={handlePlaceOrder}
        />
    );
}
