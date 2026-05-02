'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import {
    FavoriteBorder,
} from '@mui/icons-material';
import Link from 'next/link';
import { FavoriteService, Favorite } from '@/services/favorite.service';
import { productService } from '@/services/product.service';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart, userType, favorites: storeFavorites, toggleFavorite, loadFavorites: loadStoreFavorites } = useStore();
    const router = useRouter();

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                setLoading(true);
                const favoritesData = await FavoriteService.getUserFavorites(0, 20);
                setFavorites(favoritesData.items);

                // Synchroniser le store avec les favoris
                await loadStoreFavorites();

                // Récupérer les détails complets des produits
                const productPromises = favoritesData.items.map(async (favorite) => {
                    try {
                        const product = await productService.getProductById(favorite.product.id.toString());
                        return product;
                    } catch (err) {
                        console.error('Erreur récupération produit:', favorite.product.id, err);
                        return null;
                    }
                });

                const products = await Promise.all(productPromises);
                const validProducts = products.filter(p => p !== null) as Product[];
                setFavoriteProducts(validProducts);
            } catch (err) {
                console.error("Error loading favorites", err);
                setError("Impossible de charger vos favoris.");
                setFavorites([]);
                setFavoriteProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    // Recharger les favoris quand le store change (après toggleFavorite)
    useEffect(() => {
        const reloadFavorites = async () => {
            try {
                const favoritesData = await FavoriteService.getUserFavorites(0, 20);
                setFavorites(favoritesData.items);

                // Récupérer les détails complets des produits
                const productPromises = favoritesData.items.map(async (favorite) => {
                    try {
                        const product = await productService.getProductById(favorite.product.id.toString());
                        return product;
                    } catch (err) {
                        console.error('Erreur récupération produit:', favorite.product.id, err);
                        return null;
                    }
                });

                const products = await Promise.all(productPromises);
                const validProducts = products.filter(p => p !== null) as Product[];
                setFavoriteProducts(validProducts);
            } catch (err) {
                console.error("Error reloading favorites", err);
                // En cas d'erreur, vider la liste
                setFavoriteProducts([]);
            }
        };

        // Ne recharger qu'après le chargement initial pour éviter les appels en double
        if (!loading) {
            reloadFavorites();
        }
    }, [storeFavorites, loading]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!Array.isArray(favoriteProducts) || favoriteProducts.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 8,
                        textAlign: 'center',
                        bgcolor: 'background.default',
                    }}
                >
                    <FavoriteBorder sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        Aucun favori pour le moment
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Commencez à ajouter des produits à vos favoris pour les retrouver facilement
                    </Typography>
                    <Button
                        variant="contained"
                        component={Link}
                        href="/shop"
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Découvrir nos produits
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                    Mes Favoris
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {(favoriteProducts || []).length} produit{(favoriteProducts || []).length > 1 ? 's' : ''} dans vos favoris
                </Typography>
                {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>

            <Grid container spacing={3}>
                {Array.isArray(favoriteProducts) && favoriteProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard
                            product={product}
                            onAddToCart={addToCart}
                            onViewDetails={(p) => router.push(`/product/${p.id}`)}
                            userType={userType}
                            isFavorite={true}
                            onToggleFavorite={toggleFavorite}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
