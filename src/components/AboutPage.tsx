'use client';

import {
  VerifiedUser,
  LocalShipping,
  Star,
  Visibility,
  SupportAgent,
  Shield,
  Handshake,
  Lightbulb,
  Groups,
  EmojiEvents,
  TrendingUp,
  WorkspacePremium,
  ArrowForward,
  Place,
  Phone,
  Email,
  CheckCircle,
  Diamond,
  Spa,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Avatar,
  alpha,
} from '@mui/material';
import { useRouter } from 'next/navigation';

// ─── Palette (unchanged) ──────────────────────────────────────────────────────
const C = {
  primary: '#185FA5',
  dark:    '#042C53',
  light:   '#E6F1FB',
  surface: '#F5F9FE',
  border:  '#E6F1FB',
  mid:     '#85B7EB',
  muted:   '#888780',
  text:    '#5F5E5A',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: '2010', title: "Création de l'entreprise", desc: "Dame Sarr débute l'importation avec une vision claire : offrir des produits de qualité accessibles à Dakar.", icon: <EmojiEvents sx={{ fontSize: 16 }} /> },
  { year: '2015', title: 'Expansion de la gamme', desc: 'Diversification vers la literie, les meubles et la décoration. Premier partenariat majeur avec des fournisseurs certifiés en Chine.', icon: <TrendingUp sx={{ fontSize: 16 }} /> },
  { year: '2020', title: 'Croissance & showroom', desc: '5 000+ clients satisfaits. Ouverture d\'un showroom moderne à Dakar et développement de l\'activité grossiste.', icon: <WorkspacePremium sx={{ fontSize: 16 }} /> },
  { year: '2024', title: 'Excellence & e-commerce', desc: 'Lancement de la plateforme en ligne. Livraison express dans tout le Sénégal et service client 6j/7.', icon: <Groups sx={{ fontSize: 16 }} /> },
];

const VALUES = [
  { icon: <Shield sx={{ fontSize: 20 }} />,      title: 'Qualité garantie',           desc: 'Chaque produit est rigoureusement sélectionné chez des fournisseurs certifiés avant d\'être proposé à la vente.' },
  { icon: <Handshake sx={{ fontSize: 20 }} />,   title: 'Accompagnement dédié',       desc: 'Un suivi personnalisé à chaque étape — de la commande à la livraison, nous sommes à vos côtés.' },
  { icon: <Lightbulb sx={{ fontSize: 20 }} />,   title: 'Innovation continue',        desc: 'Nous améliorons constamment nos services pour vous offrir la meilleure expérience d\'achat.' },
  { icon: <VerifiedUser sx={{ fontSize: 20 }} />, title: 'Confiance & transparence',  desc: 'Prix clairs, politique de retour simple, et communication honnête à chaque interaction.' },
  { icon: <LocalShipping sx={{ fontSize: 20 }} />, title: 'Livraison rapide',         desc: 'Expédition express 24–48h sur Dakar et banlieue avec suivi en temps réel de votre colis.' },
  { icon: <SupportAgent sx={{ fontSize: 20 }} />, title: 'Support réactif',           desc: 'Une équipe disponible du lundi au samedi pour répondre à toutes vos questions et vous conseiller.' },
];

const TEAM = [
  { name: 'Dame Sarr',     role: 'Fondatrice & CEO',              initials: 'DS', color: C.primary },
  { name: 'Aminata Diop',  role: 'Directrice des Opérations',     initials: 'AD', color: '#0C6E4F' },
  { name: 'Moussa Ndiaye', role: 'Responsable Logistique',        initials: 'MN', color: '#7C3AED' },
  { name: 'Fatou Seck',    role: 'Responsable Service Client',    initials: 'FS', color: '#B45309' },
];

