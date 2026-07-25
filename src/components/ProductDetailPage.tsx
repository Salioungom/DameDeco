'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  Stack,
  IconButton,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Skeleton,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  Remove as Minus,
  Add as Plus,
  ChevronLeft,
  ChevronRight,
  LocalShipping as Truck,
  Cached as RefreshCw,
  WhatsApp as MessageCircle,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  NavigateNext,
  VerifiedUser,
} from '@mui/icons-material';
import { Product } from '../types/product';
import { productService } from '../services/product.service';
import { ProductImage } from './ProductImage';
import { orderViaWhatsApp } from '../lib/whatsapp';
import { toast } from 'sonner';
import ProductCard from './ProductCard';
import { PaymentIcons } from './PaymentIcons';

const C = {
  primary: '#185FA5',
  dark: '#042C53',
  light: '#E6F1FB',
  surface: '#F8FAFC',
  border: '#D4E6F7',
  mid: '#85B7EB',
  muted: '#64748B',
  text: '#5F5E5A',
  gold: '#C6A75E',
} as const;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  userType: 'retail' | 'wholesale';
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onAddReview?: (review: unknown) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const navBtnSx = {
  position: 'absolute' as const,
  top: '50%',
  transform: 'translateY(-50%)',
  bgcolor: alpha('#fff', 0.95),
  color: C.dark,
  border: `1px solid ${C.border}`,
  boxShadow: '0 4px 16px rgba(4,44,83,0.1)',
  width: 55,
  height: 55,
  zIndex: 2,
  '&:hover': { bgcolor: '#fff', transform: 'translateY(-50%) scale(1.05)' },
};

