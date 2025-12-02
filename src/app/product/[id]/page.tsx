'use client';

import { ProductDetailPage } from '@/components/ProductDetailPage';
import { useStore } from '@/store/useStore';
import { useRouter, useParams } from 'next/navigation';
import { products } from '@/lib/data';

export default function Page() {
    const { addToCart, userType, favorites, toggleFavorite, addReview } = useStore();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const product = products.find((p) => p.id === id);

    if (!product) {
        return <div>Produit non trouvé</div>;
    }

    return (
        <ProductDetailPage
            product={product}
            onAddToCart={addToCart}
            onBack={() => router.back()}
            userType={userType}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewProduct={(p) => router.push(`/product/${p.id}`)}
            onAddReview={(review) => addReview(product.id, review)}
        />
    );
}
