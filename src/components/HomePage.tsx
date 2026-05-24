'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Paper,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowForward as ArrowRight,
  Inventory2 as Package,
  LocalShipping as Truck,
  Security as Shield,
  Place as PlaceIcon,
  Star as StarIcon,
  WorkspacePremium as AwardIcon,
  Store as StoreIcon,
} from '@mui/icons-material';

import { homeService } from '../services/home.service';
import { productService } from '../services/product.service';
import ProductCard from './ProductCard';
import { Product, Category } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PaymentIcons } from './PaymentIcons';
import { useRouter } from 'next/navigation';
import { ApiStateWrapper, LoadingSpinner, ErrorDisplay } from './ui/ApiStateWrapper';
import { ApiError } from '@/lib/error-handler';


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
  const theme = useTheme();
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
        productService.getProducts({ limit: 8 })
      ]);

      // Handle categories result
      if (categoriesResult.error) {
        setError(categoriesResult.error);
        setCategories([]);
      } else {
        setCategories(categoriesResult.data || []);

        // Créer un map des catégories pour faciliter l'association
        const categoryMap = new Map<number, string>();
        categoriesResult.data?.forEach((cat: Category) => {
          categoryMap.set(Number(cat.id), cat.name);
        });
        setCategoriesMap(categoryMap);
      }

      // Handle products result
      if (productsResult.error) {
        if (!error) setError(productsResult.error); // Don't overwrite categories error
        setPopularProducts([]);
      } else {
        const productsWithCategory = productsResult.data?.items.map((product: Product) => ({
          ...product,
          category_name: categoriesMap.get(product.category_id) || undefined
        })) || [];

        setPopularProducts(productsWithCategory);
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

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* ── HERO ── */}

      <Box
        sx={{
          width: '100%',
          bgcolor: '#F5F9FE',
          minHeight: { xs: 'auto', md: 'calc(100vh - 68px)' },
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
        }}
      >
        <Grid
          container
          sx={{
            width: '100%',
            flex: 1,
            minHeight: { xs: 'auto', md: 'calc(100vh - 68px)' },
          }}
        >
          {/* ── Colonne GAUCHE — texte ── */}

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#F5F9FE',
              px: { xs: 3, sm: 5, md: 6, lg: 12 },
              py: { xs: 10, sm: 12, md: 8 },
              pt: { xs: 14, md: 8 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 560, textAlign: 'left' }}>
              {/* Pill eyebrow */}

              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#E6F1FB',
                  borderRadius: '50px',
                  px: 2,
                  py: 0.75,
                  mb: 3,
                  justifyContent: 'center',
                }}
              >
                <PlaceIcon sx={{ fontSize: 16, color: '#0C447C' }} />
                <Typography sx={{ fontSize: 13, color: '#0C447C', fontWeight: 500 }}>
                  Dakar, Sénégal · Import depuis la Chine
                </Typography>
              </Box>

              {/* Titre principal — responsive */}

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem', lg: '3.25rem' },
                  lineHeight: 1.12,
                  color: '#042C53',
                  mb: 2.5,
                  letterSpacing: '-0.02em',
                }}
              >
                Produits{' '}
                <Box component="span" sx={{ color: '#185FA5' }}>
                  de qualité
                </Box>{' '}
                importés directement pour vous
              </Typography>

              {/* Sous-titre */}

              <Typography
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  color: '#5F5E5A',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 460,
                  mx: 'auto',
                }}
              >
                Dame Sarr sélectionne et importe des articles premium depuis la Chine.
                Meubles, décoration, textile — livrés partout au Sénégal.
              </Typography>

              {/* Boutons CTA */}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  onClick={() => handleNavigate('shop')}
                  sx={{
                    bgcolor: '#185FA5',
                    color: '#fff',
                    borderRadius: '8px',
                    px: 4,
                    py: 1.5,
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0C447C', boxShadow: 'none' },
                  }}
                >
                  Voir la boutique
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleNavigate('contact')}
                  sx={{
                    borderColor: '#B5D4F4',
                    color: '#185FA5',
                    borderRadius: '8px',
                    px: 3.5,
                    py: 1.5,
                    fontSize: 14,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#E6F1FB', borderColor: '#85B7EB' },
                  }}
                >
                  Demander un devis
                </Button>
              </Stack>

              {/* Stats */}

              <Stack direction="row" spacing={{ xs: 3, sm: 4 }}>
                {[
                  { num: '1 200+', label: 'Produits disponibles' },
                  { num: '8 500', label: 'Clients satisfaits' },
                  { num: '5 ans', label: "D'expérience" },
                ].map((s) => (
                  <Box key={s.label}>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.5rem' }, color: '#042C53' }}>
                      {s.num}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 11, md: 12 }, color: '#5F5E5A' }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* ── Colonne DROITE — cartes UI ── */}

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              bgcolor: '#E6F1FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 6, md: 8 },
              minHeight: { xs: 'auto', md: '100%' },
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: 400, md: 380, lg: 400 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {/* Card 1 : Arrivage */}

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: '1px solid #B5D4F4',
                  width: '100%',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: '#E6F1FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Package sx={{ color: '#185FA5', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#042C53' }}>
                      Nouvelle livraison
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: '#5F5E5A' }}>
                      Arrivage Chine ·{' '}
                      {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['Meubles', 'Décoration', 'Textile', 'Luminaires'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ bgcolor: '#E6F1FB', color: '#185FA5', fontWeight: 500, fontSize: 12 }}
                    />
                  ))}
                </Stack>
              </Paper>

              {/* Card 2 : Livraison */}

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: '1px solid #B5D4F4',
                  width: '100%',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: '#E6F1FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Truck sx={{ color: '#185FA5', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#5F5E5A' }}>
                      Livraison express
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#042C53' }}>
                      Dakar & banlieue
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Card 3 : Note */}

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: '1px solid #B5D4F4',
                  width: '100%',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: '#E6F1FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <StarIcon sx={{ color: '#185FA5', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: '#5F5E5A' }}>
                      Note clients
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#042C53' }}>
                      4,9 / 5 · 2 300 avis
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>


      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, display: 'inline-block', mb: 1.5, fontSize: '0.85rem' }}>
              Nos Avantages
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, lineHeight: 1.2, color: 'text.primary' }}>
              Pourquoi nous choisir ?
            </Typography>
            <Typography variant="h6" component="p" sx={{ maxWidth: '700px', mx: 'auto', color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7 }}>
              Découvrez ce qui fait de nous le choix idéal pour tous vos besoins d'achat en ligne
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 4, md: 6 }, mt: 2 }}>
            {[
              {
                icon: <Package sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
                title: 'Qualité Premium',
                description: 'Nous sélectionnons rigoureusement chaque produit pour vous offrir une qualité exceptionnelle et une durabilité à toute épreuve.',
              },
              {
                icon: <Truck sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
                title: 'Livraison Rapide',
                description: 'Bénéficiez d\'une livraison express dans tout le Maroc avec un suivi en temps réel de votre commande du dépôt à votre porte.',
              },
              {
                icon: <Shield sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
                title: 'Paiement Sécurisé',
                description: 'Transactions 100% sécurisées avec les protocoles de cryptage les plus avancés pour une expérience d\'achat en toute confiance.',
                paymentMethods: true,
              },
            ].map((feature, index) => (
              <Box key={index}>
                <Box sx={{
                  textAlign: 'center', p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)' }
                }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: '320px' }}>
                    {feature.description}
                  </Typography>
                  {feature.paymentMethods && (
                    <Box sx={{ mt: 3 }}>
                      <PaymentIcons size="md" showLabels={true} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Box sx={{ py: 8, bgcolor: '#F5F9FE' }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#185FA5', mb: 1 }}
            >
              Catalogue
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 600, color: '#042C53', mb: 0.5 }}>
              Nos catégories
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#888780' }}>
              Explorez notre large gamme de produits pour embellir votre intérieur
            </Typography>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}>
            {categories.map((category: Category) => (
              <Box
                key={category.id}
                onClick={() => onViewCategory ? onViewCategory(category.id) : handleNavigate('shop')}
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: '16/10',
                  bgcolor: '#0f1923',
                  // zoom image au hover
                  '&:hover .cat-img': { transform: 'scale(1.05)' },
                  '&:hover .cat-overlay': {
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 60%, transparent 100%)',
                  },
                }}
              >
                {/* Image full-bleed */}
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
                      objectFit: 'cover',        // ← clé : couvre tout sans bandes
                      objectPosition: 'center',
                      transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      display: 'block',
                    }}
                  />
                ) : (
                  /* Fallback si pas d'image */
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #042C53 0%, #185FA5 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontSize: '3rem' }}>{category.icon}</Typography>
                  </Box>
                )}

                {/* Gradient overlay */}
                <Box
                  className="cat-overlay"
                  sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)',
                    transition: 'background 0.3s ease',
                  }}
                />

                {/* Texte en bas */}
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, zIndex: 2 }}>
                  <Typography sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: { xs: 15, md: 17 },
                    letterSpacing: '-0.2px',
                    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                    lineHeight: 1.3,
                  }}>
                    {category.name}
                  </Typography>
                  {category.product_count !== undefined && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, mt: 0.25 }}>
                      {category.product_count} produit{category.product_count > 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Popular Products - Now Fetched from API */}
      <Box sx={{ py: 8, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography variant="h3" component="h2" gutterBottom>
                Produits Populaires
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Les favoris de nos clients
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowRight />}
              onClick={() => handleNavigate('shop')}
            >
              Voir tout
            </Button>
          </Box>


          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
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

        </Container>
      </Box>

      {/* CTA Section 
      <Box
        sx={{
          py: 10,
          background: (theme: any) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Achat en Gros ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Bénéficiez de tarifs préférentiels sur vos commandes en grande quantité. Contactez-nous pour un devis personnalisé.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => handleNavigate('contact')}
          >
            Demander un devis
          </Button>
        </Container>
      </Box>*/}
      {/* ── CTA GROSSISTE ── */}
      <Box
        sx={{
          mx: { xs: 2, sm: 4, md: 6 },
          my: 8,
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#042C53',
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 5, md: 7 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
          // Accent décoratif — cercle flou en arrière-plan
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(24, 95, 165, 0.25)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-40px',
            left: '10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(133, 183, 235, 0.12)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Texte gauche */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#85B7EB',
              mb: 1.5,
            }}
          >
            Achat en gros
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 22, sm: 28, md: 34 },
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              mb: 1.5,
            }}
          >
            Vous commandez en grande quantité ?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, md: 15 },
              color: 'rgba(255,255,255,0.70)',
              lineHeight: 1.75,
              maxWidth: 460,
            }}
          >
            Bénéficiez de tarifs préférentiels dégressifs pour vos achats
            professionnels. Un devis personnalisé en moins de 24h.
          </Typography>
        </Box>

        {/* Bouton droite */}
        <Box sx={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight />}
            onClick={() => handleNavigate('contact')}
            sx={{
              bgcolor: '#fff',
              color: '#042C53',
              fontWeight: 700,
              fontSize: 14,
              px: 4,
              py: 1.75,
              borderRadius: '10px',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              '&:hover': {
                bgcolor: '#E6F1FB',
                boxShadow: '0 6px 28px rgba(0,0,0,0.22)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Demander un devis
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
