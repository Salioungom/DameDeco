'use client';

import { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  DeleteOutline as Trash2,
  Add,
  Remove,
  ShoppingCartOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ClientOnly } from '@/components/ClientOnly';
import { CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { useStore } from '@/store/useStore';
import { getImageUrl } from '@/lib/imageUtils';

interface CheckoutRecapProps {
  items: CartItemWithProduct[];
  onContinue: () => void;
  onBackToCart: () => void;
  shippingLoading: boolean;
  checkingAuth?: boolean;
}

export function CheckoutRecap({ items, onContinue, onBackToCart, shippingLoading, checkingAuth = false }: CheckoutRecapProps) {
  const theme = useTheme();
  const brandBlue = '#185FA5';
  const { updateQuantity, removeFromCart } = useStore();

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.product) return sum;
        const price =
          item.price_type === 'wholesale'
            ? item.product.wholesale_price
            : item.product.price;
        return sum + (price || 0) * item.quantity;
      }, 0),
    [items]
  );

  const total = subtotal;

  const handleQuantityChange = async (item: CartItemWithProduct, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    await updateQuantity(item.product_id.toString(), newQty);
  };

  const handleRemove = async (item: CartItemWithProduct) => {
    await removeFromCart(item.product_id.toString());
  };

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <ShoppingCartOutlined sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            Votre panier est vide
          </Typography>
          <Button variant="contained" onClick={onBackToCart} sx={{ borderRadius: 2, mt: 1 }}>
            Retour à la boutique
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          {/* Liste des articles */}
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              {items.length} article{items.length > 1 ? 's' : ''}
            </Typography>

            <Stack spacing={2}>
              {items.map((item) => {
                if (!item.product) return null;
                const price =
                  item.price_type === 'wholesale'
                    ? item.product.wholesale_price
                    : item.product.price;
                const lineTotal = (price || 0) * item.quantity;

                return (
                  <Box
                    key={item.id || item.product_id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2.5,
                      borderRadius: 3,
                      bgcolor: 'background.paper',
                      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: alpha(brandBlue, 0.3),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 112.5,
                        height: 112.5,
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'action.hover',
                        flexShrink: 0,
                        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                      }}
                    >
                      <ImageWithFallback
                        src={getImageUrl(item.product.cover_image_url || item.product.images?.[0]?.image_url)}
                        alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {item.product.name}
                          </Typography>
                          {item.product.reference && (
                            <Typography variant="caption" color="text.secondary">
                              Réf: {item.product.reference}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(item)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08) },
                          }}
                        >
                          <Trash2 fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                            borderRadius: 1.5,
                            overflow: 'hidden',
                          }}
                        >
                          <ClientOnly>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={item.quantity <= 1}
                              sx={{ width: 40, height: 40, borderRadius: 0 }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </ClientOnly>
                          <Typography variant="body2" fontWeight={600} sx={{ px: 1.5, minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <ClientOnly>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={item.quantity >= (item.product.inventory_quantity || 99)}
                              sx={{ width: 40, height: 40, borderRadius: 0 }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </ClientOnly>
                        </Box>

                        <Typography variant="subtitle1" fontWeight={700} color="primary">
                          {lineTotal.toLocaleString('fr-FR')} FCFA
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Résumé */}
          <Box>
            <Box
              sx={{
                p: 3.5,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Résumé
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Sous-total
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {subtotal.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary">
                    {total.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', pt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={onBackToCart}
                    sx={{
                      borderRadius: 2,
                      py: 1.3,
                      fontWeight: 600,
                      borderColor: alpha(theme.palette.divider, 0.8),
                    }}
                  >
                    Modifier le panier
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={onContinue}
                    disabled={checkingAuth}
                    endIcon={checkingAuth ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                    sx={{
                      borderRadius: 2,
                      py: 1.6,
                      fontWeight: 700,
                      fontSize: 18.75,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    {checkingAuth ? 'Vérification...' : 'Continuer'}
                  </Button>
                </Box>

                <Typography
                  variant="caption"
                  align="center"
                  color="text.secondary"
                  sx={{ display: 'block', lineHeight: 1.5, pt: 0.5 }}
                >
                  En continuant, vous acceptez nos conditions de vente
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
