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
  Button,
  alpha,
} from '@mui/material';
import {
  LocationOn as MapPin,
  Phone,
  Email as Mail,
  Facebook,
  Instagram,
  Twitter,
  WhatsApp,
  ArrowForward,
} from '@mui/icons-material';
import { PaymentIcons } from './PaymentIcons';

const PRIMARY = '#042C53';
const ACCENT = '#185FA5';
const LIGHT = '#85B7EB';
const MUTED = alpha('#fff', 0.65);
const SOFT = alpha('#fff', 0.08);

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Boutique', href: '/shop' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const CATEGORIES = [
  { id: '1', label: 'Meubles' },
  { id: '2', label: 'Décoration' },
  { id: '3', label: 'Luminaires' },
  { id: '4', label: 'Textile' },
];

const ACCOUNT_LINKS = [
  { label: 'Connexion', href: '/login' },
  { label: 'Mes commandes', href: '/account/orders' },
  { label: 'Mes favoris', href: '/favorites' },
];

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: WhatsApp, label: 'WhatsApp', href: '#' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', href: '#' },
  { label: 'CGV', href: '#' },
  { label: 'Confidentialité', href: '#' },
];

const linkSx = {
  fontSize: 17.5,
  color: MUTED,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  display: 'block',
  '&:hover': { color: '#fff' },
};

const headingSx = {
  fontSize: 13.75,
  fontWeight: 700,
  color: LIGHT,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  mb: 2.5,
};

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: PRIMARY,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 80% at 100% 0%, ${alpha(ACCENT, 0.35)} 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 0% 100%, ${alpha(LIGHT, 0.12)} 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Bandeau CTA */}
        
        {/* Grille principale */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: '1.4fr 1fr 1fr 1.2fr' },
            gap: { xs: 4, md: 5 },
            py: { xs: 5, md: 7 },
          }}
        >
          {/* Brand */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  borderRadius: '15px',
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${LIGHT} 100%)`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17.5,
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: `0 8px 24px ${alpha('#000', 0.25)}`,
                }}
              >
                DS
              </Box>
              <Box>
                <Typography sx={{ fontSize: 21.25, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  Dame Sarr
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: LIGHT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Import & Commerce
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ fontSize: 17.5, color: MUTED, lineHeight: 1.75, mb: 3, maxWidth: 350 }}>
              Importation de produits premium depuis la Chine. Votre partenaire de confiance à Dakar depuis 2010.
            </Typography>

            <Stack spacing={1.5}>
              {[
                { icon: <MapPin sx={{ fontSize: 21.25 }} />, value: 'Dakar, Sénégal' },
                { icon: <Phone sx={{ fontSize: 21.25 }} />, value: '+221 77 XXX XX XX' },
                { icon: <Mail sx={{ fontSize: 21.25 }} />, value: 'contact@damesarr.sn' },
              ].map((item) => (
                <Stack key={item.value} direction="row" alignItems="center" spacing={1.25}>
                  <Box sx={{ color: LIGHT, display: 'flex', flexShrink: 0 }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: 16.25, color: alpha('#fff', 0.8) }}>{item.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Navigation */}
          <Box>
            <Typography sx={headingSx}>Navigation</Typography>
            <Stack spacing={1.5}>
              {NAV_LINKS.map((link) => (
                <MuiLink key={link.label} component={Link} href={link.href} sx={linkSx}>
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Catégories */}
          <Box>
            <Typography sx={headingSx}>Catégories</Typography>
            <Stack spacing={1.5}>
              {CATEGORIES.map((cat) => (
                <MuiLink
                  key={cat.id}
                  component={Link}
                  href={`/shop?category=${cat.id}`}
                  sx={linkSx}
                >
                  {cat.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* Compte + paiement */}
          <Box>
            <Typography sx={headingSx}>Mon compte</Typography>
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              {ACCOUNT_LINKS.map((link) => (
                <MuiLink key={link.label} component={Link} href={link.href} sx={linkSx}>
                  {link.label}
                </MuiLink>
              ))}
            </Stack>

            <Typography sx={{ ...headingSx, mb: 2 }}>Paiement accepté</Typography>
            <Box
              sx={{
                '& img': { filter: 'brightness(1.1)' },
                '& > div': { gap: 1 },
              }}
            >
              <PaymentIcons size="sm" />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: SOFT }} />

        {/* Bas de page */}
        <Box
          sx={{
            py: { xs: 3, md: 4 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: { xs: 2.5, md: 2 },
          }}
        >
          <Typography sx={{ fontSize: 15, color: alpha('#fff', 0.45), textAlign: { xs: 'center', md: 'left' } }}>
            © {new Date().getFullYear()} Dame Sarr · Tous droits réservés · Dakar, Sénégal
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center">
            {SOCIALS.map(({ Icon, label, href }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                aria-label={label}
                size="small"
                sx={{
                  width: 47.5,
                  height: 47.5,
                  borderRadius: '12.5px',
                  border: `1px solid ${SOFT}`,
                  color: alpha('#fff', 0.75),
                  bgcolor: alpha('#fff', 0.04),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: ACCENT,
                    borderColor: ACCENT,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Icon sx={{ fontSize: 22.5 }} />
              </IconButton>
            ))}
          </Stack>

          <Stack direction="row" spacing={2.5} justifyContent={{ xs: 'center', md: 'flex-end' }} flexWrap="wrap">
            {LEGAL_LINKS.map((l) => (
              <MuiLink key={l.label} component={Link} href={l.href} sx={{ ...linkSx, fontSize: 15 }}>
                {l.label}
              </MuiLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
