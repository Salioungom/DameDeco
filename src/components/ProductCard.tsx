import React, { useCallback, useState, useMemo } from 'react';
import { styled as muiStyled } from '@mui/material/styles';
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
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart,
  Visibility,
  WhatsApp,
  Favorite,
  FavoriteBorder,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Product } from '../types/product';
import { orderViaWhatsApp } from '../lib/whatsapp';

// ─── Styled components ───────────────────────────────────────────────────────

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
    '& .product-image-inner': {
      // zoom handled by ImageZone CSS
    },
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

/**
 * IMAGE ZONE — zone améliorée
 * Ratio 4/3 (75%) qui s'adapte bien aux images produit.
 * Fond neutre légèrement teinté pour faire ressortir le produit.
 */
const ImageZone = muiStyled(Box)(() => ({
  position: 'relative',
  width: '100%',
  paddingTop: '72%',        // ratio légèrement carré — optimal cartes produit
  overflow: 'hidden',
  backgroundColor: '#0f1923', // fond sombre neutre — fait ressortir le screenshot
  borderBottom: 'none',
  borderRadius: '0',
  // Clip-path pour couper net sans border-radius visible
  '& img': {
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '&:hover img': {
    transform: 'scale(1.06)',
  },
}));

/**
 * IMAGE INNER — l'image elle-même avec transition zoom au hover
 */
const ImageInner = muiStyled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,               // full-bleed, aucune marge
  overflow: 'hidden',
}));

/**
 * Skeleton overlay pendant le chargement de l'image
 */
const ImageSkeleton = muiStyled(Skeleton)(() => ({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  transform: 'none', // annule le transform par défaut de MUI Skeleton
  borderRadius: 0,
}));

const FavoriteButton = muiStyled(IconButton)(() => ({
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 3,
  width: 36,
  height: 36,
  // Glassmorphism premium
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(12px) saturate(180%)',
  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.35)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
  transition: 'all 0.2s ease',
  color: 'rgba(255,255,255,0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.6)',
  },
}));

// ─── Types ───────────────────────────────────────────────────────────────────

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
}

