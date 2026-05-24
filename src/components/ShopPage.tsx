'use client';

import { useState, useEffect, useMemo } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Container,
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
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  LocalShipping,
  Category as CategoryType,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import ProductCard from './ProductCard';
import { productService } from '../services/product.service';
import { homeService } from '../services/home.service';
import { Product, Category } from '../lib/types';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  primary: '#185FA5',
  dark:    '#042C53',
  light:   '#E6F1FB',
  surface: '#F5F9FE',
  border:  '#E6F1FB',
  mid:     '#85B7EB',
  muted:   '#888780',
  text:    '#5F5E5A',
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────
interface ShopPageProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  userType: 'retail' | 'wholesale';
  initialCategory?: string;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
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

  const [products,           setProducts]           = useState<Product[]>([]);
  const [categories,         setCategories]         = useState<Category[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange,         setPriceRange]         = useState<number[]>([0, 150000]);
  const [sortBy,             setSortBy]             = useState<string>('popular');
  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [mounted,            setMounted]            = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          homeService.getActiveCategories(),
          productService.getProducts({ limit: 100 }),
        ]);
        setCategories(cats.error ? [] : cats.data || []);
        setProducts(prods.error ? [] : prods.data?.items || []);
      } catch (err) {
        console.error('Error fetching shop data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mounted]);

  useEffect(() => {
    if (initialCategory) setSelectedCategories([initialCategory]);
  }, [initialCategory]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 150000]);
  };

  const activeFiltersCount = selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 150000 ? 1 : 0);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    return products.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category_id.toString())) return false;
      const price = userType === 'wholesale' && p.wholesale_price ? p.wholesale_price : p.price;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [products, selectedCategories, priceRange, userType]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const pa = userType === 'wholesale' && a.wholesale_price ? a.wholesale_price : a.price;
      const pb = userType === 'wholesale' && b.wholesale_price ? b.wholesale_price : b.price;
      if (sortBy === 'price-asc')  return pa - pb;
      if (sortBy === 'price-desc') return pb - pa;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [filteredProducts, sortBy, userType]);

  // ── Sidebar filtre ────────────────────────────────────────────────────────
  const FilterSidebar = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header sidebar */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${C.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon sx={{ fontSize: 17, color: C.primary }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark }}>
              Filtres
            </Typography>
            {activeFiltersCount > 0 && (
              <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: C.primary, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeFiltersCount}
              </Box>
            )}
          </Box>
          {activeFiltersCount > 0 && (
            <Typography
              onClick={resetFilters}
              sx={{ fontSize: 12, color: C.primary, cursor: 'pointer', fontWeight: 500, '&:hover': { color: C.dark } }}
            >
              Réinitialiser
            </Typography>
          )}
        </Box>
      </Box>

      {/* Filtres body */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>

        {/* Catégories */}
        <Box sx={{ mb: 3.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.8px', textTransform: 'uppercase', mb: 2 }}>
            Catégories
          </Typography>
          <Stack spacing={0.25}>
            {categories.slice(0, 8).map((cat) => {
              const active = selectedCategories.includes(cat.id);
              return (
                <Box
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.25,
                    py: 0.875,
                    borderRadius: '7px',
                    cursor: 'pointer',
                    bgcolor: active ? C.light : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: active ? C.light : C.surface },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16, height: 16,
                        borderRadius: '4px',
                        border: `1.5px solid ${active ? C.primary : C.border}`,
                        bgcolor: active ? C.primary : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.15s',
                      }}
                    >
                      {active && (
                        <Box component="span" sx={{ color: '#fff', fontSize: 10, lineHeight: 1, fontWeight: 700 }}>✓</Box>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 13, color: active ? C.primary : C.text, fontWeight: active ? 600 : 400 }}>
                      {cat.name}
                    </Typography>
                  </Box>
                  {cat.product_count !== undefined && (
                    <Typography sx={{ fontSize: 11, color: C.muted }}>{cat.product_count}</Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: C.border, mb: 3 }} />

        {/* Prix */}
        <Box>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.8px', textTransform: 'uppercase', mb: 2 }}>
            Prix (F CFA)
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ border: `1px solid ${C.border}`, borderRadius: '7px', px: 1.25, py: 0.5, minWidth: 80, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 10, color: C.muted }}>Min</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{priceRange[0].toLocaleString('fr-FR')}</Typography>
            </Box>
            <Box sx={{ border: `1px solid ${C.border}`, borderRadius: '7px', px: 1.25, py: 0.5, minWidth: 80, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 10, color: C.muted }}>Max</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{priceRange[1].toLocaleString('fr-FR')}</Typography>
            </Box>
          </Box>
          <Slider
            min={0}
            max={150000}
            step={5000}
            value={priceRange}
            onChange={(_: Event, v: number | number[]) => setPriceRange(v as number[])}
            sx={{
              color: C.primary,
              '& .MuiSlider-thumb': { width: 16, height: 16, border: `2px solid ${C.primary}`, bgcolor: '#fff', '&:hover': { boxShadow: `0 0 0 6px rgba(24,95,165,0.12)` } },
              '& .MuiSlider-track': { height: 3 },
              '& .MuiSlider-rail': { height: 3, bgcolor: C.border },
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  // ── Loading initial ────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: C.primary }} />
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', minHeight: '100vh' }}>

      {/* ── Barre haut de page ── */}
      <Box sx={{ borderBottom: `1px solid ${C.border}`, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Titre + compteur */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography
                component="h1"
                sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}
              >
                Boutique
              </Typography>
              {!loading && (
                <Typography sx={{ fontSize: 13, color: C.muted }}>
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
                </Typography>
              )}
            </Box>

            {/* Droite : filtre mobile + tri */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Bouton filtre mobile */}
              <Button
                onClick={() => setMobileOpen(true)}
                startIcon={<FilterIcon sx={{ fontSize: 16 }} />}
                sx={{
                  display: { lg: 'none' },
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  color: C.text,
                  fontSize: 13,
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.75,
                  '&:hover': { bgcolor: C.surface, borderColor: C.mid },
                }}
              >
                Filtres
                {activeFiltersCount > 0 && (
                  <Box sx={{ ml: 0.75, width: 18, height: 18, borderRadius: '50%', bgcolor: C.primary, color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeFiltersCount}
                  </Box>
                )}
              </Button>

              {/* Sélecteur tri */}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={sortBy}
                  onChange={(e: SelectChangeEvent) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{
                    fontSize: 13,
                    borderRadius: '8px',
                    color: C.text,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: C.border },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.mid },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: C.primary },
                  }}
                >
                  <MenuItem value="popular"    sx={{ fontSize: 13 }}>Populaires</MenuItem>
                  <MenuItem value="price-asc"  sx={{ fontSize: 13 }}>Prix croissant</MenuItem>
                  <MenuItem value="price-desc" sx={{ fontSize: 13 }}>Prix décroissant</MenuItem>
                  <MenuItem value="name"       sx={{ fontSize: 13 }}>Nom A–Z</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {/* Chips filtres actifs */}
          {activeFiltersCount > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, pb: 1.5, flexWrap: 'wrap' }}>
              {selectedCategories.map((id) => {
                const cat = categories.find((c) => c.id === id);
                return cat ? (
                  <Chip
                    key={id}
                    label={cat.name}
                    size="small"
                    onDelete={() => toggleCategory(id)}
                    sx={{ bgcolor: C.light, color: C.primary, fontWeight: 500, fontSize: 12, height: 24, '& .MuiChip-deleteIcon': { color: C.mid, fontSize: 14 } }}
                  />
                ) : null;
              })}
              {(priceRange[0] > 0 || priceRange[1] < 150000) && (
                <Chip
                  label={`${priceRange[0].toLocaleString('fr-FR')} – ${priceRange[1].toLocaleString('fr-FR')} F CFA`}
                  size="small"
                  onDelete={() => setPriceRange([0, 150000])}
                  sx={{ bgcolor: C.light, color: C.primary, fontWeight: 500, fontSize: 12, height: 24, '& .MuiChip-deleteIcon': { color: C.mid, fontSize: 14 } }}
                />
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Layout sidebar + grille ── */}
      <Box sx={{ display: 'flex', width: '100%' }}>

        {/* Sidebar desktop */}
        {isDesktop && (
          <Box
            sx={{
              width: 260,
              flexShrink: 0,
              position: 'sticky',
              top: 64,
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
              borderRight: `1px solid ${C.border}`,
              bgcolor: '#fff',
            }}
          >
            <FilterSidebar />
          </Box>
        )}

        {/* Grille produits */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: C.surface,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
              <CircularProgress sx={{ color: C.primary }} />
            </Box>
          ) : sortedProducts.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                },
                gap: { xs: 2, md: 2.5 },
              }}
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewProduct}
                  userType={userType}
                  isFavorite={favorites.includes(product.id.toString())}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </Box>
          ) : (
            /* État vide */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 64, height: 64,
                  borderRadius: '16px',
                  bgcolor: C.light,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <SearchIcon sx={{ fontSize: 28, color: C.primary }} />
              </Box>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: C.dark }}>
                Aucun produit trouvé
              </Typography>
              <Typography sx={{ fontSize: 13, color: C.muted, textAlign: 'center', maxWidth: 300 }}>
                Essayez de modifier ou réinitialiser vos filtres pour voir plus de produits.
              </Typography>
              <Button
                variant="outlined"
                onClick={resetFilters}
                sx={{
                  borderColor: C.border, color: C.primary, borderRadius: '8px',
                  textTransform: 'none', fontWeight: 500, fontSize: 13,
                  '&:hover': { bgcolor: C.surface, borderColor: C.mid },
                }}
              >
                Réinitialiser les filtres
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Drawer filtres mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            border: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: `1px solid ${C.border}` }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Filtres</Typography>
          <IconButton
            size="small"
            onClick={() => setMobileOpen(false)}
            sx={{ border: `1px solid ${C.border}`, borderRadius: '7px', width: 30, height: 30 }}
          >
            <CloseIcon sx={{ fontSize: 15, color: C.text }} />
          </IconButton>
        </Box>
        <FilterSidebar />
      </Drawer>
    </Box>
  );
}