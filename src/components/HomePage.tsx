'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowRight,
  Inventory2 as Package,
  LocalShipping as Truck,
  Security as Shield,
  Star,
  WhatsApp as MessageCircle,
} from '@mui/icons-material';
import { products, categories } from '../lib/data';
import ProductCard from './ProductCard';
import { Product, Category } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PaymentIcons } from './PaymentIcons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Image bannière depuis le dossier public
const bannerImage = '/banner.png';

interface HomePageProps {
  onNavigate?: (page: string, category?: string) => void; // Optional now as we use router
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
  const popularProducts = products.filter((p: Product) => p.popular);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path === 'home' ? '/' : `/${path}`);
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '100vh', md: '100vh' },
          minHeight: '500px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('${bannerImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            zIndex: 0,
          },
        }}
      >
        {/* Dégradé par-dessus l'image - ajusté pour laisser les drapeaux visibles */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)',
          zIndex: 1,
        }} />

        {/* Conteneur du contenu déplacé vers le bas */}
        <Box sx={{
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto',
          pb: { xs: '10%', md: '8%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 },
        }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
              lineHeight: 1.2,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px',
            }}
          >
            Découvrez l'Excellence de Notre Sélection
          </Typography>

          <Typography
            variant="h4"
            component="p"
            sx={{
              mb: 5,
              fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.6rem' },
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 1.6,
            }}
          >
            Une collection soigneusement sélectionnée de produits de haute qualité à des prix compétitifs
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              justifyContent: 'center',
              '& > *': {
                flex: { xs: '1 1 100%', sm: '0 1 auto' },
              }
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleNavigate('shop')}
              sx={{
                px: { xs: 3, sm: 5 },
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 600,
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '50px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                },
              }}
            >
              Nos Produits
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop, behavior: 'smooth' })}
              sx={{
                px: { xs: 3, sm: 5 },
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'white',
                border: '2px solid white',
                borderRadius: '50px',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              En savoir plus
            </Button>
          </Stack>
        </Box>
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
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 1.5,
                display: 'inline-block',
                mb: 1.5,
                fontSize: '0.85rem',
              }}
            >
              Nos Avantages
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              Pourquoi nous choisir ?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
              }}
            >
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
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      maxWidth: '320px',
                    }}
                  >
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
      <Box sx={{ py: 8 }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              Nos Catégories
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Explorez notre large gamme de produits pour embellir votre intérieur
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {categories.map((category: Category) => (
              <Box key={category.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                    },
                    '&:hover [data-role="category-media"]': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => onViewCategory ? onViewCategory(category.id) : handleNavigate('shop')}
                >
                  <CardContent sx={{ p: 0, position: 'relative', height: 200 }}>
                    <Box
                      data-role="category-media"
                      sx={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s',
                      }}
                    >
                      <ImageWithFallback
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Popular Products */}
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
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
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
      </Box>
    </Box>
  );
}
