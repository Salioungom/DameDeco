'use client';

import {
  LocationOn,
  Phone,
  Language,
  VerifiedUser,
  LocalShipping,
  Star,
  Verified,
  Visibility,
  SupportAgent,
  Shield,
  Handshake,
  Lightbulb,
  Groups,
  EmojiEvents,
  TrendingUp,
  WorkspacePremium,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  alpha,
  useTheme,
  Avatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const router = useRouter();
  const theme = useTheme();

  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  const teamMembers: TeamMember[] = [
    {
      name: 'Dame Sarr',
      role: 'Fondatrice & CEO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    {
      name: 'Aminata Diop',
      role: 'Directrice des Opérations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    {
      name: 'Moussa Ndiaye',
      role: 'Responsable Logistique',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Fatou Seck',
      role: 'Service Client',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    },
  ];

  const timeline: TimelineEvent[] = [
    {
      year: '2010',
      title: 'Création de l\'entreprise',
      description: 'Dame Sarr débute son activité d\'importation avec une vision claire : offrir des produits de qualité accessibles.',
      icon: <EmojiEvents />,
    },
    {
      year: '2015',
      title: 'Expansion de la gamme',
      description: 'Diversification vers la literie, les meubles et la décoration. Premier partenariat majeur avec des fournisseurs chinois.',
      icon: <TrendingUp />,
    },
    {
      year: '2020',
      title: 'Croissance exponentielle',
      description: '5000+ clients satisfaits. Ouverture d\'un showroom moderne à Dakar et développement de l\'activité grossiste.',
      icon: <WorkspacePremium />,
    },
    {
      year: '2024',
      title: 'Excellence et innovation',
      description: 'Lancement de notre plateforme e-commerce. Service client 24/7 et livraison express dans tout le Sénégal.',
      icon: <Groups />,
    },
  ];

  const values = [
    {
      icon: <Verified fontSize="large" />,
      title: 'Valeurs Solides',
      description: 'Nos décisions reposent sur des valeurs fortes.',
      color: theme.palette.primary.main,
    },
    {
      icon: <Visibility fontSize="large" />,
      title: 'Vision Claire',
      description: 'Une vision à long terme pour mieux vous servir.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <SupportAgent fontSize="large" />,
      title: 'Service Dédié',
      description: 'La satisfaction client au cœur de nos priorités.',
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '600px' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: `linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)`,
          }}
        />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758061329486-4f7b4a09d77d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWthciUyMHNlbmVnYWwlMjBjaXR5fGVufDF8fHx8MTc2MDY1NzgzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Dakar"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: '900px', color: 'white', textAlign: 'center', mx: 'auto' }}>
            <Chip
              label="DEPUIS 2010"
              sx={{
                mb: 3,
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: 1.5,
                backdropFilter: 'blur(10px)',
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.1,
                background: 'linear-gradient(to right, #fff 0%, rgba(255,255,255,0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              L'Excellence de l'Importation au Sénégal
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.95,
                fontWeight: 400,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              Votre partenaire de confiance pour des produits de qualité supérieure, importés directement pour vous.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigate('shop')}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 50,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Découvrir nos produits
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigate('contact')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 50,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: alpha('#fff', 0.1),
                    borderWidth: 2,
                  },
                }}
              >
                Nous contacter
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
      {/* Ensure hero container is centered */}


      {/* Mission/Vision/Values Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>
              QUI SOMMES-NOUS
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
              Notre Raison d'Être
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Guidés par nos valeurs et notre vision, nous nous engageons à offrir le meilleur service
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {values.map((value, index) => (
              <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: `1px solid ${alpha(value.color, 0.1)}`,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 40px ${alpha(value.color, 0.15)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'transparent',
                        border: `2px solid ${value.color}`,
                        color: value.color,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: value.color }}>
                      {value.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Timeline Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>
              NOTRE PARCOURS
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
              Notre Histoire
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Plus de 14 ans d'excellence et d'innovation au service de nos clients
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', maxWidth: 900, mx: 'auto' }}>
            {timeline.map((event, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 4,
                  mb: index !== timeline.length - 1 ? 6 : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline line */}
                {index !== timeline.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 39,
                      top: 80,
                      bottom: -48,
                      width: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }}
                  />
                )}

                {/* Year Circle */}
                <Box sx={{ flexShrink: 0 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'white',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      {event.year}
                    </Typography>
                  </Paper>
                </Box>

                {/* Content Card */}
                <Card
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: 'none',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start" mb={1}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        {event.icon}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {event.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>



      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={10}>
            <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>
              NOTRE ENGAGEMENT
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800} sx={{ mt: 1, mb: 3 }}>
              Pourquoi Nous Choisir ?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}>
              Trois piliers fondamentaux qui font notre différence
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: <Shield fontSize="large" />,
                title: 'Qualité Garantie',
                desc: 'Produits fiables et certifiés.',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
              {
                icon: <Handshake fontSize="large" />,
                title: 'Accompagnement Personnalisé',
                desc: 'Un suivi dédié.',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              },
              {
                icon: <Lightbulb fontSize="large" />,
                title: 'Innovation Continue',
                desc: 'Amélioration constante de nos services.',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              },
            ].map((value, index) => (
              <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    position: 'relative',
                    borderRadius: 5,
                    overflow: 'hidden',
                    background: value.gradient,
                    p: 0.3,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      bgcolor: 'background.paper',
                      borderRadius: 4.5,
                      p: 5,
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        background: value.gradient,
                        mx: 'auto',
                        mb: 4,
                        color: 'white',
                        boxShadow: `0 8px 24px ${alpha('#000', 0.15)}`,
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      gutterBottom
                      sx={{
                        background: value.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 2,
                        fontSize: '1.5rem',
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.8,
                        fontSize: '1rem',
                      }}
                    >
                      {value.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>
              NOTRE ÉQUIPE
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
              Les Artisans de Votre Satisfaction
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Une équipe passionnée et dévouée, prête à vous accompagner dans tous vos projets
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-8px)',
                      '& .member-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      className="member-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                      >
                        <LinkedIn />
                      </Avatar>
                      <Avatar
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                      >
                        <Twitter />
                      </Avatar>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ width: '100%', py: 12, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)` }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Prêt à découvrir nos produits ?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5, lineHeight: 1.7 }}>
              Parcourez notre catalogue et trouvez les perles rares pour votre commerce ou votre maison.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigate('shop')}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 50,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  transition: 'all 0.3s',
                }}
              >
                Visiter la Boutique
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigate('contact')}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 50,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'primary.dark',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Nous Contacter
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            {[
              { number: '14+', label: "Années d'expérience" },
              { number: '5000+', label: 'Clients Satisfaits' },
              { number: '1000+', label: 'Produits Disponibles' },
              { number: '24/7', label: 'Support Client' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{
                    mb: 1,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
