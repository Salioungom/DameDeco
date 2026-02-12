'use client';

import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Remove as Minus,
  Add as Plus,
  Delete as Trash2,
  ShoppingBag,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();
  const router = useRouter();
  const theme = useTheme();

  const total = cart.reduce((sum, item) => {
    const price =
      item.priceType === 'wholesale'
        ? item.product.wholesale_price
        : item.product.price;
    return sum + (price || 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    toggleCart(false);
    router.push('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => toggleCart(false)}
      PaperProps={{
        sx: { width: '100%', maxWidth: 450 },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Panier</Typography>
            <Typography variant="body2" color="text.secondary">
              {cart.length} article{cart.length > 1 ? 's' : ''}
            </Typography>
          </Box>
          <IconButton onClick={() => toggleCart(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {cart.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 4 }}>
            <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography color="text.secondary">Votre panier est vide</Typography>
            <Button variant="contained" onClick={() => toggleCart(false)}>
              Continuer mes achats
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {cart.map((item) => {
                  const price =
                    item.priceType === 'wholesale'
                      ? item.product.wholesale_price
                      : item.product.price;
                  return (
                    <Box key={item.product.id} sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: 'hidden',
                          bgcolor: 'action.hover',
                          flexShrink: 0,
                        }}
                      >
                        <ImageWithFallback
                          src={item.product.cover_image_url || ''}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
                          {(price || 0).toLocaleString('fr-FR')} FCFA
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ width: 24, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              <Plus fontSize="small" />
                            </IconButton>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            sx={{ ml: 'auto' }}
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
              <Stack spacing={2}>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Sous-total</Typography>
                  <Typography fontWeight="bold">{total.toLocaleString('fr-FR')} FCFA</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Livraison</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calculée au paiement
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    {total.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Passer la commande
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => toggleCart(false)}
                >
                  Continuer mes achats
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
