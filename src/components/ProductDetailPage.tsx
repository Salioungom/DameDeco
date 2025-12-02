'use client';

import { useState } from 'react';
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
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  Remove as Minus,
  Add as Plus,
  ArrowBack as ArrowLeft,
  Inventory2 as Package,
  LocalShipping as Truck,
  Cached as RefreshCw,
  WhatsApp as MessageCircle,
  Favorite as Heart,
  FavoriteBorder as HeartOutline,
} from '@mui/icons-material';
import { Product, products, Review } from '../lib/data';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { orderViaWhatsApp } from '../lib/whatsapp';
import ProductCard from './ProductCard';
import { ProductReviews } from './ProductReviews';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  userType: 'retail' | 'wholesale';
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'productId' | 'customerName' | 'customerEmail'> & { name: string; email?: string }) => void;
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
  const theme = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const price = userType === 'wholesale' ? product.wholesalePrice : product.price;

  // Trouver les produits similaires (même catégorie, excluant le produit actuel)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsAppOrder = () => {
    orderViaWhatsApp(product.name, price, quantity, product.images[selectedImage], product.id);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowLeft />}
          onClick={onBack}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Retour à la boutique
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          {/* Images */}
          <div>
            <Stack spacing={2}>
              <Box
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'action.hover',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <ImageWithFallback
                    src={product.images[selectedImage]}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                {product.images.length > 1 && (
                  <Chip
                    label={`${selectedImage + 1} / ${product.images.length}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                    }}
                  />
                )}
              </Box>

              {product.images.length > 1 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Galerie photos ({product.images.length})
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 1 
                  }}>
                    {product.images.map((image, index) => (
                      <Box key={index} sx={{ width: '100%' }}>
                        <Box
                          component="button"
                          onClick={() => setSelectedImage(index)}
                          sx={{
                            width: '100%',
                            paddingTop: '100%',
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: 2,
                            borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: selectedImage === index ? 'primary.main' : 'primary.light',
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
                            }}
                          >
                            <ImageWithFallback
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </div>

          {/* Product Info */}
          <div>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} mb={2}>
                  {product.popular && <Chip label="Populaire" color="secondary" size="small" />}
                  {product.pieces && (
                    <Chip label={`${product.pieces} pièces`} variant="outlined" size="small" />
                  )}
                  {product.stock < 20 && (
                    <Chip label="Stock limité" color="error" size="small" />
                  )}
                </Stack>
                <Typography variant="h3" component="h1" gutterBottom>
                  {product.name}
                </Typography>

                <Stack spacing={1} mb={3}>
                  <Stack direction="row" alignItems="baseline" spacing={2} flexWrap="wrap">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {price.toLocaleString('fr-FR')} FCFA
                    </Typography>
                    {product.originalPrice && userType !== 'wholesale' && (
                      <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {product.originalPrice.toLocaleString('fr-FR')} FCFA
                      </Typography>
                    )}
                    {userType === 'wholesale' && (
                      <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {product.price.toLocaleString('fr-FR')} FCFA
                      </Typography>
                    )}
                  </Stack>

                  {product.originalPrice && userType !== 'wholesale' && (
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% DE RÉDUCTION`}
                        color="error"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Économisez {(product.originalPrice - product.price).toLocaleString('fr-FR')} FCFA
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {userType === 'wholesale' && (
                  <Chip label="Prix grossiste appliqué" color="secondary" sx={{ mb: 2 }} />
                )}

                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
              </Box>

              <Divider />

              {/* Quantity Selector */}
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="subtitle1">Quantité:</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="small"
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <Minus fontSize="small" />
                    </IconButton>
                    <Typography sx={{ width: 40, textAlign: 'center' }}>{quantity}</Typography>
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                      size="small"
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <Plus fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {product.stock} en stock
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={() => onAddToCart(product, quantity)}
                    disabled={product.stock === 0}
                    sx={{ flex: 1, py: 1.5 }}
                  >
                    Ajouter au panier
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color={favorites.includes(product.id) ? 'error' : 'inherit'}
                    startIcon={favorites.includes(product.id) ? <Heart /> : <HeartOutline />}
                    onClick={() => onToggleFavorite(product.id)}
                    sx={{ minWidth: 120 }}
                  >
                    Favoris
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    color="success"
                    startIcon={<MessageCircle />}
                    onClick={handleWhatsAppOrder}
                  >
                    WhatsApp
                  </Button>
                </Stack>
              </Stack>

              <Divider />

              {/* Features */}
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Package color="primary" />
                  <Typography variant="body2">Import direct depuis la Chine - Qualité garantie</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Truck color="primary" />
                  <Typography variant="body2">Livraison à Dakar et dans toute la sous-région</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <RefreshCw color="primary" />
                  <Typography variant="body2">Retour possible sous 7 jours</Typography>
                </Stack>
              </Stack>

              <Divider />

              {/* Tabs */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="product tabs" variant="scrollable" scrollButtons="auto">
                    <Tab label="Description" />
                    <Tab label={`Avis (${product.reviews?.length || 0})`} />
                    <Tab label="Livraison" />
                    <Tab label="Paiement" />
                  </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                  <Typography paragraph>{product.description}</Typography>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">Caractéristiques:</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li><Typography variant="body2">Importé directement de Chine</Typography></li>
                    <li><Typography variant="body2">Qualité premium contrôlée</Typography></li>
                    {product.pieces && <li><Typography variant="body2">Ensemble de {product.pieces} pièces</Typography></li>}
                    <li><Typography variant="body2">Matériaux de haute qualité</Typography></li>
                  </Box>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                  <ProductReviews
                    productId={product.id}
                    reviews={(product.reviews || []).map(r => ({
                      id: r.id,
                      name: r.customerName,
                      email: r.customerEmail,
                      rating: r.rating,
                      comment: r.comment,
                      date: r.date,
                      verified: r.verified,
                      helpful: r.helpful
                    }))}
                    onAddReview={(review) => onAddReview({
                      name: review.name,
                      email: review.email,
                      rating: review.rating,
                      comment: review.comment
                    })}
                  />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Livraison à Dakar</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Livraison sous 2-3 jours ouvrables. Frais de livraison calculés au paiement.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Livraison en Gambie</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Livraison sous 5-7 jours ouvrables selon la destination.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Retrait en magasin</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gratuit - Disponible sous 24h dans notre boutique à Dakar.
                      </Typography>
                    </Box>
                  </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={3}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Mobile Money</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Wave et Orange Money acceptés
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>PayPal</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Paiement sécurisé par carte ou compte PayPal
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Paiement à la livraison</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Payez en espèces à la réception de votre commande
                      </Typography>
                    </Box>
                  </Stack>
                </CustomTabPanel>
              </Box>
            </Stack>
          </div>
        </Box>

        {/* Produits Similaires */}
        {similarProducts.length > 0 && (
          <Box mt={8}>
            <Divider sx={{ mb: 4 }} />
            <Box mb={4}>
              <Typography variant="h4" gutterBottom>Produits Similaires</Typography>
              <Typography variant="body1" color="text.secondary">
                Découvrez d'autres produits de la même catégorie
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
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
