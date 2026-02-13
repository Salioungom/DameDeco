import React, { useCallback, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { styled as muiStyled, alpha, type Theme as MuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Stack,
  Chip,
  Tooltip,
  useTheme as useMuiTheme,
  Skeleton
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  WhatsApp,
  Favorite,
  FavoriteBorder,
  Info as InfoIcon
} from '@mui/icons-material';
import { Product } from '../types/product';
import { orderViaWhatsApp } from '../lib/whatsapp';

// Styles personnalisés
interface StyledCardProps {
  elevationHover?: number;
  isMobile?: boolean;
  elevation?: number;
}

const StyledCard = muiStyled(Card, {
  shouldForwardProp: (prop: string) => !['elevationHover', 'isMobile'].includes(prop),
})(({ theme, elevationHover = 8, isMobile = false }: any) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  '&:hover': {
    transform: isMobile ? 'none' : 'translateY(-4px)',
    boxShadow: theme.shadows[elevationHover],
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

interface ProductImageWrapperProps {
  isLoading?: boolean;
}

const ProductImageWrapper = muiStyled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'isloading',
})(({ theme, isloading = false }: any) => ({
  position: 'relative',
  paddingTop: '100%', // ratio 1/1
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : theme.palette.grey[100],
  ...(isloading && {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
}));

const ProductImage = muiStyled(Box)(({ theme }: any) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const FavoriteButton = muiStyled(IconButton)(({ theme }: any) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  userType: 'retail' | 'wholesale';
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  className?: string;
  elevation?: number;
  showActions?: boolean;
  showFavorite?: boolean;
  showWhatsApp?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  userType,
  isFavorite = false,
  onToggleFavorite,
  className = '',
  elevation = 2,
  showActions = true,
  showFavorite = true,
  showWhatsApp = true,
  ...props
}) => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  }, [onAddToCart, product]);

  const handleViewDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(product);
  }, [onViewDetails, product]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  }, [onToggleFavorite, product.id]);

  const handleWhatsAppOrder = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const price = userType === 'wholesale' && product.wholesale_price
      ? product.wholesale_price
      : product.price;
    orderViaWhatsApp(
      product.name,
      price,
      1, // quantity
      product.cover_image_url,
      product.id,
      product.description
    );
  }, [product, userType]);

  // Calculer le taux de réduction
  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Ne pas déclencher la navigation si on clique sur un bouton
    if ((e.target as HTMLElement).closest('button, a, [role="button"]')) {
      return;
    }
    handleViewDetails(e);
  }, [handleViewDetails]);

  const isLoading = !product;

  if (isLoading) {
    return (
      <StyledCard elevation={elevation} isMobile={isMobile}>
        <ProductImageWrapper isLoading>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </ProductImageWrapper>
        <CardContent>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard
      className={`product-card ${className}`}
      elevation={elevation}
      elevationHover={8}
      isMobile={isMobile}
      onClick={handleCardClick}
      sx={{
        cursor: 'pointer',
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
        }
      }}
      aria-label={`Produit: ${product.name}`}
      {...props}
    >
      <ProductImageWrapper>
        <ProductImage>
          {product.cover_image_url ? (
            <ImageWithFallback
              src={product.cover_image_url}
              alt={product.name}
              width={400}
              height={400}
              objectFit="contain"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
              }}
            >
              <InfoIcon color="disabled" fontSize="large" />
            </Box>
          )}
        </ProductImage>

        {/* Badges d'état */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-start',
          }}
        >
          {product.inventory_quantity !== undefined && product.inventory_quantity < 20 && (
            <Chip
              label="Stock limité"
              color="error"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {product.original_price && product.original_price > product.price && (
            <Chip
              label={`-${discountPercentage}%`}
              color="error"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Bouton favori avec accessibilité améliorée */}
        {onToggleFavorite && showFavorite && (
          <Tooltip
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            arrow
            placement="top"
          >
            <FavoriteButton
              onClick={handleToggleFavorite}
              size="small"
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              aria-pressed={isFavorite}
            >
              {isFavorite ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder />
              )}
            </FavoriteButton>
          </Tooltip>
        )}
      </ProductImageWrapper>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Nom du produit */}
        <Typography
          gutterBottom
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3em',
          }}
        >
          {product.name}
        </Typography>

        {/* Prix */}
        <Box sx={{ mt: 'auto' }}>
          {product.original_price && product.original_price > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', display: 'inline', mr: 1 }}
            >
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
              }).format(product.original_price)}
            </Typography>
          )}
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{ display: 'inline', fontWeight: 'bold' }}
          >
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'XOF',
            }).format(
              userType === 'wholesale' && product.wholesale_price
                ? product.wholesale_price
                : product.price
            )}
            {userType === 'wholesale' && product.wholesale_price && (
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                (gros)
              </Typography>
            )}
          </Typography>

          {userType === 'wholesale' && (
            <Typography variant="caption" color="text.secondary" display="block">
              {product.wholesale_price ? `Prix spécial pour commandes en gros` : 'Contactez-nous pour les prix de gros'}
            </Typography>
          )}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions
          className="product-actions"
          sx={{
            p: 2,
            pt: 0,
            opacity: { xs: 1, md: 0.9 },
            transform: { md: 'translateY(10px)' },
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              opacity: 1,
            },
            '& button': {
              transition: 'all 0.2s ease-in-out',
            },
            '& button:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Tooltip title="Ajouter au panier">
              <IconButton
                color="primary"
                size="small"
                onClick={handleAddToCart}
                sx={{
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' },
                }}
              >
                <ShoppingCart />
              </IconButton>
            </Tooltip>

            {showWhatsApp && (
              <Tooltip title="Commander via WhatsApp">
                <IconButton
                  color="success"
                  size="small"
                  onClick={handleWhatsAppOrder}
                  sx={{
                    bgcolor: 'success.light',
                    '&:hover': { bgcolor: 'success.main', color: 'white' },
                  }}
                >
                  <WhatsApp />
                </IconButton>
              </Tooltip>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Voir les détails">
              <IconButton
                size="small"
                onClick={handleViewDetails}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      )}
    </StyledCard>
  );
};

export default ProductCard;
