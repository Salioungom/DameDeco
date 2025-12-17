'use client';

import { useState, useEffect } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
    Breadcrumbs,
    Link,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { Product, products, categories } from '../lib/data';

interface CategoryPageProps {
    categoryId: string;
    onBack: () => void;
    onAddToCart: (product: Product) => void;
    onViewProduct: (product: Product) => void;
    userType: 'retail' | 'wholesale';
    favorites: string[];
    onToggleFavorite: (productId: string) => void;
}

export function CategoryPage({
    categoryId,
    onBack,
    onAddToCart,
    onViewProduct,
    userType,
    favorites,
    onToggleFavorite,
}: CategoryPageProps) {
    const theme = useTheme();
    const [sortBy, setSortBy] = useState<string>('popular');

    const category = categories.find((cat) => cat.id === categoryId);
    const categoryProducts = products.filter(
        (product) => product.category === categoryId
    );

    const filteredProducts = categoryProducts.sort((a, b) => {
        if (sortBy === 'price-asc') {
            const priceA = userType === 'wholesale' ? a.wholesalePrice : a.price;
            const priceB = userType === 'wholesale' ? b.wholesalePrice : b.price;
            return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
            const priceA = userType === 'wholesale' ? a.wholesalePrice : a.price;
            const priceB = userType === 'wholesale' ? b.wholesalePrice : b.price;
            return priceB - priceA;
        }
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'popular') {
            return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        }
        return 0;
    });

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Breadcrumb Navigation */}
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={onBack}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        Boutique
                    </Link>
                    <Typography variant="body2" color="text.primary">
                        {category?.name || 'Catégorie'}
                    </Typography>
                </Breadcrumbs>

                {/* Header Section */}
                <Box display="flex" alignItems="center" mb={3}>
                    <Button
                        variant="outlined"
                        startIcon={<ChevronLeft />}
                        onClick={onBack}
                        sx={{ mr: 2 }}
                    >
                        Retour
                    </Button>
                    <Typography variant="h4" component="h1" fontWeight={700} sx={{ flexGrow: 1 }}>
                        {category?.name || 'Catégorie'}
                    </Typography>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="sort-by-label">Trier par</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            value={sortBy}
                            onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as string)}
                            label="Trier par"
                        >
                            <MenuItem value="popular">Populaires</MenuItem>
                            <MenuItem value="price-asc">Prix croissant</MenuItem>
                            <MenuItem value="price-desc">Prix décroissant</MenuItem>
                            <MenuItem value="name">Nom (A-Z)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Products Grid */}
                <Grid
                    container
                    spacing={{ xs: 2, sm: 3, md: 4 }}
                    sx={{
                        '& .MuiGrid-item': {
                            display: 'flex',
                            justifyContent: 'center',
                        }
                    }}
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Grid
                                item
                                key={product.id}
                                xs={12}
                                sm={6}
                                md={6}
                                lg={4}
                                xl={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box sx={{ width: '100%', maxWidth: 400 }}>
                                    <ProductCard
                                        product={product}
                                        onAddToCart={onAddToCart}
                                        onViewDetails={onViewProduct}
                                        userType={userType}
                                        isFavorite={favorites.includes(product.id)}
                                        onToggleFavorite={onToggleFavorite}
                                    />
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Aucun produit trouvé dans cette catégorie
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={onBack}
                                    sx={{ mt: 2 }}
                                >
                                    Retour à la boutique
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}
