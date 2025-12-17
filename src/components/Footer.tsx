'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  Stack,
  useTheme,
  TextField,
  Button,
} from '@mui/material';
import {
  LocationOn as MapPin,
  Phone,
  Email as Mail,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from '@mui/icons-material';
import { PaymentIcons } from './PaymentIcons';
import { styled, alpha } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }: { theme: any }) => ({
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.98)} 100%)`,
  backdropFilter: 'blur(20px) saturate(180%)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 -5px 30px ${alpha(theme.palette.common.black, 0.05)}`,
  marginTop: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
  },
}));

const FooterLink = styled(MuiLink)(({ theme }: { theme: any }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(4px)',
    '&::before': {
      width: '6px',
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '2px',
    background: theme.palette.primary.main,
    borderRadius: '2px',
    opacity: 0,
    transition: 'all 0.3s ease',
  },
}));

interface CategoryItem {
  id?: string;
  label: string;
}

export function Footer() {
  const theme = useTheme();
  
  const categories: CategoryItem[] = [
    { id: '1', label: 'Meubles' },
    { id: '2', label: 'Décoration' },
    { id: '3', label: 'Luminaires' },
    { id: '4', label: 'Textile' },
  ];

  return (
    <FooterContainer component="footer">
      <Container maxWidth="xl" sx={{ 
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.5)}, transparent)`,
        }
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 4
        }}>
          {/* About */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05) rotate(5deg)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                DS
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Dame Sarr
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                  }}
                >
                  Import-Export
                </Typography>
              </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Importation de produits de qualité depuis la Chine. Votre partenaire de confiance à Dakar.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Liens rapides
            </Typography>
            <Stack spacing={1}>
              {['Accueil', 'Boutique', 'À propos', 'Contact'].map((text, index) => (
                <FooterLink
                  key={`footer-link-${index}`}
                  component={Link}
                  href={
                    text === 'Accueil' ? '/' :
                      text === 'Boutique' ? '/shop' :
                        text === 'À propos' ? '/about' :
                          `/${text.toLowerCase().replace(' ', '-')}`
                  }
                  variant="body2"
                  sx={{ 
                    display: 'block',
                    py: 0.5,
                    width: 'fit-content',
                  }}
                >
                  {text}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          {/* Categories */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Catégories
            </Typography>
            <Stack spacing={1}>
              {categories.map((item: CategoryItem, index: number) => (
                <FooterLink
                  component={Link}
                  href={`/shop${item.id ? `?category=${item.id}` : ''}`}
                  variant="body2"
                  sx={{ 
                    display: 'block',
                    py: 0.5,
                    width: 'fit-content',
                  }}
                  key={index}
                >
                  {item.label}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Contactez-nous
            </Typography>
            <Stack spacing={2}>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box 
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <MapPin fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                    Notre adresse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dakar, Sénégal
                  </Typography>
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box 
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <Phone fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                    Téléphone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +221 77 XXX XX XX
                  </Typography>
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box 
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                >
                  <Mail fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    contact@damesarr.sn
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ 
          my: 4, 
          borderColor: alpha(theme.palette.divider, 0.1),
          '&::before, &::after': {
            borderColor: alpha(theme.palette.divider, 0.2),
          },
        }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Box sx={{ 
            textAlign: { xs: 'center', md: 'left' },
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Dame Sarr. Tous droits réservés.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Conçu avec ❤️ pour vous servir
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            {[
              { icon: Facebook, label: 'Facebook', id: 'facebook' },
              { icon: Instagram, label: 'Instagram', id: 'instagram' },
              { icon: Twitter, label: 'Twitter', id: 'twitter' },
              { icon: Send, label: 'Telegram', id: 'telegram' },
            ].map(({ icon: Icon, label, id }, index) => (
              <IconButton
                key={id}
                color="inherit"
                aria-label={label}
                sx={{
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Stack>

          <PaymentIcons showLabels={true} />
        </Stack>
      </Container>
    </FooterContainer>
  );
}