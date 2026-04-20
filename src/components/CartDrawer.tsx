'use client';

import React, { useState } from 'react';
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
import { useCartWithProducts } from '@/hooks/useCartWithProducts';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import OrderService from '@/services/order.service';

export function CartDrawer() {
  const { isCartOpen, toggleCart, updateQuantity, removeFromCart, cartLoading, cartError, loadCart, clearCart, getSessionId } = useStore();
  const { cart: cartWithProducts } = useCartWithProducts();
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [shippingSettings, setShippingSettings] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger le panier au montage du composant
  React.useEffect(() => {
    if (isCartOpen && cartWithProducts.length === 0) {
      loadCart();
    }
  }, [isCartOpen, cartWithProducts.length, loadCart]);

  // Charger les settings de livraison
  React.useEffect(() => {
    const loadShippingSettings = async () => {
      try {
        const result = await fetch('/api/v1/shipping/settings');
        const data = await result.json();
        setShippingSettings(data);
      } catch (error) {
        console.error('Erreur lors du chargement des settings de livraison:', error);
      }
    };
    loadShippingSettings();
  }, []);

  const subtotal = (cartWithProducts || []).reduce((sum: number, item) => {
    const price = item.product 
      ? (item.price_type === 'wholesale' ? (item.product.wholesale_price || 0) : (item.product.price || 0))
      : (item.unit_price || 0);
    console.log('Calcul total - item:', item, 'price utilisé:', price, 'quantity:', item.quantity);
    return sum + price * item.quantity;
  }, 0);
  console.log('Sous-total calculé:', subtotal);

  const handleCheckout = async () => {
    if (cartWithProducts.length === 0) {
      return;
    }

    // Si authentifié, créer la commande avant de rediriger
    if (isAuthenticated && user) {
      try {
        setIsProcessing(true);

        // Créer la commande
        const order = await OrderService.createOrderFromCart(
          cartWithProducts,
          {
            first_name: user.full_name?.split(' ')[0] || 'Client',
            last_name: user.full_name?.split(' ').slice(1).join(' ') || 'Doe',
            address: 'Adresse par défaut',
            street: 'Adresse par défaut',
            city: 'Dakar',
            country: 'Sénégal',
            phone: user.phone || '770000000'
          },
          'wave',
          'XOF',
          'home_delivery'
        );

        console.log('Commande créée avec succès:', order);

        toggleCart(false);

        // Rediriger vers checkout avec l'ID de la commande
        router.push(`/checkout?orderId=${order.id}`);
      } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        toggleCart(false);
        router.push('/checkout');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Non authentifié, rediriger vers login
      toggleCart(false);
      router.push('/login');
    }
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
              {(cartWithProducts || []).length} article{(cartWithProducts || []).length > 1 ? 's' : ''}
            </Typography>
          </Box>
          <IconButton onClick={() => toggleCart(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {cartError && (
          <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Typography variant="body2">{cartError}</Typography>
          </Box>
        )}

        {!Array.isArray(cartWithProducts) || cartWithProducts.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 4 }}>
            <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              {cartLoading ? 'Chargement...' : 'Votre panier est vide'}
            </Typography>
            {!cartLoading && (
              <Button 
                variant="contained" 
                onClick={() => {
                  toggleCart(false);
                  window.location.href = '/shop';
                }}
              >
                Continuer mes achats
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {Array.isArray(cartWithProducts) && cartWithProducts.map((item) => {
                  const price = item.product 
                    ? (item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price)
                    : item.unit_price;
                  
                  return (
                    <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
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
                        {item.product ? (
                          <ImageWithFallback
                            src={item.product.cover_image_url || ''}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag sx={{ fontSize: 32, color: 'text.secondary' }} />
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap gutterBottom>
                          {item.product ? item.product.name : `Produit #${item.product_id}`}
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
                                  item.product_id.toString(),
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
                              onClick={() => updateQuantity(item.product_id.toString(), item.quantity + 1)}
                            >
                              <Plus fontSize="small" />
                            </IconButton>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            sx={{ ml: 'auto' }}
                            onClick={() => removeFromCart(item.product_id.toString())}
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
                  <Typography fontWeight="bold">{subtotal.toLocaleString('fr-FR')} FCFA</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Livraison</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                    {shippingSettings?.freeShippingEnabled !== false 
                      ? `Gratuite dès ${Number(shippingSettings.freeShippingThreshold || 25000).toLocaleString('fr-FR')} FCFA d'achat ou au retrait en boutique`
                      : `Gratuite dès ${Number(shippingSettings?.freeShippingThreshold || 25000).toLocaleString('fr-FR')} FCFA d'achat ou au retrait en boutique`}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    {subtotal.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Traitement en cours...' : 'Passer la commande'}
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