// ─── Component ───────────────────────────────────────────────────────────────

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // ── Callbacks ──────────────────────────────────────────────────────────────

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart(product); },
    [onAddToCart, product],
  );

  const handleViewDetails = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onViewDetails(product); },
    [onViewDetails, product],
  );

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onToggleFavorite?.(product.id); },
    [onToggleFavorite, product.id],
  );

  const handleWhatsAppOrder = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const price =
        userType === 'wholesale' && (product.wholesale_price || product.cost_price)
          ? Number(product.wholesale_price || product.cost_price)
          : Number(product.price);
      orderViaWhatsApp(
        product.name, price, 1,
        product.cover_image_url, product.id, product.description,
      );
    },
    [product, userType],
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, [role="button"]')) return;
      handleViewDetails(e);
    },
    [handleViewDetails],
  );

  // ── Computed values ────────────────────────────────────────────────────────

  const originalPrice = product.original_price || product.compare_price;

  const discountPercentage = useMemo(
    () =>
      originalPrice && Number(originalPrice) > Number(product.price)
        ? Math.round(
            ((Number(originalPrice) - Number(product.price)) / Number(originalPrice)) * 100,
          )
        : 0,
    [originalPrice, product.price],
  );

  const displayPrice = useMemo(
    () =>
      userType === 'wholesale' && (product.wholesale_price || product.cost_price)
        ? Number(product.wholesale_price || product.cost_price)
        : Number(product.price),
    [userType, product],
  );

  const fmt = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);

  // ── Skeleton state ─────────────────────────────────────────────────────────

  if (!product) {
    return (
      <StyledCard elevation={elevation} isMobile={isMobile}>
        <ImageZone>
          <ImageSkeleton variant="rectangular" />
        </ImageZone>
        <CardContent>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </CardContent>
      </StyledCard>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const hasImage = !!product.cover_image_url && !imageError;

  return (
    <StyledCard
      className={`product-card ${className}`}
      elevation={elevation}
      elevationHover={8}
      isMobile={isMobile}
      onClick={handleCardClick}
      sx={{ cursor: 'pointer' }}
      aria-label={`Produit: ${product.name}`}
      {...props}
    >
      {/* ── IMAGE ZONE (seule partie modifiée) ── */}
      <ImageZone>

        {/* Skeleton visible pendant le chargement */}
        {imageLoading && hasImage && (
          <ImageSkeleton
            variant="rectangular"
            animation="wave"
            sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}
          />
        )}

        <ImageInner className="product-image-inner">
          {hasImage ? (
            <Box
              component="img"
              src={product.cover_image_url}
              alt={product.name}
              onLoad={() => setImageLoading(false)}
              onError={() => { setImageLoading(false); setImageError(true); }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',           // full-bleed — couvre toute la zone
                objectPosition: 'center top', // cadrage haut-centré (UI screenshots)
                opacity: imageLoading ? 0 : 1,
                transition: 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
                display: 'block',
                filter: 'brightness(1.04) contrast(1.03)', // micro-boost netteté/contraste
              }}
            />
          ) : (
            /* Fallback élégant quand pas d'image */
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: 'text.disabled',
              }}
            >
              <InfoIcon sx={{ fontSize: 40, opacity: 0.4 }} />
              <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.65rem' }}>
                Image non disponible
              </Typography>
            </Box>
          )}
        </ImageInner>

        {/* Gradient overlay subtil en bas — profondeur premium */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* ── Badges (stock + remise) — inchangés ── */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 3,       // au-dessus du gradient overlay
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
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
        
        </Box>

        {/* ── Bouton favori — inchangé ── */}
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
              {isFavorite
                ? <Favorite sx={{ fontSize: 18, color: '#ff4d6d' }} />
                : <FavoriteBorder sx={{ fontSize: 18, color: 'rgba(255,255,255,0.95)' }} />
              }
            </FavoriteButton>
          </Tooltip>
        )}
      </ImageZone>
      {/* ── FIN IMAGE ZONE ── */}

      {/* ── TEXTE / PRIX / ACTIONS — INCHANGÉS ── */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ mb: 1 }}>
          {product.category_name && (
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.7rem',
              }}
            >
              {product.category_name}
            </Typography>
          )}
          {product.slug && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                ml: product.category_name ? 1 : 0,
                fontSize: '0.65rem',
                fontStyle: 'italic',
              }}
            >
              {product.slug}
            </Typography>
          )}
        </Box>

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

        <Box sx={{ mt: 'auto' }}>
          {originalPrice && Number(originalPrice) > Number(product.price) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', display: 'inline', mr: 1 }}
            >
              {fmt(Number(originalPrice))}
            </Typography>
          )}
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{ display: 'inline', fontWeight: 'bold' }}
          >
            {fmt(displayPrice)}
            {userType === 'wholesale' && (product.wholesale_price || product.cost_price) && (
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                (gros)
              </Typography>
            )}
          </Typography>

          {originalPrice && Number(originalPrice) > Number(product.price) && userType !== 'wholesale' && (
            <Box sx={{ mt: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Chip
                  label={`-${discountPercentage}%`}
                  size="small"
                  sx={{
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
                <Typography variant="caption" color="success.main" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  Économisez {fmt(Number(originalPrice) - Number(product.price))}
                </Typography>
              </Stack>
            </Box>
          )}

          {userType === 'wholesale' && (
            <Typography variant="caption" color="text.secondary" display="block">
              {product.wholesale_price || product.cost_price
                ? 'Prix spécial pour commandes en gros'
                : 'Contactez-nous pour les prix de gros'}
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
            '&:hover': { opacity: 1 },
            '& button': { transition: 'all 0.2s ease-in-out' },
            '& button:hover': { transform: 'scale(1.05)' },
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

export default React.memo(ProductCard);