export function ProductDetailPage({
  product,
  onAddToCart,
  onBack: _onBack,
  userType,
  favorites,
  onToggleFavorite,
  onViewProduct,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [galleryImages, setGalleryImages] = useState<{ image_url: string }[]>([]);

  const price = userType === 'wholesale' && product.wholesale_price ? product.wholesale_price : product.price;
  const originalPrice = product.compare_price || product.original_price;

  useEffect(() => {
    let mounted = true;
    const fetchSimilar = async () => {
      try {
        setLoadingSimilar(true);
        const response = await productService.getProducts({
          category_id: product.category_id,
          limit: 5,
        });
        if (mounted) {
          if (response.error) {
            setSimilarProducts([]);
          } else {
            const items = response.data?.items || [];
            setSimilarProducts(items.filter((p) => p.id !== product.id).slice(0, 4));
          }
        }
      } catch {
        if (mounted) setSimilarProducts([]);
      } finally {
        if (mounted) setLoadingSimilar(false);
      }
    };

    if (product.category_id) fetchSimilar();
    else setLoadingSimilar(false);
    return () => { mounted = false; };
  }, [product.category_id, product.id]);

  useEffect(() => {
    let mounted = true;
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products/${product.id}/images`);
        if (response.ok) {
          const galleryData = await response.json();
          if (mounted) setGalleryImages(galleryData.items || []);
        }
      } catch {
        /* galerie optionnelle */
      }
    };
    if (product.id) fetchGalleryImages();
    return () => { mounted = false; };
  }, [product.id]);

  const galleryImageUrls = (galleryImages || []).map((img) => img.image_url).filter(Boolean);

  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    if (cleanPath.startsWith('/media/')) return `${API_BASE_URL}${cleanPath}`;
    return `${API_BASE_URL}/media${cleanPath}`;
  };

  const allImages = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const push = (raw?: string) => {
      const full = getFullImageUrl(raw || '');
      if (full && !seen.has(full)) {
        seen.add(full);
        list.push(full);
      }
    };
    push(product.cover_image_url);
    galleryImageUrls.forEach(push);
    return list;
  }, [product.cover_image_url, galleryImageUrls]);

  const displayImage = allImages[selectedImage] || '/placeholder-image.jpg';
  const productIdStr = String(product.id);
  const isFavorite = favorites.includes(productIdStr);
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
  const reviewCount = product.review_count ?? 0;
  const inStock = product.inventory_quantity > 0;

  const handleWhatsAppOrder = () => {
    toast.info('Cette fonctionnalité sera disponible bientôt');
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const trustPoints = [
    { icon: VerifiedUser, text: 'Import direct depuis la Chine — qualité garantie' },
    { icon: Truck, text: 'Livraison express Dakar & tout le Sénégal' },
    { icon: RefreshCw, text: 'Retour possible sous 7 jours' },
  ];

  const Thumbnail = ({ src, index }: { src: string; index: number }) => (
    <Box
      component="button"
      type="button"
      onClick={() => setSelectedImage(index)}
      aria-label={`Image ${index + 1}`}
      sx={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '15px',
        overflow: 'hidden',
        border: selectedImage === index ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
        bgcolor: '#fff',
        p: 0,
        cursor: 'pointer',
        opacity: selectedImage === index ? 1 : 0.75,
        transition: 'all 0.2s ease',
        boxShadow: selectedImage === index ? `0 4px 16px ${alpha(C.primary, 0.2)}` : 'none',
        '&:hover': { opacity: 1, borderColor: C.primary },
      }}
    >
      <ProductImage
        src={src}
        alt={`${product.name} ${index + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: C.surface, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
        <Breadcrumbs
          separator={<NavigateNext sx={{ fontSize: 20, color: C.muted }} />}
          sx={{ mb: { xs: 3, md: 4 }, '& .MuiBreadcrumbs-li': { fontSize: 16.25 } }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: C.muted, fontWeight: 500 }}>Accueil</Link>
          <Link href="/shop" style={{ textDecoration: 'none', color: C.muted, fontWeight: 500 }}>Boutique</Link>
          {product.category_name && (
            <Link
              href={`/shop?category=${product.category_id}`}
              style={{ textDecoration: 'none', color: C.muted, fontWeight: 500 }}
            >
              {product.category_name}
            </Link>
          )}
          <Typography sx={{ color: C.dark, fontWeight: 600, fontSize: 16.25 }} noWrap>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.15fr) minmax(340px, 0.85fr)' },
            gap: { xs: 4, lg: 5 },
            alignItems: 'start',
          }}
        >
          {/* Galerie */}
          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: allImages.length > 1 ? '76px 1fr' : '1fr',
                },
                gap: 2,
              }}
            >
              {allImages.length > 1 && (
                <Stack
                  spacing={1}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    maxHeight: 700,
                    overflowY: 'auto',
                    pr: 0.5,
                  }}
                >
                  {allImages.map((img, index) => (
                    <Thumbnail key={img} src={img} index={index} />
                  ))}
                </Stack>
              )}

              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  border: `1px solid ${C.border}`,
                  aspectRatio: { xs: '1', sm: '4/5', md: '1' },
                  maxHeight: { md: 700 },
                  boxShadow: `0 16px 48px ${alpha(C.dark, 0.08)}`,
                }}
              >
                <ProductImage
                  src={displayImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />

                {allImages.length > 1 && (
                  <>
                    <IconButton onClick={handlePrevImage} sx={{ ...navBtnSx, left: 14 }} size="small">
                      <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={handleNextImage} sx={{ ...navBtnSx, right: 14 }} size="small">
                      <ChevronRight />
                    </IconButton>
                    <Chip
                      label={`${selectedImage + 1} / ${allImages.length}`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        bgcolor: alpha(C.dark, 0.75),
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15,
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                  </>
                )}

                {!inStock && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: alpha('#fff', 0.6),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Chip label="Rupture de stock" sx={{ bgcolor: C.dark, color: '#fff', fontWeight: 700 }} />
                  </Box>
                )}
              </Paper>
            </Box>

            {allImages.length > 1 && (
              <Box
                sx={{
                  display: { xs: 'grid', md: 'none' },
                  gridTemplateColumns: `repeat(${Math.min(allImages.length, 5)}, 1fr)`,
                  gap: 1,
                  mt: 2,
                }}
              >
                {allImages.map((img, index) => (
                  <Thumbnail key={`m-${img}`} src={img} index={index} />
                ))}
              </Box>
            )}
          </Box>

          {/* Panneau achat */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: '25px',
              border: `1px solid ${C.border}`,
              bgcolor: '#fff',
              position: { lg: 'sticky' },
              top: 96,
              boxShadow: `0 12px 40px ${alpha(C.dark, 0.06)}`,
            }}
          >
            <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mb: 2 }}>
              {(product.popular || product.is_featured) && (
                <Chip
                  label="Populaire"
                  size="small"
                  sx={{ bgcolor: alpha(C.gold, 0.15), color: '#92680a', fontWeight: 700, fontSize: 13.75 }}
                />
              )}
              {product.is_new && (
                <Chip label="Nouveau" size="small" sx={{ bgcolor: C.light, color: C.primary, fontWeight: 700, fontSize: 13.75 }} />
              )}
              {product.pieces != null && product.pieces > 0 && (
                <Chip
                  label={`${product.pieces} pièce${product.pieces > 1 ? 's' : ''}`}
                  size="small"
                  sx={{ bgcolor: C.surface, color: C.muted, fontWeight: 600, fontSize: 13.75 }}
                />
              )}
              {product.category_name && (
                <Chip
                  label={product.category_name}
                  size="small"
                  component={Link}
                  href={`/shop?category=${product.category_id}`}
                  clickable
                  sx={{ bgcolor: C.surface, color: C.primary, fontWeight: 600, fontSize: 13.75 }}
                />
              )}
              <Box sx={{ flex: 1 }} />
              <IconButton
                onClick={() => onToggleFavorite(productIdStr)}
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                sx={{
                  border: `1px solid ${C.border}`,
                  borderRadius: '12.5px',
                  color: isFavorite ? '#e11d48' : C.muted,
                  bgcolor: isFavorite ? alpha('#e11d48', 0.06) : C.surface,
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Stack>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 800,
                color: C.dark,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              {product.name}
            </Typography>

            {product.average_rating && Number(product.average_rating) > 0 && (
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 2 }}>
                <StarIcon sx={{ fontSize: 22.5, color: '#fbbf24' }} />
                <Typography sx={{ fontWeight: 700, fontSize: 17.5, color: C.dark }}>
                  {Number(product.average_rating).toFixed(1)}
                </Typography>
                {reviewCount > 0 && (
                  <Typography sx={{ fontSize: 16.25, color: C.muted }}>({reviewCount} avis)</Typography>
                )}
              </Stack>
            )}

            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="baseline" spacing={1.5} flexWrap="wrap">
                <Typography sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em' }}>
                  {formatPrice(price)}
                </Typography>
                {originalPrice && originalPrice > price && (
                  <Typography sx={{ fontSize: 20, color: C.muted, textDecoration: 'line-through' }}>
                    {formatPrice(originalPrice)}
                  </Typography>
                )}
              </Stack>

              {discountPercent != null && userType !== 'wholesale' && (
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1.25 }}>
                  <Chip
                    label={`-${discountPercent}%`}
                    size="small"
                    sx={{ bgcolor: '#fef2f2', color: '#b91c1c', fontWeight: 800, fontSize: 15 }}
                  />
                  <Typography sx={{ fontSize: 16.25, color: C.muted }}>
                    Économisez {formatPrice(originalPrice! - price)}
                  </Typography>
                </Stack>
              )}

              {userType === 'wholesale' && (
                <Chip
                  label="Prix grossiste appliqué"
                  size="small"
                  sx={{ mt: 1.25, bgcolor: C.light, color: C.primary, fontWeight: 700 }}
                />
              )}
            </Box>

            {(product.short_description || product.description) && (
              <Typography sx={{ fontSize: 17.5, color: C.text, lineHeight: 1.75, mb: 3 }}>
                {product.short_description || product.description}
              </Typography>
            )}

            <Divider sx={{ borderColor: C.border, mb: 3 }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: 17.5, fontWeight: 700, color: C.dark }}>Quantité</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  size="small"
                  sx={{ border: `1px solid ${C.border}`, borderRadius: '12.5px', width: 45, height: 45 }}
                >
                  <Minus fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 55, textAlign: 'center', fontWeight: 800, fontSize: 20 }}>
                  {quantity}
                </Typography>
                <IconButton
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.inventory_quantity}
                  size="small"
                  sx={{ border: `1px solid ${C.border}`, borderRadius: '12.5px', width: 45, height: 45 }}
                >
                  <Plus fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            <Typography sx={{ fontSize: 15, color: inStock ? '#15803d' : '#b91c1c', fontWeight: 600, mb: 3 }}>
              {inStock ? `${product.inventory_quantity} en stock` : 'Produit indisponible'}
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={() => onAddToCart(product, quantity)}
                disabled={!inStock}
                sx={{
                  py: 1.5,
                  borderRadius: '15px',
                  fontWeight: 800,
                  fontSize: 18.75,
                  textTransform: 'none',
                  bgcolor: C.primary,
                  boxShadow: `0 8px 24px ${alpha(C.primary, 0.35)}`,
                  '&:hover': { bgcolor: C.dark },
                }}
              >
                Ajouter au panier
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<MessageCircle />}
                onClick={handleWhatsAppOrder}
                sx={{
                  py: 1.5,
                  borderRadius: '15px',
                  fontWeight: 700,
                  fontSize: 17.5,
                  textTransform: 'none',
                  borderColor: '#25D366',
                  color: '#15803d',
                  '&:hover': { borderColor: '#25D366', bgcolor: alpha('#25D366', 0.06) },
                }}
              >
                Commander via WhatsApp
              </Button>
            </Stack>

            <Stack spacing={1.75}>
              {trustPoints.map(({ icon: Icon, text }) => (
                <Stack key={text} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: '12.5px',
                      bgcolor: C.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 22.5, color: C.primary }} />
                  </Box>
                  <Typography sx={{ fontSize: 16.25, color: C.text, lineHeight: 1.5, pt: 0.5 }}>{text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Détails */}
        <Paper
          elevation={0}
          sx={{
            mt: { xs: 5, md: 7 },
            borderRadius: '25px',
            border: `1px solid ${C.border}`,
            bgcolor: '#fff',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_: React.SyntheticEvent, v: number) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: { xs: 1, md: 2 },
              borderBottom: `1px solid ${C.border}`,
              minHeight: 65,
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: 17.5,
                textTransform: 'none',
                color: C.muted,
                minHeight: 65,
                '&.Mui-selected': { color: C.primary },
              },
              '& .MuiTabs-indicator': { height: 3.75, borderRadius: '3.75px 3.75px 0 0', bgcolor: C.primary },
            }}
          >
            <Tab label="Description" />
            <Tab label={reviewCount > 0 ? `Avis (${reviewCount})` : 'Avis'} />
            <Tab label="Livraison" />
            <Tab label="Paiement" />
          </Tabs>

          <Box sx={{ px: { xs: 2, md: 3 } }}>
            <CustomTabPanel value={tabValue} index={0}>
              <Typography sx={{ fontSize: 18.75, color: C.text, lineHeight: 1.8, mb: 3 }}>
                {product.description || product.short_description || 'Description à venir.'}
              </Typography>
              <Typography sx={{ fontSize: 17.5, fontWeight: 800, color: C.dark, mb: 1.5 }}>Caractéristiques</Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 1 } }}>
                <Typography component="li" sx={{ fontSize: 17.5, color: C.text }}>Importé directement de Chine</Typography>
                <Typography component="li" sx={{ fontSize: 17.5, color: C.text }}>Qualité premium contrôlée</Typography>
                {product.pieces != null && product.pieces > 0 && (
                  <Typography component="li" sx={{ fontSize: 17.5, color: C.text }}>
                    Ensemble de {product.pieces} pièce{product.pieces > 1 ? 's' : ''}
                  </Typography>
                )}
                {product.sku && (
                  <Typography component="li" sx={{ fontSize: 17.5, color: C.text }}>Réf. {product.sku}</Typography>
                )}
              </Box>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
              <Typography sx={{ fontSize: 17.5, color: C.muted }}>Les avis clients seront bientôt disponibles.</Typography>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: C.dark, mb: 0.5 }}>Dakar & banlieue</Typography>
                  <Typography sx={{ fontSize: 17.5, color: C.text }}>Livraison express sous 24–48h ouvrées.</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: C.dark, mb: 0.5 }}>Reste du Sénégal</Typography>
                  <Typography sx={{ fontSize: 17.5, color: C.text }}>Expédition sous 3–5 jours ouvrés avec suivi.</Typography>
                </Box>
              </Stack>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={3}>
              <Typography sx={{ fontSize: 17.5, color: C.text, mb: 2 }}>
                Paiement sécurisé — Wave, Orange Money ou paiement à la livraison.
              </Typography>
              <PaymentIcons size="md" showLabels />
            </CustomTabPanel>
          </Box>
        </Paper>

        {/* Similaires */}
        <Box sx={{ mt: { xs: 7, md: 9 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 13.75, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.primary, mb: 1 }}>
              Vous aimerez aussi
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.85rem' }, fontWeight: 800, color: C.dark, letterSpacing: '-0.03em' }}>
              Produits similaires
            </Typography>
          </Box>

          {loadingSimilar ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" height={450} sx={{ borderRadius: '17.5px' }} />
              ))}
            </Box>
          ) : similarProducts.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  onAddToCart={(p) => onAddToCart(p, 1)}
                  onViewDetails={onViewProduct}
                  userType={userType}
                  isFavorite={favorites.includes(String(similarProduct.id))}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </Box>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}
