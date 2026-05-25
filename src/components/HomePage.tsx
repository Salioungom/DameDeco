'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Skeleton,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowForward as ArrowRight,
  Inventory2 as Package,
  LocalShipping as Truck,
  Security as Shield,
  Place as PlaceIcon,
  Star as StarIcon,
  CheckCircle,
  VerifiedUser,
  SupportAgent,
} from '@mui/icons-material';
import { NAVBAR_HEIGHT } from './Navigation';

import { homeService } from '../services/home.service';
import { productService } from '../services/product.service';
import ProductCard from './ProductCard';
import { Product, Category } from '../lib/types';
import { PaymentIcons } from './PaymentIcons';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/error-handler';

const C = {
  primary: '#185FA5',
  dark: '#042C53',
  light: '#E6F1FB',
  surface: '#F8FAFC',
  border: '#D4E6F7',
  mid: '#85B7EB',
  muted: '#64748B',
  text: '#5F5E5A',
} as const;

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);

const sectionLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: C.primary,
  mb: 1,
};

const sectionTitleSx = {
  fontSize: { xs: '1.65rem', md: '2rem' },
  fontWeight: 800,
  color: C.dark,
  letterSpacing: '-0.03em',
  lineHeight: 1.15,
  mb: 1,
};

const sectionDescSx = {
  fontSize: { xs: 14, md: 15 },
  color: C.text,
  lineHeight: 1.75,
  maxWidth: 520,
};

const FEATURES = [
  {
    num: '01',
    icon: Package,
    title: 'Qualité premium',
    description:
      'Chaque article est contrôlé à la source : matériaux, finitions et conformité avant expédition depuis la Chine.',
  },
  {
    num: '02',
    icon: Truck,
    title: 'Livraison express',
    description:
      'Expédition 24–48h sur Dakar et banlieue, suivi en temps réel et livraison dans tout le Sénégal.',
  },
  {
    num: '03',
    icon: Shield,
    title: 'Paiement sécurisé',
    description:
      'Transactions protégées et moyens de paiement locaux pour acheter en toute confiance.',
    paymentMethods: true,
  },
] as const;

function SectionHeader({
  label,
  title,
  description,
  action,
  centered = false,
}: {
  label: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: centered ? 'center' : { xs: 'flex-start', sm: 'flex-end' },
        gap: 3,
        mb: { xs: 5, md: 6 },
        textAlign: centered ? 'center' : 'left',
      }}
    >
      <Box sx={{ maxWidth: centered ? 640 : 560, ...(centered && { mx: 'auto' }) }}>
        <Typography sx={sectionLabelSx}>{label}</Typography>
        <Typography component="h2" sx={sectionTitleSx}>
          {title}
        </Typography>
        {description && <Typography sx={{ ...sectionDescSx, ...(centered && { mx: 'auto' }) }}>{description}</Typography>}
      </Box>
      {action}
    </Box>
  );
}

function HeroProductThumb({ name }: { name?: string }) {
  const initial = (name?.trim().charAt(0) || 'D').toUpperCase();
  return (
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '12px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, ${C.primary} 0%, ${C.dark} 100%)`,
        color: '#fff',
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: '-0.02em',
        boxShadow: `0 4px 14px ${alpha(C.primary, 0.35)}`,
      }}
    >
      {initial}
    </Box>
  );
}

interface HomePageProps {
  onNavigate?: (page: string, category?: string) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onViewCategory?: (categoryId: string) => void;
  userType: 'retail' | 'wholesale';
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export function HomePage({
  onNavigate,
  onAddToCart,
  onViewProduct,
  onViewCategory,
  userType,
  favorites,
  onToggleFavorite,
}: HomePageProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Map<number, string>>(new Map());

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, productsResult] = await Promise.all([
        homeService.getActiveCategories(),
        productService.getProducts({ limit: 8 }),
      ]);

      const categoryMap = new Map<number, string>();

      if (categoriesResult.error) {
        setError(categoriesResult.error);
        setCategories([]);
      } else {
        const cats = categoriesResult.data || [];
        setCategories(cats);
        cats.forEach((cat: Category) => {
          categoryMap.set(Number(cat.id), cat.name);
        });
        setCategoriesMap(categoryMap);
      }

