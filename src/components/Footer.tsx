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
} from '@mui/material';
import {
  LocationOn as MapPin,
  Phone,
  Email as Mail,
  Facebook,
  Instagram,
  Twitter,
  WhatsApp,
} from '@mui/icons-material';
import { PaymentIcons } from './PaymentIcons';
import { alpha } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryItem {
  id?: string;
  label: string;
}

// ─── Données statiques ────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Accueil',   href: '/' },
  { label: 'Boutique',  href: '/shop' },
  { label: 'À propos',  href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

const CATEGORIES: CategoryItem[] = [
  { id: '1', label: 'Meubles' },
  { id: '2', label: 'Décoration' },
  { id: '3', label: 'Luminaires' },
  { id: '4', label: 'Textile' },
];

const CONTACT_ITEMS = [
  { icon: <MapPin sx={{ fontSize: 15 }} />, label: 'Adresse',   value: 'Dakar, Sénégal' },
  { icon: <Phone  sx={{ fontSize: 15 }} />, label: 'Téléphone', value: '+221 77 XXX XX XX' },
  { icon: <Mail   sx={{ fontSize: 15 }} />, label: 'Email',     value: 'contact@damesarr.sn' },
];

const PAYMENT_METHODS = ['Wave', 'Orange Money', 'PayPal', 'Espèces'];

const SOCIALS = [
  { Icon: Facebook,  label: 'Facebook',  href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Twitter,   label: 'Twitter',   href: '#' },
  { Icon: WhatsApp,  label: 'WhatsApp',  href: '#' },
];

const LEGAL_LINKS = ['Mentions légales', 'CGV', 'Confidentialité'];

// ─── Component ────────────────────────────────────────────────────────────────

export function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#fff',
        borderTop: '1px solid #E6F1FB',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>

        {/* ── GRILLE 4 COLONNES ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 5, md: 6 },
          }}
        >

          {/* ── Colonne 1 : Brand ── */}
          <Box>
            {/* Logo + nom */}
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: '#185FA5',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                DS
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#042C53', lineHeight: 1.2 }}>
                  Dame Sarr
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#888780', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Import-Export
                </Typography>
              </Box>
            </Stack>

            {/* Description */}
            <Typography sx={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.75, mb: 2.5, maxWidth: 230 }}>
              Importation de produits de qualité depuis la Chine. Votre partenaire de confiance à Dakar depuis 2020.
            </Typography>

            {/* Coordonnées */}
            <Stack spacing={1.25}>
              {CONTACT_ITEMS.map((item) => (
                <Stack key={item.label} direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ color: '#B5D4F4', display: 'flex', flexShrink: 0 }}>
                    {item.icon}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#5F5E5A' }}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* ── Colonne 2 : Navigation ── */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#042C53',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              Navigation
            </Typography>
            <Stack spacing={1.25}>
              {NAV_LINKS.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  href={link.href}
                  sx={{
                    fontSize: 13,
                    color: '#888780',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    '&:hover': { color: '#185FA5' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* ── Colonne 3 : Catégories ── */}
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#042C53',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                mb: 2.5,
              }}
            >
              Catégories
            </Typography>
            <Stack spacing={1.25}>
              {CATEGORIES.map((cat) => (
                <MuiLink
                  key={cat.id}
                  component={Link}
                  href={`/shop${cat.id ? `?category=${cat.id}` : ''}`}
                  sx={{
                    fontSize: 13,
                    color: '#888780',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    '&:hover': { color: '#185FA5' },
                  }}
                >
                  {cat.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          {/* ── Colonne 4 : Paiement + Compte ── */}
          <Box>
            {/* Paiement */}
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#042C53',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Paiement accepté
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 4 }}>
              {PAYMENT_METHODS.map((m) => (
                <Box
                  key={m}
                  sx={{
                    border: '1px solid #E6F1FB',
                    borderRadius: '5px',
                    px: 1,
                    py: 0.375,
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#5F5E5A',
                    bgcolor: '#F5F9FE',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m}
                </Box>
              ))}
            </Box>

            {/* Mon compte */}
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#042C53',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Mon compte
            </Typography>
            <Stack spacing={1.25}>
              {['Connexion', 'Mes commandes', 'Mes favoris'].map((l) => (
                <MuiLink
                  key={l}
                  component={Link}
                  href="#"
                  sx={{
                    fontSize: 13,
                    color: '#888780',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    '&:hover': { color: '#185FA5' },
                  }}
                >
                  {l}
                </MuiLink>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* ── DIVIDER ── */}
        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: '#E6F1FB' }} />

        {/* ── FOOTER BOTTOM : 3 zones ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* Copyright — gauche */}
          <Typography sx={{ fontSize: 12, color: '#B4B2A9', textAlign: { xs: 'center', md: 'left' } }}>
            © {new Date().getFullYear()} Dame Sarr · Tous droits réservés · Dakar, Sénégal
          </Typography>

          {/* Réseaux sociaux — centre */}
          <Stack direction="row" spacing={0.75} justifyContent="center">
            {SOCIALS.map(({ Icon, label, href }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                aria-label={label}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  border: '1px solid #E6F1FB',
                  borderRadius: '8px',
                  color: '#888780',
                  transition: 'all 0.15s',
                  '&:hover': {
                    color: '#185FA5',
                    borderColor: '#85B7EB',
                    bgcolor: '#F5F9FE',
                  },
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
              </IconButton>
            ))}
          </Stack>

          {/* Liens légaux — droite */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent={{ xs: 'center', md: 'flex-end' }}
          >
            {LEGAL_LINKS.map((l) => (
              <MuiLink
                key={l}
                component={Link}
                href="#"
                sx={{
                  fontSize: 12,
                  color: '#B4B2A9',
                  textDecoration: 'none',
                  '&:hover': { color: '#185FA5' },
                }}
              >
                {l}
              </MuiLink>
            ))}
          </Stack>
        </Box>

      </Container>
    </Box>
  );
}