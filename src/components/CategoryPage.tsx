'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
    CircularProgress,
    Alert,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from './common/LoadingSpinner';
import type { Product } from '../lib/types';

interface CategoryPageProps {
    onAddToCart: (product: Product) => void;
    onViewProduct: (product: Product) => void;
    userType: 'retail' | 'wholesale';
    favorites: string[];
    onToggleFavorite: (productId: string) => void;
    products: Product[]; // Les produits seront passés en paramètre depuis le parent
}

export function CategoryPage({
    onAddToCart,
    onViewProduct,
    userType,
    favorites,
    onToggleFavorite,
    products,
}: CategoryPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('slug');
    const theme = useTheme();
    const [sortBy, setSortBy] = useState<string>('popular');
    const { categories, loading: categoriesLoading, error: categoriesError, getCategoryBySlug } = useCategories();
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!categorySlug) return;
        
        const loadCategory = async () => {
            try {
                setLoading(true);
                const category = await getCategoryBySlug(categorySlug);
                setCurrentCategory(category);
                setError(null);
            } catch (err) {
                setError('Erreur lors du chargement de la catégorie');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [categorySlug, getCategoryBySlug]);

    // Si on est en train de charger les catégories ou la catégorie courante
    if (categoriesLoading || loading) {
        return <LoadingSpinner />;
    }

    // En cas d'erreur
    if (categoriesError || error) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {categoriesError || error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ChevronLeft />}
                    onClick={() => router.back()}
                >
                    Retour
                </Button>
            </Container>
        );
    }

    // Si la catégorie n'est pas trouvée
    if (!currentCategory) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Catégorie non trouvée
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ChevronLeft />}
                    onClick={() => router.back()}
                >
                    Retour
                </Button>
            </Container>
        );
    }

    // Filtrer les produits par catégorie (en utilisant l'ID de la catégorie)
    const categoryProducts = products.filter(
        (product) => product.category === currentCategory.id.toString()
    );

    // Trier les produits
    const filteredProducts = [...categoryProducts].sort((a, b) => {
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
                        onClick={() => router.back()}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        Boutique
                    </Link>
                    <Typography variant="body2" color="text.primary">
                        {currentCategory?.name || 'Catégorie'}
                    </Typography>
                </Breadcrumbs>

                {/* Header Section */}
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} mb={3} gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ChevronLeft />}
                        onClick={() => router.back()}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Retour
                    </Button>
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" component="h1" fontWeight={700}>
                            {currentCategory?.name || 'Catégorie'}
                        </Typography>
                        {currentCategory?.description && (
                            <Typography variant="body1" color="text.secondary">
                                {currentCategory.description}
                            </Typography>
                        )}
                    </Box>
                    
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
                                        onViewDetails={() => onViewProduct(product)}
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
                                    onClick={() => router.back()}
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
