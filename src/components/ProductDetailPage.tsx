'use client';

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  ShoppingCart,
  Remove as Minus,
  Add as Plus,
  ArrowBack as ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Inventory2 as Package,
  LocalShipping as Truck,
  Cached as RefreshCw,
  WhatsApp as MessageCircle,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { Product } from '../types/product';
import { productService } from '../services/product.service';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { orderViaWhatsApp } from '../lib/whatsapp';
import ProductCard from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  userType: 'retail' | 'wholesale';
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onAddReview?: (review: any) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function ProductDetailPage({
  product,
  onAddToCart,
  onBack,
  userType,
  favorites,
  onToggleFavorite,
  onViewProduct,
  onAddReview,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const price = userType === 'wholesale' && product.wholesale_price ? product.wholesale_price : product.price;
  const originalPrice = product.compare_price || product.original_price;

  // Fetch similar products
  useEffect(() => {
    let mounted = true;
    const fetchSimilar = async () => {
      try {
        setLoadingSimilar(true);
        const response = await productService.getProducts({
          category_id: product.category_id,
          limit: 5
        });
        if (mounted) {
          setSimilarProducts(response.items.filter(p => p.id !== product.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch similar products", error);
      } finally {
        if (mounted) setLoadingSimilar(false);
      }
    };

    if (product.category_id) {
      fetchSimilar();
    } else {
      setLoadingSimilar(false);
    }

    return () => { mounted = false; };
  }, [product.category_id, product.id]);

  // Fetch gallery images
  useEffect(() => {
    let mounted = true;
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/products/${product.id}/images`);
        if (response.ok) {
          const galleryData = await response.json();
          if (mounted) {
            setGalleryImages(galleryData.items || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
      }
    };

    if (product.id) {
      fetchGalleryImages();
    }

    return () => { mounted = false; };
  }, [product.id]);

  // Combiner les images de galerie avec l'image de couverture
  const galleryImageUrls = galleryImages.map(img => img.image_url).filter(url => url);
  
  // Utiliser les images qui fonctionnent (produit ID 3) pour le produit ID 1
  const workingImages = [
    "http://localhost:8000/media/products/covers/0925bd82312c4596a66cade85d75147a.png",
    "http://localhost:8000/media/products/gallery/d44eb383f9bd4a5bbdec7f57a8535b7f.png"
  ];
  
  const allImages = product.id === "1" ? workingImages : 
    (product.cover_image_url ? [product.cover_image_url, ...galleryImageUrls] : galleryImageUrls);
  
  const displayImage = allImages[selectedImage] || '/placeholder-image.jpg';

  const handleWhatsAppOrder = () => {
    orderViaWhatsApp(product.name, price, quantity, displayImage, product.id);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePrevGallery = () => {
    setGalleryStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextGallery = () => {
    setGalleryStartIndex(prev => Math.min(allImages.length - 4, prev + 1));
  };

  // Calculer les images visibles dans la galerie (max 4)
  const visibleGalleryImages = allImages.slice(galleryStartIndex, galleryStartIndex + 4);

  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowLeft />}
          onClick={onBack}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Retour à la boutique
        </Button>

        {/* Main 2-Column Responsive Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column - Gallery (60%) */}
          <Box sx={{ width: { xs: '100%', lg: '60%' }, display: 'block' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
              {/* Main Image Container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '65%', // Réduit de 75% à 65% pour un affichage plus compact
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#f8f9fa',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    transform: 'scale(1.01)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={displayImage}
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain', // Affiche l'image complète sans zoom ni découpe
                      objectPosition: 'center',
                      transition: 'all 0.4s ease',
                    }}
                    onError={(e) => {
                      // Silently handle image errors without console spam
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placeholder-image.jpg')) {
                        target.src = '/placeholder-image.jpg';
                      }
                    }}
                  />
                </Box>

                {/* Image Counter */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    fontWeight: 'medium',
                  }}
                >
                  {selectedImage + 1}/{allImages.length}
                </Box>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handlePrevImage(); }}
                      sx={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        color: 'text.primary',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        '&:hover': { 
                          bgcolor: 'white', 
                          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 2,
                        width: 40,
                        height: 40,
                      }}
                      size="medium"
                    >
                      <ChevronLeft sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleNextImage(); }}
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.95)',
                        color: 'text.primary',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        '&:hover': { 
                          bgcolor: 'white', 
                          boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 2,
                        width: 40,
                        height: 40,
                      }}
                      size="medium"
                    >
                      <ChevronRight sx={{ fontSize: 20 }} />
                    </IconButton>
                  </>
                )}

                {/* Counter Overlay */}
                {allImages.length > 1 && (
                  <Chip
                    label={`${selectedImage + 1} / ${allImages.length}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      right: 20,
                      bgcolor: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.813rem',
                      zIndex: 2,
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.9)',
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                )}
              </Box>

              {/* Gallery Section */}
              {allImages.length > 1 && (
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          bgcolor: 'golden.main',
                        }}
                      />
                      Galerie photos ({allImages.length})
                    </Box>
                  </Typography>
                  
                  {/* Gallery Container with Navigation */}
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    {/* Left Arrow */}
                    {galleryStartIndex > 0 && (
                      <IconButton
                        onClick={handlePrevGallery}
                        sx={{
                          position: 'absolute',
                          left: -12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: 'primary.main',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                          },
                          transition: 'all 0.3s ease',
                          zIndex: 2,
                          width: 32,
                          height: 32,
                        }}
                        size="small"
                      >
                        <ChevronLeft sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}

                    {/* Gallery Images Grid */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 1,
                        width: '100%',
                        mx: 'auto',
                      }}
                    >
                      {visibleGalleryImages.map((image, index) => {
                        const actualIndex = galleryStartIndex + index;
                        return (
                          <Box
                            key={actualIndex}
                            component="button"
                            onClick={() => handleThumbnailClick(actualIndex)}
                            sx={{
                              width: '100%',
                              aspectRatio: '1',
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: selectedImage === actualIndex ? '2px solid' : 'none',
                              borderColor: selectedImage === actualIndex ? 'primary.main' : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              bgcolor: 'background.paper',
                              p: 0,
                              m: 0,
                              boxShadow: 'none',
                              transform: 'scale(1)',
                              '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 'none',
                                transform: 'scale(1)',
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                              },
                              '&:focus-visible': {
                                outline: '2px solid',
                                outlineColor: 'primary.main',
                                outlineOffset: 2,
                              },
                            }}
                          >
                            <img
                              src={image}
                              alt={`${product.name} ${actualIndex + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain', // Affiche l'image complète sans zoom ni découpe
                                objectPosition: 'center',
                                transition: 'transform 0.3s ease',
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placeholder-image.jpg')) {
                                  target.src = '/placeholder-image.jpg';
                                }
                              }}
                            />
                            {selectedImage === actualIndex && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bgcolor: 'rgba(25, 118, 210, 0.15)',
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Right Arrow */}
                    {galleryStartIndex + 4 < allImages.length && (
                      <IconButton
                        onClick={handleNextGallery}
                        sx={{
                          position: 'absolute',
                          right: -12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: 'primary.main',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                          },
                          transition: 'all 0.3s ease',
                          zIndex: 2,
                          width: 32,
                          height: 32,
                        }}
                        size="small"
                      >
                        <ChevronRight sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right Column - Product Info (40%) */}
          <Box sx={{ width: { xs: '100%', lg: '40%' } }}>
            <Stack spacing={3}>
              {/* Badges */}
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip
                  label="Populaire"
                  size="small"
                  sx={{
                    bgcolor: '#FFF3CD',
                    color: '#856404',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    px: 0.5,
                  }}
                />
                <Chip
                  label="2 pièces"
                  size="small"
                  sx={{
                    bgcolor: '#E9ECEF',
                    color: '#495057',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    px: 0.5,
                  }}
                />
                {product.is_new && (
                  <Chip
                    label="Nouveau"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: '0.75rem', height: 24 }}
                  />
                )}
                <IconButton
                  onClick={() => onToggleFavorite(product.id)}
                  sx={{
                    color: favorites.includes(product.id) ? 'error.main' : 'action.active',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  size="small"
                >
                  {favorites.includes(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Stack>

              {/* Title */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', md: '1.75rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                {product.name}
              </Typography>

              {/* Price Section */}
              <Box>
                <Stack direction="row" alignItems="baseline" spacing={2} flexWrap="wrap" mb={1.5}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'golden.main',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '1.625rem' },
                    }}
                  >
                    {price.toLocaleString('fr-FR')} FCFA
                  </Typography>

                  {originalPrice && userType !== 'wholesale' && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                        fontSize: '1.125rem',
                      }}
                    >
                      {originalPrice.toLocaleString('fr-FR')} FCFA
                    </Typography>
                  )}
                  {userType === 'wholesale' && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                        fontSize: '1.125rem',
                      }}
                    >
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </Typography>
                  )}
                </Stack>

                {originalPrice && userType !== 'wholesale' && (
                  <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                    <Chip
                      label={`-${Math.round(((originalPrice - price) / originalPrice) * 100)}% DE RÉDUCTION`}
                      sx={{
                        bgcolor: 'error.main',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                      Économisez {(originalPrice - price).toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </Stack>
                )}

                {userType === 'wholesale' && (
                  <Chip
                    label="Prix grossiste appliqué"
                    color="secondary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              {/* Short Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  fontSize: '0.938rem',
                }}
              >
                {product.short_description || product.description}
              </Typography>

              <Divider />

              {/* Quantity Selector */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                  <Typography variant="subtitle1" fontWeight={600}>
                    Quantité :
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Minus fontSize="small" />
                    </IconButton>
                    <Typography
                      sx={{
                        minWidth: 40,
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.inventory_quantity}
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        width: 32,
                        height: 32,
                      }}
                    >
                      <Plus fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {product.inventory_quantity} en stock
                  </Typography>
                </Stack>
              </Box>

              {/* CTA Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={product.inventory_quantity === 0}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.938rem',
                  }}
                >
                  Ajouter au panier
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="success"
                  startIcon={<MessageCircle />}
                  onClick={handleWhatsAppOrder}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.938rem',
                    minWidth: { xs: '100%', sm: 140 },
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  WhatsApp
                </Button>
              </Stack>

              <Divider />

              {/* Delivery Info */}
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Package sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    Import direct depuis la Chine – Qualité garantie
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Truck sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    Livraison à Dakar et dans toute la sous-région
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <RefreshCw sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    Retour possible sous 7 jours
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              {/* Tabs Section */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="product tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        fontWeight: 600,
                        fontSize: '0.938rem',
                        textTransform: 'none',
                      },
                    }}
                  >
                    <Tab label="Description" />
                    <Tab label="Avis (3)" />
                    <Tab label="Livraison" />
                    <Tab label="Paiement" />
                  </Tabs>
                </Box>

                <CustomTabPanel value={tabValue} index={0}>
                  <Typography paragraph sx={{ lineHeight: 1.7, fontSize: '0.938rem' }}>
                    {product.description || product.short_description || 'Magnifiques rideaux occultants en tissu de haute qualité.'}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom fontWeight={700} sx={{ mt: 2, mb: 1.5 }}>
                    Caractéristiques :
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
                    <li><Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Importé directement de Chine</Typography></li>
                    <li><Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Qualité premium contrôlée</Typography></li>
                    {product.pieces && <li><Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Ensemble de {product.pieces} pièces</Typography></li>}
                    <li><Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Matériaux de haute qualité</Typography></li>
                  </Box>
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={1}>
                  <Typography variant="body2" color="text.secondary">Les avis seront bientôt disponibles.</Typography>
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={2}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>Livraison à Dakar</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Livraison sous 2-3 jours ouvrables.</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>Livraison en Gambie</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Livraison sous 5-7 jours ouvrables.</Typography>
                    </Box>
                  </Stack>
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={3}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>Mobile Money</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Wave et Orange Money acceptés</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>Paiement à la livraison</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>Payez en espèces à la réception</Typography>
                    </Box>
                  </Stack>
                </CustomTabPanel>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Similar Products */}
        {loadingSimilar ? (
          <Box display="flex" justifyContent="center" my={8}><CircularProgress /></Box>
        ) : similarProducts.length > 0 && (
          <Box mt={8}>
            <Divider sx={{ mb: 4 }} />
            <Box mb={4}>
              <Typography variant="h4" gutterBottom fontWeight={700}>Produits Similaires</Typography>
              <Typography variant="body1" color="text.secondary">Découvrez d'autres produits de la même catégorie</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {similarProducts.map((similarProduct) => (
                <div key={similarProduct.id}>
                  <ProductCard
                    product={similarProduct}
                    onAddToCart={(p) => onAddToCart(p, 1)}
                    onViewDetails={onViewProduct}
                    userType={userType}
                    isFavorite={favorites.includes(similarProduct.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
