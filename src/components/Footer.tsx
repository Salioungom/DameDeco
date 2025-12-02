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

export function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 4
        }}>
          {/* About */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                DS
              </Box>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Dame Sarr
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
              {['Accueil', 'Boutique', 'À propos', 'Contact'].map((text) => (
                <MuiLink
                  key={text}
                  component={Link}
                  href={
                    text === 'Accueil' ? '/' :
                      text === 'Boutique' ? '/shop' :
                        text === 'À propos' ? '/about' :
                          `/${text.toLowerCase().replace(' ', '-')}`
                  }
                  color="text.secondary"
                  underline="hover"
                  variant="body2"
                  sx={{ display: 'block' }}
                >
                  {text}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Categories */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Catégories
            </Typography>
            <Stack spacing={1}>
              {[
                { label: 'Décoration', id: '' },
                { label: 'Draps & Literie', id: 'sheets' },
                { label: 'Rideaux', id: 'curtains' },
                { label: 'Meubles', id: 'furniture' }
              ].map((item) => (
                <MuiLink
                  key={item.label}
                  component={Link}
                  href={`/shop${item.id ? `?category=${item.id}` : ''}`}
                  color="text.secondary"
                  underline="hover"
                  variant="body2"
                  sx={{ display: 'block' }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Contactez-nous
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <MapPin fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Dakar, Sénégal
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Phone fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +221 77 XXX XX XX
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Mail fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  contact@damesarr.sn
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Dame Sarr. Tous droits réservés.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            {[
              { icon: Facebook, label: 'Facebook' },
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
            ].map(({ icon: Icon, label }) => (
              <IconButton
                key={label}
                color="inherit"
                aria-label={label}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Stack>

          <PaymentIcons showLabels={true} />
        </Stack>
      </Container>
    </Box>
  );
}