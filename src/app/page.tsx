'use client';

import { HomePage } from '@/components/HomePage';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { addToCart, userType, favorites, toggleFavorite } = useStore();
    const router = useRouter();

    return (
        <HomePage
            onAddToCart={addToCart}
            onViewProduct={(product) => router.push(`/product/${product.id}`)}
            onViewCategory={(categoryId) => router.push(`/shop?category=${categoryId}`)}
            userType={userType}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
        />
    );
}
