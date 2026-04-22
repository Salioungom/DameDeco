'use client';

import { ShopPage } from '@/components/ShopPage';
import { useStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function ShopContent() {
    const { addToCart, userType, favorites, toggleFavorite, loadFavorites } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || undefined;

    useEffect(() => {
        loadFavorites();
    }, []);

    return (
        <ShopPage
            onAddToCart={addToCart}
            onViewProduct={(product) => router.push(`/product/${product.id}`)}
            userType={userType}
            initialCategory={initialCategory}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
        />
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <ShopContent />
        </Suspense>
    );
}