const STATS = [
  { num: '14+',   label: "Années d'expérience" },
  { num: '5 000+', label: 'Clients satisfaits' },
  { num: '1 200+', label: 'Produits disponibles' },
  { num: '6j/7',  label: 'Support client' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', width: '100%' }}>

      {/* ══════════════════════════════════════════
          1. HERO — premium split layout
      ══════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: C.surface,
          borderBottom: `1px solid ${C.border}`,
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20px 20px, ${alpha(C.primary, 0.04)} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Decorative blur orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-120px',
            right: '-80px',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(C.primary, 0.08)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-100px',
            left: '-60px',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(C.primary, 0.05)} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 10 },
              alignItems: 'center',
            }}
          >
            {/* ─── Left: Text ─── */}
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: alpha(C.primary, 0.08),
                  border: `1px solid ${alpha(C.primary, 0.15)}`,
                  borderRadius: '20px',
                  px: 1.5,
                  py: 0.5,
                  mb: 3,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e' }} />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Depuis 2010 · Dakar, Sénégal
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
                  fontWeight: 800,
                  color: C.dark,
                  lineHeight: 1.05,
                  letterSpacing: '-0.035em',
                  mb: 2.5,
                }}
              >
                L'excellence de{' '}
                <Box
                  component="span"
                  sx={{
                    color: C.primary,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 2,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: alpha(C.primary, 0.15),
                      borderRadius: '2px',
                    },
                  }}
                >
                  l'importation
                </Box>{' '}
                au Sénégal
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 14, md: 15 },
                  color: C.text,
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Dame Sarr Import & Commerce sélectionne et importe des produits premium depuis la Chine — meubles, décoration, textile — pour les particuliers et professionnels au Sénégal.
              </Typography>

              <Stack spacing={1.25} sx={{ mb: 4 }}>
                {['Fournisseurs certifiés en Chine', 'Livraison express 24–48h à Dakar', 'Tarifs grossiste pour les professionnels'].map((pt) => (
                  <Stack key={pt} direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: alpha(C.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 12, color: C.primary }} />
                    </Box>
                    <Typography sx={{ fontSize: 13, color: C.text }}>{pt}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/shop')}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: C.primary,
                    color: '#fff',
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: `0 4px 16px ${alpha(C.primary, 0.25)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: C.dark,
                      boxShadow: `0 6px 24px ${alpha(C.primary, 0.35)}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Voir la boutique
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/contact')}
                  sx={{
                    borderColor: C.border,
                    color: C.primary,
                    borderRadius: '10px',
                    px: 3.5,
                    py: 1.5,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(C.primary, 0.05),
                      borderColor: C.primary,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Nous contacter
                </Button>
              </Stack>
            </Box>

            {/* ─── Right: Stats cards ─── */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1.5,
              }}
            >
              {STATS.map((s, i) => (
                <Box
                  key={s.label}
                  sx={{
                    borderRadius: '16px',
                    p: { xs: 2.5, md: 3.5 },
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    cursor: 'default',
                    ...(i === 0
                      ? {
                          bgcolor: C.dark,
                          boxShadow: `0 8px 32px ${alpha(C.dark, 0.25)}`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 40px ${alpha(C.dark, 0.35)}`,
                          },
                        }
                      : {
                          bgcolor: '#fff',
                          border: `1px solid ${C.border}`,
                          boxShadow: `0 2px 12px ${alpha(C.dark, 0.04)}`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: alpha(C.primary, 0.2),
                            boxShadow: `0 8px 28px ${alpha(C.dark, 0.08)}`,
                          },
                        }),
                    '&::after': i === 0
                      ? {
                          content: '""',
                          position: 'absolute',
                          top: '-40%',
                          right: '-20%',
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${alpha('#fff', 0.06)} 0%, transparent 70%)`,
                          pointerEvents: 'none',
                        }
                      : undefined,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontWeight: 800,
                      color: i === 0 ? '#fff' : C.dark,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {s.num}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: i === 0 ? alpha('#fff', 0.7) : C.muted, fontWeight: 500 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          2. QUI SOMMES-NOUS — refined
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 12 },
              alignItems: 'start',
            }}
          >
            {/* Gauche */}
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box sx={{ width: 28, height: 2, bgcolor: C.primary, borderRadius: '1px' }} />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Qui sommes-nous
                </Typography>
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 22, md: 30 },
                  fontWeight: 700,
                  color: C.dark,
                  letterSpacing: '-0.4px',
                  mb: 3,
                }}
              >
                Notre raison d'être
              </Typography>
              <Typography sx={{ fontSize: 14, color: C.text, lineHeight: 1.85, mb: 2.5 }}>
                Depuis 2010, Dame Sarr Import & Commerce s'est imposée comme le partenaire de référence pour l'importation de produits de qualité au Sénégal. Nous travaillons directement avec des fournisseurs certifiés en Chine pour garantir les meilleurs prix et standards de qualité.
              </Typography>
              <Typography sx={{ fontSize: 14, color: C.text, lineHeight: 1.85 }}>
                Notre mission : rendre accessibles des produits premium à tous, particuliers comme professionnels, grâce à une logistique maîtrisée et un service client de proximité basé à Dakar.
              </Typography>
            </Box>

            {/* Droite */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: <Place sx={{ fontSize: 17 }} />,  label: 'Adresse',   value: 'Dakar, Sénégal' },
                { icon: <Phone sx={{ fontSize: 17 }} />,  label: 'Téléphone', value: '+221 77 XXX XX XX' },
                { icon: <Email sx={{ fontSize: 17 }} />,  label: 'Email',     value: 'contact@damesarr.sn' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: '12px',
                    px: 2.5,
                    py: 2,
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    '&:hover': {
                      borderColor: alpha(C.primary, 0.2),
                      boxShadow: `0 4px 16px ${alpha(C.dark, 0.06)}`,
                      transform: 'translateX(3px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      bgcolor: alpha(C.primary, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: C.primary,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: C.muted, mb: 0.25 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          3. VALEURS — premium cards
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: C.surface }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: C.primary,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Notre engagement
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 22, md: 30 },
                fontWeight: 700,
                color: C.dark,
                letterSpacing: '-0.4px',
              }}
            >
              Nos valeurs fondamentales
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {VALUES.map((v) => (
              <Box
                key={v.title}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: '16px',
                  p: { xs: 3, md: 4 },
                  border: `1px solid ${C.border}`,
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.primary}, ${alpha(C.primary, 0.3)})`,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: alpha(C.primary, 0.15),
                    boxShadow: `0 12px 40px ${alpha(C.dark, 0.06)}`,
                    '&::before': { opacity: 1 },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${alpha(C.primary, 0.1)} 0%, ${alpha(C.primary, 0.03)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    color: C.primary,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {v.icon}
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.dark,
                    mb: 1,
                  }}
                >
                  {v.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: C.text, lineHeight: 1.75 }}>
                  {v.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          4. TIMELINE — premium history
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: C.primary,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Notre parcours
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 22, md: 30 },
                fontWeight: 700,
                color: C.dark,
                letterSpacing: '-0.4px',
              }}
            >
              14 ans d'excellence
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', maxWidth: 760, mx: 'auto' }}>
            {/* Vertical line */}
            <Box
              sx={{
                position: 'absolute',
                left: 24,
                top: 24,
                bottom: 24,
                width: 2,
                background: `linear-gradient(180deg, ${C.primary} 0%, ${alpha(C.primary, 0.15)} 100%)`,
                display: { xs: 'none', sm: 'block' },
              }}
            />

            {TIMELINE.map((ev, i) => (
              <Box
                key={ev.year}
                sx={{
                  display: 'flex',
                  gap: { xs: 2.5, sm: 4 },
                  alignItems: 'flex-start',
                  pb: i < TIMELINE.length - 1 ? 4 : 0,
                  position: 'relative',
                }}
              >
                {/* Dot */}
                <Box
                  sx={{
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.primary}, ${alpha(C.primary, 0.7)})`,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `3px solid ${alpha(C.primary, 0.15)}`,
                      boxShadow: `0 4px 16px ${alpha(C.primary, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 6px 24px ${alpha(C.primary, 0.3)}`,
                      },
                    }}
                  >
                    {ev.icon}
                  </Box>
                </Box>

                {/* Content */}
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: '14px',
                    p: 3,
                    mt: 0.75,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha(C.primary, 0.15),
                      boxShadow: `0 8px 28px ${alpha(C.dark, 0.06)}`,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: C.primary,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        px: 1.25,
                        py: 0.375,
                        borderRadius: '6px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {ev.year}
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.dark }}>
                      {ev.title}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: C.text, lineHeight: 1.75 }}>
                    {ev.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          5. ÉQUIPE — premium cards
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: C.surface }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: C.primary,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Notre équipe
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 22, md: 30 },
                fontWeight: 700,
                color: C.dark,
                letterSpacing: '-0.4px',
              }}
            >
              Les artisans de votre satisfaction
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2.5,
            }}
          >
            {TEAM.map((member) => (
              <Box
                key={member.name}
                sx={{
                  bgcolor: '#fff',
                  border: `1px solid ${C.border}`,
                  borderRadius: '16px',
                  p: 3.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.4s ease',
                  cursor: 'default',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: alpha(member.color, 0.3),
                    boxShadow: `0 12px 36px ${alpha(member.color, 0.1)}`,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    background: `linear-gradient(135deg, ${member.color}, ${alpha(member.color, 0.6)})`,
                    fontSize: 22,
                    fontWeight: 700,
                    mb: 2.5,
                    boxShadow: `0 4px 16px ${alpha(member.color, 0.2)}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {member.initials}
                </Avatar>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.dark, mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: C.primary, fontWeight: 500 }}>
                  {member.role}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          6. CTA FINAL — elevated
      ══════════════════════════════════════════ */}
      <Box
        sx={{
          mx: { xs: 2, sm: 4, md: 6 },
          my: 8,
          bgcolor: C.dark,
          borderRadius: '20px',
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 9 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 16px 48px ${alpha(C.dark, 0.2)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(C.primary, 0.2)} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-80px',
            left: '-40px',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(C.primary, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: alpha(C.mid, 0.8),
              mb: 1.5,
            }}
          >
            Prêt à commander ?
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              mb: 1.5,
            }}
          >
            Découvrez notre catalogue
          </Typography>
          <Typography sx={{ fontSize: 14, color: alpha('#fff', 0.7), lineHeight: 1.75, maxWidth: 420 }}>
            Parcourez plus de 1 200 produits importés directement pour vous, à des prix compétitifs.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/shop')}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#fff',
              color: C.dark,
              fontWeight: 700,
              fontSize: 13,
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha('#fff', 0.9),
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Visiter la boutique
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/contact')}
            sx={{
              borderColor: alpha('#fff', 0.3),
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              px: 3.5,
              py: 1.5,
              borderRadius: '10px',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha('#fff', 0.06),
                borderColor: alpha('#fff', 0.6),
                transform: 'translateY(-1px)',
              },
            }}
          >
            Nous contacter
          </Button>
        </Stack>
      </Box>

    </Box>
  );
}