'use client';

import { useState, useEffect, useMemo } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  Slider,
  Drawer,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { FilterList as Filter, Close as X, LocalShipping, Category as CategoryType } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { productService } from '../services/product.service';
import { homeService } from '../services/home.service';
import { Product, Category } from '../lib/types';

interface ShopPageProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  userType: 'retail' | 'wholesale';
  initialCategory?: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export function ShopPage({
  onAddToCart,
  onViewProduct,
  userType,
  initialCategory,
  favorites,
  onToggleFavorite,
}: ShopPageProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 150000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Éviter les problèmes d'hydratation en initialisant les états
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    setIsMounted(true);
    // Fetch Data
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          homeService.getActiveCategories(),
          productService.getProducts({ limit: 100 }) // Réduire la limite pour éviter les erreurs
        ]);
        
        // Gérer le format de retour { data, error }
        if (cats.error) {
          console.error('Error fetching categories:', cats.error.message || cats.error);
          setCategories([]);
        } else {
          setCategories(cats.data || []);
        }
        
        if (prods.error) {
          console.error('Error fetching products:', prods.error.message || prods.error);
          setProducts([]);
        } else {
          setProducts(prods.data?.items || []);
        }
      } catch (error) {
        console.error("Error fetching shop data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    return () => setIsMounted(false);
  }, [mounted]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      return newCategories;
    });
  };

  // Simplifier le filtrage pour éviter les re-rendus fréquents
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products.filter((product) => {
      // Filter by Category
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category_id.toString())) {
          return false;
        }
      }
      
      // Filter by Price
      const productPrice = userType === 'wholesale' && product.wholesale_price 
        ? product.wholesale_price 
        : product.price;
      
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [products, selectedCategories, priceRange, userType]);

  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    return filteredProducts.sort((a: Product, b: Product) => {
      if (sortBy === 'price-asc') {
        const priceA = userType === 'wholesale' && a.wholesale_price ? a.wholesale_price : a.price;
        const priceB = userType === 'wholesale' && b.wholesale_price ? b.wholesale_price : b.price;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = userType === 'wholesale' && a.wholesale_price ? a.wholesale_price : a.price;
        const priceB = userType === 'wholesale' && b.wholesale_price ? b.wholesale_price : b.price;
        return priceB - priceA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'popular') {
        // Use is_featured or similar
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
      return 0;
    });
  }, [filteredProducts, sortBy, userType]);

  const FilterContent = () => {
    return (
        <Box sx={{ p: 2 }}>
            <Box mb={4}>
                <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <CategoryType sx={{ fontSize: 20, color: 'primary.main' }} />
                    Catégories
                </Typography>
                <Stack spacing={1}>
                    {Array.isArray(categories) && categories.slice(0, 5).map((category) => (
                        <FormControlLabel
                            key={category.id}
                            control={
                                <Checkbox
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                    size="small"
                                />
                            }
                            label={category.name}
                            sx={{ fontSize: '0.875rem' }}
                        />
                    ))}
                </Stack>
            </Box>
            
            <Box mb={4}>
                <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <LocalShipping sx={{ fontSize: 20, color: 'primary.main' }} />
                    Prix (FCFA)
                </Typography>
                <Box px={1}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Prix: {priceRange[0].toLocaleString('fr-FR')} - {priceRange[1].toLocaleString('fr-FR')}
                    </Typography>
                    <Slider
                        min={0}
                        max={150000}
                        step={10000} // Step plus grand = moins d'événements
                        value={priceRange}
                        onChange={(_: Event, value: number | number[]) => setPriceRange(value as number[])}
                        valueLabelDisplay="auto"
                        sx={{ width: '100%' }}
                    />
                </Box>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                startIcon={<X />}
                onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 150000]);
                }}
            >
                Annuler le filtre
            </Button>
        </Box>
    );
};

  // Si le composant n'est pas encore monté, afficher un état de chargement
  if (!mounted) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ flexGrow: 1 }}>
              Boutique
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={700} sx={{ flexGrow: 1 }}>
            Boutique
          </Typography>
          {!isDesktop && (
            <Button
              variant="outlined"
              startIcon={<Filter />}
              onClick={() => setMobileOpen(true)}
              sx={{ display: { lg: 'none' } }}
            >
              Filtres
            </Button>
          )}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200, ml: 2 }}>
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
      </Container>

      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          {/* Filtre fixe à gauche */}
          {isDesktop && (
            <Box
              sx={{
                width: '280px',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                borderRight: `1px solid ${theme.palette.divider}`,
                p: 3,
                bgcolor: 'background.paper',
                zIndex: 1
              }}
            >
              <FilterContent />
            </Box>
          )}

          {/* Contenu principal avec défilement */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              overflowX: 'hidden',
              p: { xs: 2, sm: 3, md: 4 },
              width: isDesktop ? 'calc(100% - 280px)' : '100%',
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
              </Box>
            ) : (
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
                {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? (
  sortedProducts.map((product) => (
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
        {mounted ? (
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewProduct}
            userType={userType}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: 300, 
            bgcolor: 'grey.100',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Grid>
  ))
) : (
  <Grid item xs={12}>
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h6" color="text.secondary">
        Aucun produit trouvé avec ces critères
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 150000]);
        }}
        sx={{ mt: 2 }}
      >
        Réinitialiser les filtres
      </Button>
    </Box>
  </Grid>
)}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: 400,
            boxSizing: 'border-box',
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filtres</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <X />
            </IconButton>
          </Box>
          <FilterContent />
        </Box>
      </Drawer>
    </Box>
  );
}
