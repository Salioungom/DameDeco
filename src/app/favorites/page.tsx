'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Button,
    Chip,
    Paper,
    alpha,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    ShoppingCart,
    Delete,
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { products } from '@/lib/data';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Link from 'next/link';

export default function FavoritesPage() {
    const { favorites, toggleFavorite, addToCart } = useStore();

    const favoriteProducts = products.filter((product) =>
        favorites.includes(product.id)
    );

    const handleRemoveFavorite = (productId: string) => {
        toggleFavorite(productId);
    };

    const handleAddToCart = (product: any) => {
        addToCart(product);
    };

    if (favoriteProducts.length === 0) {
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
                    {favoriteProducts.length} produit{favoriteProducts.length > 1 ? 's' : ''} dans vos favoris
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {favoriteProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                },
                            }}
                        >
                            {/* Favorite Button */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: alpha('#fff', 0.9),
                                    '&:hover': {
                                        bgcolor: '#fff',
                                    },
                                    zIndex: 1,
                                }}
                                onClick={() => handleRemoveFavorite(product.id)}
                            >
                                <Favorite sx={{ color: 'error.main' }} />
                            </IconButton>

                            {/* Product Image */}
                            <Box
                                component={Link}
                                href={`/product/${product.id}`}
                                sx={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    overflow: 'hidden',
                                    bgcolor: 'background.default',
                                    textDecoration: 'none',
                                }}
                            >
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {product.popular && (
                                    <Chip
                                        label="Populaire"
                                        color="error"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Product Details */}
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Typography
                                    variant="subtitle1"
                                    component={Link}
                                    href={`/product/${product.id}`}
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: 'block',
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        '&:hover': {
                                            color: 'primary.main',
                                        },
                                    }}
                                    noWrap
                                >
                                    {product.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {product.description}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography variant="h6" color="primary" fontWeight={700}>
                                        {product.price.toLocaleString('fr-FR')} FCFA
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<ShoppingCart />}
                                    onClick={() => handleAddToCart(product)}
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    Ajouter au panier
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
