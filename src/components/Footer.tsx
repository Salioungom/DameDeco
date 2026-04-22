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
  background: `linear-gradient(135deg, ${alpha(theme.palette.grey[900], 0.03)} 0%, ${alpha(theme.palette.grey[50], 0.5)} 50%, ${alpha(theme.palette.grey[900], 0.03)} 100%)`,
  backdropFilter: 'blur(20px) saturate(180%)',
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  boxShadow: `0 -5px 40px ${alpha(theme.palette.common.black, 0.08)}`,
  marginTop: 'auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.secondary.main, 0.3)}, transparent)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.2)}, transparent)`,
  },
}));

const FooterLink = styled(MuiLink)(({ theme }: { theme: any }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontWeight: 500,
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateX(6px)',
    '&::before': {
      width: '8px',
      opacity: 1,
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '3px',
    background: theme.palette.primary.main,
    borderRadius: '2px',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
        py: { xs: 6, sm: 8, md: 10 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.3)}, transparent)`,
        }
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 4, sm: 5, md: 6 }
        }}>
          {/* About */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: { xs: 44, sm: 48, md: 52 },
                  height: { xs: 44, sm: 48, md: 52 },
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.08) rotate(3deg)',
                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.45)}`,
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
                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Dame Sarr
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: '0.75px',
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  }}
                >
                  Import-Export
                </Typography>
              </Box>
            </Stack>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.7,
                fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem' },
              }}
            >
              Importation de produits de qualité depuis la Chine. Votre partenaire de confiance à Dakar.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                mb: 2.5,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '32px',
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '2px',
                },
              }}
            >
              Liens rapides
            </Typography>
            <Stack spacing={1.5}>
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
                    py: 0.75,
                    width: 'fit-content',
                    fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem' },
                  }}
                >
                  {text}
                </FooterLink>
              ))}
            </Stack>
          </Box>

          {/* Categories */}
          <Box>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                mb: 2.5,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '32px',
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '2px',
                },
              }}
            >
              Catégories
            </Typography>
            <Stack spacing={1.5}>
              {categories.map((item: CategoryItem, index: number) => (
                <FooterLink
                  component={Link}
                  href={`/shop${item.id ? `?category=${item.id}` : ''}`}
                  variant="body2"
                  sx={{ 
                    display: 'block',
                    py: 0.75,
                    width: 'fit-content',
                    fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem' },
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
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                mb: 2.5,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '32px',
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '2px',
                },
              }}
            >
              Contactez-nous
            </Typography>
            <Stack spacing={2}>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-3px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Box 
                  sx={{
                    width: { xs: 34, sm: 36, md: 38 },
                    height: { xs: 34, sm: 36, md: 38 },
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <MapPin fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Notre adresse
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Dakar, Sénégal
                  </Typography>
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-3px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Box 
                  sx={{
                    width: { xs: 34, sm: 36, md: 38 },
                    height: { xs: 34, sm: 36, md: 38 },
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Phone fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Téléphone
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    +221 77 XXX XX XX
                  </Typography>
                </Box>
              </Stack>
              <Stack 
                direction="row" 
                spacing={1.5} 
                alignItems="flex-start"
                sx={{
                  p: { xs: 1.25, sm: 1.5 },
                  borderRadius: 2.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-3px)',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Box 
                  sx={{
                    width: { xs: 34, sm: 36, md: 38 },
                    height: { xs: 34, sm: 36, md: 38 },
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Mail fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    contact@damesarr.sn
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ 
          my: { xs: 4, sm: 5, md: 6 },
          borderColor: alpha(theme.palette.divider, 0.12),
          '&::before, &::after': {
            borderColor: alpha(theme.palette.divider, 0.15),
          },
        }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 3, sm: 4 }}
        >
          <Box sx={{ 
            textAlign: { xs: 'center', md: 'left' },
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9rem' },
                fontWeight: 500,
              }}
            >
              &copy; {new Date().getFullYear()} Dame Sarr. Tous droits réservés.
            </Typography>
            <Typography 
              variant="caption" 
              color="text.disabled"
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                fontWeight: 500,
              }}
            >
              Conçu avec ❤️ pour vous servir
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
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
                  width: { xs: 36, sm: 40, md: 44 },
                  height: { xs: 36, sm: 40, md: 44 },
                  color: 'text.secondary',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    color: 'primary.main',
                    transform: 'translateY(-4px) scale(1.1)',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                  '&:active': {
                    transform: 'translateY(-2px) scale(1.05)',
                  },
                }}
              >
                <Icon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
              </IconButton>
            ))}
          </Stack>

          <PaymentIcons showLabels={true} />
        </Stack>
      </Container>
    </FooterContainer>
  );
}