      if (productsResult.error) {
        if (!categoriesResult.error) setError(productsResult.error);
        setPopularProducts([]);
      } else {
        const items = productsResult.data?.items || [];
        setPopularProducts(
          items.map((product: Product) => ({
            ...product,
            category_name: categoryMap.get(product.category_id) || undefined,
          })),
        );
      }
    } catch (err) {
      console.error('Error loading home data:', err);
      setError({
        message: 'Erreur lors du chargement des données',
        isNetworkError: false,
        isTimeout: false,
        isServerError: false,
        isClientError: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path === 'home' ? '/' : `/${path}`);
    }
  };

  const featuredProduct = useMemo(() => {
    const featured = popularProducts.find((p) => p.is_featured);
    return featured ?? popularProducts[0] ?? null;
  }, [popularProducts]);

  const heroCategoryTags = useMemo(() => {
    if (categories.length > 0) {
      return categories.slice(0, 4).map((c) => c.name);
    }
    return ['Meubles', 'Décoration', 'Textile', 'Luminaires'];
  }, [categories]);

  const featuredDiscount =
    featuredProduct?.compare_price && featuredProduct.compare_price > featuredProduct.price
      ? Math.round(((featuredProduct.compare_price - featuredProduct.price) / featuredProduct.compare_price) * 100)
      : null;

  const heroMinHeight = `calc(100dvh - ${NAVBAR_HEIGHT}px)`;

  const trustItems = [
    { icon: <VerifiedUser sx={{ fontSize: 18 }} />, label: 'Fournisseurs certifiés' },
    { icon: <Truck sx={{ fontSize: 18 }} />, label: 'Livraison 24–48h Dakar' },
    { icon: <Shield sx={{ fontSize: 18 }} />, label: 'Paiement sécurisé' },
    { icon: <SupportAgent sx={{ fontSize: 18 }} />, label: 'Support 6j/7' },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* ── HERO PREMIUM ── */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: C.surface,
          minHeight: { xs: 'auto', lg: heroMinHeight },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 0% 0%, ${alpha(C.primary, 0.12)} 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 100% 100%, ${alpha(C.mid, 0.15)} 0%, transparent 50%),
              linear-gradient(180deg, ${C.surface} 0%, #fff 100%)
            `,
            pointerEvents: 'none',
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 2.5, sm: 4, md: 6 },
            py: { xs: 5, sm: 7, lg: 8 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 5, lg: 6 }}
            alignItems="center"
            sx={{ minHeight: { lg: `calc(${heroMinHeight} - 120px)` } }}
          >
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ maxWidth: 580 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#fff',
                    border: `1px solid ${C.border}`,
                    borderRadius: '100px',
                    px: 1.75,
                    py: 0.625,
                    mb: 3,
                    boxShadow: '0 2px 12px rgba(4, 44, 83, 0.06)',
                  }}
                >
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e', flexShrink: 0 }} />
                  <PlaceIcon sx={{ fontSize: 15, color: C.primary }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.dark, letterSpacing: '0.04em' }}>
                    Dakar · Import premium depuis la Chine
                  </Typography>
                </Box>

                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.15rem', sm: '2.75rem', md: '3.15rem', xl: '3.5rem' },
                    lineHeight: 1.08,
                    letterSpacing: '-0.035em',
                    color: C.dark,
                    mb: 2.5,
                  }}
                >
                  L&apos;art de{' '}
                  <Box
                    component="span"
                    sx={{
                      color: C.primary,
                      background: `linear-gradient(135deg, ${C.primary} 0%, ${C.mid} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    sublimer
                  </Box>{' '}
                  votre intérieur
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 15, md: 16 },
                    color: C.text,
                    lineHeight: 1.75,
                    mb: 3,
                    maxWidth: 480,
                  }}
                >
                  Meubles, décoration et textile sélectionnés par Dame Sarr — import direct,
                  qualité contrôlée, livraison partout au Sénégal.
                </Typography>

                <Stack spacing={1.25} sx={{ mb: 4 }}>
                  {[
                    'Sélection rigoureuse chez des fournisseurs certifiés',
                    'Tarifs dégressifs pour les professionnels',
                    'Suivi de commande et livraison express',
                  ].map((pt) => (
                    <Stack key={pt} direction="row" spacing={1.25} alignItems="flex-start">
                      <CheckCircle sx={{ fontSize: 17, color: C.primary, mt: 0.25, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{pt}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight />}
                    onClick={() => handleNavigate('shop')}
                    sx={{
                      bgcolor: C.primary,
                      color: '#fff',
                      borderRadius: '10px',
                      px: 3.5,
                      py: 1.375,
                      fontSize: 14,
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: `0 8px 28px ${alpha(C.primary, 0.35)}`,
                      '&:hover': {
                        bgcolor: C.dark,
                        boxShadow: `0 12px 32px ${alpha(C.primary, 0.4)}`,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Explorer la boutique
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleNavigate('contact')}
                    sx={{
                      borderColor: C.border,
                      color: C.primary,
                      bgcolor: '#fff',
                      borderRadius: '10px',
                      px: 3,
                      py: 1.375,
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: C.light, borderColor: C.mid },
                    }}
                  >
                    Devis professionnel
                  </Button>
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    pt: 3,
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  {[
                    { num: '1 200+', label: 'Références' },
                    { num: '4,9★', label: 'Satisfaction' },
                    { num: '14 ans', label: "D'expertise" },
                  ].map((s) => (
                    <Box key={s.label}>
                      <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.45rem' }, color: C.dark, letterSpacing: '-0.02em' }}>
                        {s.num}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: C.muted, mt: 0.25 }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ mx: 'auto', width: '100%', maxWidth: { xs: 480, lg: 560 } }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: { xs: '20px', md: '24px' },
                      overflow: 'hidden',
                      aspectRatio: '4/5',
                      minHeight: { xs: 360, sm: 420, lg: 480 },
                      maxHeight: { lg: 560 },
                      bgcolor: C.light,
                      boxShadow: '0 24px 80px rgba(4, 44, 83, 0.18)',
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <Image
                      src={HERO_IMAGE}
                      alt="Intérieur premium — Dame Sarr Import"
                      fill
                      priority
                      sizes="(max-width: 900px) 90vw, 560px"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to top, ${alpha(C.dark, 0.35)} 0%, transparent 40%)`,
                      }}
                    />
                    <Chip
                      icon={<StarIcon sx={{ fontSize: '14px !important', color: '#fbbf24 !important' }} />}
                      label="4,9 · 2 300+ avis"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: alpha('#fff', 0.95),
                        fontWeight: 700,
                        fontSize: 11,
                        color: C.dark,
                        border: `1px solid ${C.border}`,
                      }}
                    />
                    <Paper
                      elevation={0}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 1,
                        px: 1.75,
                        py: 1,
                        borderRadius: '12px',
                        bgcolor: C.dark,
                        color: '#fff',
                        boxShadow: '0 8px 24px rgba(4, 44, 83, 0.3)',
                      }}
                    >
                      <Truck sx={{ fontSize: 17, color: C.mid }} />
                      <Box>
                        <Typography sx={{ fontSize: 9, color: alpha('#fff', 0.65), lineHeight: 1.2 }}>Livraison express</Typography>
                        <Typography sx={{ fontSize: 11, fontWeight: 700 }}>Dakar & banlieue</Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                  {heroCategoryTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleNavigate('shop')}
                      sx={{
                        bgcolor: '#fff',
                        color: C.dark,
                        fontWeight: 600,
                        fontSize: 11,
                        border: `1px solid ${C.border}`,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: C.light, borderColor: C.mid },
                      }}
                    />
                  ))}
                </Stack>

                <Paper
                  elevation={0}
                  onClick={() => featuredProduct && onViewProduct(featuredProduct)}
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: '#fff',
                    border: `1px solid ${C.border}`,
                    boxShadow: `0 12px 40px ${alpha(C.dark, 0.1)}`,
                    cursor: featuredProduct ? 'pointer' : 'default',
                    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    ...(featuredProduct && {
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 16px 48px ${alpha(C.dark, 0.14)}`,
                      },
                    }),
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: '12px' }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton width="50%" height={10} sx={{ mb: 1 }} />
                        <Skeleton width="75%" height={16} sx={{ mb: 0.75 }} />
                        <Skeleton width="35%" height={14} />
                      </Box>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <HeroProductThumb name={featuredProduct?.name} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary }}>
                            Sélection du moment
                          </Typography>
                          {featuredDiscount != null && (
                            <Chip label={`-${featuredDiscount}%`} size="small" sx={{ height: 18, fontSize: 10, fontWeight: 800, bgcolor: '#fef2f2', color: '#b91c1c' }} />
                          )}
                        </Stack>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: C.dark,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textTransform: 'capitalize',
                          }}
                        >
                          {featuredProduct?.name || 'Découvrir la boutique'}
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
                          <Typography sx={{ fontSize: 15, fontWeight: 800, color: C.primary }}>
                            {featuredProduct ? formatPrice(featuredProduct.price) : 'Voir les prix'}
                          </Typography>
                          {featuredProduct?.compare_price && featuredProduct.compare_price > featuredProduct.price && (
                            <Typography sx={{ fontSize: 12, color: C.muted, textDecoration: 'line-through' }}>
                              {formatPrice(featuredProduct.compare_price)}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          bgcolor: C.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ArrowRight sx={{ color: C.primary, fontSize: 20 }} />
                      </Box>
                    </Stack>
                  )}
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            borderTop: `1px solid ${C.border}`,
            bgcolor: '#fff',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: { xs: 1.5, md: 0 },
                py: { xs: 2.5, md: 0 },
              }}
            >
              {trustItems.map((item, index) => (
                <Stack
                  key={item.label}
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  justifyContent={{ xs: 'flex-start', md: 'center' }}
                  sx={{
                    py: { md: 2.75 },
                    px: { md: 2 },
                    borderRight: {
                      md: index < trustItems.length - 1 ? `1px solid ${C.border}` : 'none',
                    },
                    borderBottom: {
                      xs: index < 2 ? `1px solid ${C.border}` : 'none',
                      md: 'none',
                    },
                    pb: { xs: index < 2 ? 2 : 0, md: 0 },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: C.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: C.primary,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: { xs: 11.5, md: 13 }, fontWeight: 700, color: C.dark, lineHeight: 1.3 }}>
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Avantages */}
      <Box
        id="features"
        component="section"
        sx={{ py: { xs: 8, md: 11 }, bgcolor: '#fff', borderTop: `1px solid ${C.border}` }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          <SectionHeader
            centered
            label="Nos avantages"
            title="Pourquoi nous choisir ?"
            description="Une expérience d'achat pensée pour le Sénégal : sélection premium, logistique réactive et paiements de confiance."
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Paper
                  key={feature.num}
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: '100%',
                    borderRadius: '18px',
                    border: `1px solid ${C.border}`,
                    bgcolor: C.surface,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: C.mid,
                      boxShadow: `0 20px 48px ${alpha(C.dark, 0.08)}`,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '14px',
                        bgcolor: '#fff',
                        border: `1px solid ${C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ fontSize: 26, color: C.primary }} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: alpha(C.primary, 0.35),
                        letterSpacing: '0.06em',
                      }}
                    >
                      {feature.num}
                    </Typography>
                  </Stack>

                  <Typography component="h3" sx={{ fontSize: 18, fontWeight: 800, color: C.dark, mb: 1.25, letterSpacing: '-0.02em' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: C.text, lineHeight: 1.75, flex: 1 }}>
                    {feature.description}
                  </Typography>

                  {'paymentMethods' in feature && feature.paymentMethods && (
                    <Box
                      sx={{
                        mt: 3,
                        pt: 2.5,
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: C.muted, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Moyens acceptés
                      </Typography>
                      <PaymentIcons size="sm" showLabels />
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Catégories */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: C.surface }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          <SectionHeader
            label="Catalogue"
            title="Nos catégories"
            description="Parcourez nos univers — meubles, décoration, mode, électronique et bien plus."
            action={
              <Button
                variant="outlined"
                endIcon={<ArrowRight />}
                onClick={() => handleNavigate('shop')}
                sx={{
                  borderColor: C.border,
                  color: C.primary,
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: 'none',
                  flexShrink: 0,
                  bgcolor: '#fff',
                  '&:hover': { bgcolor: C.light, borderColor: C.mid },
                }}
              >
                Tout le catalogue
              </Button>
            }
          />

          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" sx={{ borderRadius: '18px', aspectRatio: '16/10' }} />
              ))}
            </Box>
          ) : categories.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: '18px',
                border: `1px dashed ${C.border}`,
                bgcolor: '#fff',
              }}
            >
              <Typography sx={{ color: C.muted, fontSize: 14 }}>Les catégories seront bientôt disponibles.</Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2.5,
              }}
            >
              {categories.map((category: Category) => (
                <Box
                  key={category.id}
                  onClick={() => (onViewCategory ? onViewCategory(category.id) : handleNavigate('shop'))}
                  sx={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    aspectRatio: '16/10',
                    bgcolor: C.dark,
                    border: `1px solid ${alpha(C.dark, 0.08)}`,
                    boxShadow: `0 8px 32px ${alpha(C.dark, 0.1)}`,
                    '&:hover .cat-img': { transform: 'scale(1.06)' },
                    '&:hover .cat-cta': { opacity: 1, transform: 'translateX(0)' },
                    '&:hover .cat-overlay': {
                      background: `linear-gradient(to top, ${alpha(C.dark, 0.88)} 0%, ${alpha(C.dark, 0.25)} 55%, transparent 100%)`,
                    },
                  }}
                >
                  {category.image ? (
                    <Box
                      component="img"
                      src={category.image}
                      alt={category.name}
                      className="cat-img"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '3rem' }}>{category.icon}</Typography>
                    </Box>
                  )}

                  <Box
                    className="cat-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, ${alpha(C.dark, 0.75)} 0%, ${alpha(C.dark, 0.1)} 55%, transparent 100%)`,
                      transition: 'background 0.35s ease',
                    }}
                  />

                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2.5, zIndex: 2 }}>
                    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography
                          sx={{
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: { xs: 16, md: 18 },
                            letterSpacing: '-0.02em',
                            lineHeight: 1.25,
                          }}
                        >
                          {category.name}
                        </Typography>
                        {category.product_count !== undefined && (
                          <Typography sx={{ color: alpha('#fff', 0.72), fontSize: 12, mt: 0.5 }}>
                            {category.product_count} produit{category.product_count > 1 ? 's' : ''}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        className="cat-cta"
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#fff',
                          opacity: 0,
                          transform: 'translateX(-8px)',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Explorer →
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Produits populaires */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          <SectionHeader
            label="Sélection"
            title="Produits populaires"
            description="Les articles les plus appréciés par nos clients — qualité vérifiée, prix compétitifs."
            action={
              <Button
                variant="contained"
                endIcon={<ArrowRight />}
                onClick={() => handleNavigate('shop')}
                sx={{
                  bgcolor: C.primary,
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: `0 6px 20px ${alpha(C.primary, 0.3)}`,
                  flexShrink: 0,
                  '&:hover': { bgcolor: C.dark },
                }}
              >
                Voir tout
              </Button>
            }
          />

          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={380} sx={{ borderRadius: '14px' }} />
              ))}
            </Box>
          ) : popularProducts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: '18px',
                border: `1px dashed ${C.border}`,
                bgcolor: C.surface,
              }}
            >
              <Typography sx={{ color: C.muted, fontSize: 14 }}>Aucun produit à afficher pour le moment.</Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: { xs: 2.5, md: 3 },
              }}
            >
              {popularProducts.map((product: Product) => (
                <Box key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewProduct}
                    userType={userType}
                    isFavorite={favorites.includes(product.id.toString())}
                    onToggleFavorite={onToggleFavorite}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA grossiste */}
      <Box component="section" sx={{ pb: { xs: 6, md: 10 }, pt: { xs: 0, md: 2 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
          <Box
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: C.dark,
              px: { xs: 3, sm: 5, md: 8 },
              py: { xs: 5, md: 7 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
              flexWrap: 'wrap',
              border: `1px solid ${alpha(C.mid, 0.2)}`,
              background: `linear-gradient(135deg, ${C.dark} 0%, #0a3d6e 50%, ${C.primary} 120%)`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-80px',
                right: '-40px',
                width: 320,
                height: 320,
                borderRadius: '50%',
                background: alpha(C.mid, 0.2),
                filter: 'blur(70px)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
              <Typography sx={{ ...sectionLabelSx, color: C.mid, mb: 1.5 }}>Achat en gros</Typography>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.15rem' },
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  mb: 1.5,
                }}
              >
                Vous commandez en grande quantité ?
              </Typography>
              <Typography sx={{ fontSize: { xs: 14, md: 15 }, color: alpha('#fff', 0.72), lineHeight: 1.75, maxWidth: 480 }}>
                Tarifs dégressifs pour les professionnels, devis personnalisé sous 24h et accompagnement dédié.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
                {['Devis sous 24h', 'Tarifs négociés', 'Support prioritaire'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: alpha('#fff', 0.1),
                      color: alpha('#fff', 0.9),
                      fontWeight: 600,
                      fontSize: 11,
                      border: `1px solid ${alpha('#fff', 0.15)}`,
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                onClick={() => handleNavigate('contact')}
                sx={{
                  bgcolor: '#fff',
                  color: C.dark,
                  fontWeight: 800,
                  fontSize: 14,
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: C.light,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Demander un devis
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
