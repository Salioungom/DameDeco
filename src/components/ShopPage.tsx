'use client';

import { useState, useEffect } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Drawer,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FilterList as Filter, Close as X } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { Product, products, categories } from '../lib/data';

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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 150000]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      const price = userType === 'wholesale' ? product.wholesalePrice : product.price;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
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

  const FilterContent = () => (
    <Box sx={{ p: 2 }}>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Catégories
        </Typography>
        <Stack spacing={1}>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
              }
              label={category.name}
            />
          ))}
        </Stack>
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Prix (FCFA)
        </Typography>
        <Box px={1}>
          {isMounted && (
            <Slider
              min={0}
              max={150000}
              step={5000}
              value={priceRange}
              onChange={(_: React.SyntheticEvent, value: number | number[]) => setPriceRange(value as number[])}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
          )}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {priceRange[0].toLocaleString('fr-FR')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {priceRange[1].toLocaleString('fr-FR')}
            </Typography>
          </Box>
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
