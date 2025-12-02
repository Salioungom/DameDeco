import React, { memo, useCallback, useState } from 'react';
import { styled as muiStyled, alpha, type Theme as MuiTheme } from '@mui/material/styles';

// Désactiver les vérifications de type pour les composants stylisés
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Chip,
  Badge,
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
  Star,
  StarBorder,
  Info as InfoIcon
} from '@mui/icons-material';
import { Product } from '../lib/data';
import { orderViaWhatsApp } from '../lib/whatsapp';
// Composant personnalisé pour l'image avec fallback
const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
  style,
  fallback,
  ...props
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  style: React.CSSProperties;
  fallback: React.ReactNode;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

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
  paddingTop: '100%',
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
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

// Déplacer cette ligne à la fin du fichier

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
    const price = userType === 'wholesale' && product.wholesalePrice
      ? product.wholesalePrice
      : product.price;
    orderViaWhatsApp(
      product.name,
      price,
      1, // quantity
      product.image,
      product.id,
      product.description
    );
  }, [product, userType]);

  // Calculer le taux de réduction
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Calculer la note moyenne
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const reviewCount = (product.reviews && product.reviews.length) || 0;

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
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease-in-out',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '';
                target.parentElement!.innerHTML = `
                  <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: ${theme.palette.background.default};
                  ">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20V20H4V4ZM2 4C2 2.9 2.9 2 4 2H20C21.1 2 22 2.9 22 4V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V4ZM10 8H8V10H10V8ZM16 8H12V10H16V8ZM8 12H16V14H8V12Z" fill="#9E9E9E"/>
                    </svg>
                  </div>`;
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
          {product.stock !== undefined && product.stock < 20 && (
            <Chip
              label="Stock limité"
              color="error"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {product.originalPrice && product.originalPrice > product.price && (
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
        {/* Note et avis avec chargement paresseux */}
        {reviewCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', mr: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Box
                  key={star}
                  component="span"
                  sx={{
                    color: star <= Math.round(averageRating)
                      ? 'warning.main'
                      : 'action.disabled',
                  }}
                >
                  {star <= Math.round(averageRating) ? (
                    <Star fontSize="small" />
                  ) : (
                    <StarBorder fontSize="small" />
                  )}
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              component="span"
            >
              ({reviewCount} avis)
            </Typography>
          </Box>
        )}

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
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', display: 'inline', mr: 1 }}
            >
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
              }).format(product.originalPrice)}
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
              userType === 'wholesale' && product.wholesalePrice
                ? product.wholesalePrice
                : product.price
            )}
            {userType === 'wholesale' && product.wholesalePrice && (
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
              {product.wholesalePrice ? `Prix spécial pour commandes en gros` : 'Contactez-nous pour les prix de gros'}
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
