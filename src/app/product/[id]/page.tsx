'use client';

import { useState, useEffect } from 'react';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { useStore } from '@/store/useStore';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { Product } from '@/types/product';
import { Box, CircularProgress, Typography, Container, Button } from '@mui/material';

export default function Page() {
    const { addToCart, userType, favorites, toggleFavorite, addReview } = useStore();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!id) return;
                setLoading(true);
                // Try to get by ID first, or Slug if ID format implies it. 
                // Currently assuming ID.
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err: any) {
                console.error("Error fetching product", err);
                setError(err.message || 'Produit non trouvé');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error || 'Produit non trouvé'}
                </Typography>
                <Button variant="outlined" onClick={() => router.back()}>
                    Retour
                </Button>
            </Container>
        );
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
            // Review logic disabled for now as per backend schema
            onAddReview={() => { }}
        />
    );
}
