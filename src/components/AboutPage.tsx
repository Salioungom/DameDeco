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
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';

// ─── Palette ──────────────────────────────────────────────────────────────────
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
  { year: '2010', title: "Création de l'entreprise", desc: "Dame Sarr débute l'importation avec une vision claire : offrir des produits de qualité accessibles à Dakar.", icon: <EmojiEvents sx={{ fontSize: 18 }} /> },
  { year: '2015', title: 'Expansion de la gamme', desc: 'Diversification vers la literie, les meubles et la décoration. Premier partenariat majeur avec des fournisseurs certifiés en Chine.', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
  { year: '2020', title: 'Croissance & showroom', desc: '5 000+ clients satisfaits. Ouverture d\'un showroom moderne à Dakar et développement de l\'activité grossiste.', icon: <WorkspacePremium sx={{ fontSize: 18 }} /> },
  { year: '2024', title: 'Excellence & e-commerce', desc: 'Lancement de la plateforme en ligne. Livraison express dans tout le Sénégal et service client 6j/7.', icon: <Groups sx={{ fontSize: 18 }} /> },
];

const VALUES = [
  { icon: <Shield sx={{ fontSize: 22, color: C.primary }} />,      title: 'Qualité garantie',           desc: 'Chaque produit est rigoureusement sélectionné chez des fournisseurs certifiés avant d\'être proposé à la vente.' },
  { icon: <Handshake sx={{ fontSize: 22, color: C.primary }} />,   title: 'Accompagnement dédié',       desc: 'Un suivi personnalisé à chaque étape — de la commande à la livraison, nous sommes à vos côtés.' },
  { icon: <Lightbulb sx={{ fontSize: 22, color: C.primary }} />,   title: 'Innovation continue',        desc: 'Nous améliorons constamment nos services pour vous offrir la meilleure expérience d\'achat.' },
  { icon: <VerifiedUser sx={{ fontSize: 22, color: C.primary }} />, title: 'Confiance & transparence',  desc: 'Prix clairs, politique de retour simple, et communication honnête à chaque interaction.' },
  { icon: <LocalShipping sx={{ fontSize: 22, color: C.primary }} />, title: 'Livraison rapide',         desc: 'Expédition express 24–48h sur Dakar et banlieue avec suivi en temps réel de votre colis.' },
  { icon: <SupportAgent sx={{ fontSize: 22, color: C.primary }} />, title: 'Support réactif',           desc: 'Une équipe disponible du lundi au samedi pour répondre à toutes vos questions et vous conseiller.' },
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
          1. HERO — split layout
      ══════════════════════════════════════════ */}
      <Box
        sx={{
          bgcolor: C.surface,
          borderBottom: `1px solid ${C.border}`,
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 10 },
              alignItems: 'center',
            }}
          >
            {/* Texte gauche */}
            <Box>
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  bgcolor: C.light, border: `1px solid ${C.border}`,
                  borderRadius: '20px', px: 1.5, py: 0.5, mb: 3,
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e' }} />
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#0C447C', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Depuis 2010 · Dakar, Sénégal
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' },
                  fontWeight: 800,
                  color: C.dark,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  mb: 2.5,
                }}
              >
                L'excellence de{' '}
                <Box component="span" sx={{ color: C.primary }}>
                  l'importation
                </Box>{' '}
                au Sénégal
              </Typography>

              <Typography sx={{ fontSize: { xs: 14, md: 15 }, color: C.text, lineHeight: 1.8, mb: 4, maxWidth: 500 }}>
                Dame Sarr Import & Commerce sélectionne et importe des produits premium depuis la Chine — meubles, décoration, textile — pour les particuliers et professionnels au Sénégal.
              </Typography>

              {/* Points clés */}
              <Stack spacing={1.25} sx={{ mb: 4 }}>
                {['Fournisseurs certifiés en Chine', 'Livraison express 24–48h à Dakar', 'Tarifs grossiste pour les professionnels'].map((pt) => (
                  <Stack key={pt} direction="row" spacing={1} alignItems="center">
                    <CheckCircle sx={{ fontSize: 16, color: C.primary, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: C.text }}>{pt}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                <Button
                  variant="contained"
                  onClick={() => router.push('/shop')}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: C.primary, color: '#fff', borderRadius: '9px',
                    px: 3.5, py: 1.375, fontSize: 13, fontWeight: 700,
                    textTransform: 'none', boxShadow: 'none',
                    '&:hover': { bgcolor: C.dark, boxShadow: 'none' },
                  }}
                >
                  Voir la boutique
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/contact')}
                  sx={{
                    borderColor: C.border, color: C.primary, borderRadius: '9px',
                    px: 3, py: 1.375, fontSize: 13, fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { bgcolor: C.light, borderColor: C.mid },
                  }}
                >
                  Nous contacter
                </Button>
              </Stack>
            </Box>

            {/* Stats droite */}
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
                    bgcolor: '#fff',
                    border: `1px solid ${C.border}`,
                    borderRadius: '14px',
                    p: { xs: 2.5, md: 3 },
                    // première carte légèrement en relief
                    ...(i === 0 && {
                      bgcolor: C.dark,
                    }),
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontWeight: 800,
                      color: i === 0 ? '#fff' : C.dark,
                      letterSpacing: '-1px',
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {s.num}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: i === 0 ? 'rgba(255,255,255,0.7)' : C.muted }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          2. QUI SOMMES-NOUS — texte + infos
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 10 },
              alignItems: 'start',
            }}
          >
            {/* Gauche — texte */}
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase', mb: 1.5 }}>
                Qui sommes-nous
              </Typography>
              <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px', mb: 2 }}>
                Notre raison d'être
              </Typography>
              <Typography sx={{ fontSize: 14, color: C.text, lineHeight: 1.85, mb: 3 }}>
                Depuis 2010, Dame Sarr Import & Commerce s'est imposée comme le partenaire de référence pour l'importation de produits de qualité au Sénégal. Nous travaillons directement avec des fournisseurs certifiés en Chine pour garantir les meilleurs prix et standards de qualité.
              </Typography>
              <Typography sx={{ fontSize: 14, color: C.text, lineHeight: 1.85 }}>
                Notre mission : rendre accessibles des produits premium à tous, particuliers comme professionnels, grâce à une logistique maîtrisée et un service client de proximité basé à Dakar.
              </Typography>
            </Box>

            {/* Droite — contact info + engagement */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: <Place sx={{ fontSize: 17, color: C.primary }} />,  label: 'Adresse',   value: 'Dakar, Sénégal' },
                { icon: <Phone sx={{ fontSize: 17, color: C.primary }} />,  label: 'Téléphone', value: '+221 77 XXX XX XX' },
                { icon: <Email sx={{ fontSize: 17, color: C.primary }} />,  label: 'Email',     value: 'contact@damesarr.sn' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    bgcolor: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: '10px', px: 2, py: 1.5,
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: '8px', bgcolor: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: C.muted }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{item.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════════
          3. VALEURS — grille flush 3 colonnes
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: C.surface }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase', mb: 1 }}>
              Notre engagement
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}>
              Nos valeurs fondamentales
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            {VALUES.map((v, i) => (
              <Box
                key={v.title}
                sx={{
                  bgcolor: '#fff',
                  p: { xs: 3, md: 3.5 },
                  borderRight: {
                    xs: 'none',
                    sm: i % 2 === 0 ? `1px solid ${C.border}` : 'none',
                    md: i % 3 !== 2 ? `1px solid ${C.border}` : 'none',
                  },
                  borderBottom: {
                    xs: i < VALUES.length - 1 ? `1px solid ${C.border}` : 'none',
                    sm: i < VALUES.length - 2 ? `1px solid ${C.border}` : 'none',
                    md: i < VALUES.length - 3 ? `1px solid ${C.border}` : 'none',
                  },
                }}
              >
                <Box sx={{ width: 44, height: 44, bgcolor: C.light, borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {v.icon}
                </Box>
                <Typography component="h3" sx={{ fontSize: 14, fontWeight: 600, color: C.dark, mb: 0.875 }}>
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
          4. TIMELINE — notre histoire
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase', mb: 1 }}>
              Notre parcours
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}>
              14 ans d'excellence
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Ligne verticale */}
            <Box sx={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 1, bgcolor: C.border, display: { xs: 'none', sm: 'block' } }} />

            {TIMELINE.map((ev, i) => (
              <Box
                key={ev.year}
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3 },
                  alignItems: 'flex-start',
                  pb: i < TIMELINE.length - 1 ? 4 : 0,
                }}
              >
                {/* Dot + année */}
                <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{
                      width: 40, height: 40,
                      borderRadius: '50%',
                      bgcolor: C.primary,
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `3px solid ${C.light}`,
                    }}
                  >
                    {ev.icon}
                  </Box>
                </Box>

                {/* Contenu */}
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: '12px',
                    p: 2.5,
                    mt: 0.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                    <Box sx={{ bgcolor: C.light, color: C.primary, fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: '5px', letterSpacing: '0.5px' }}>
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
          5. ÉQUIPE
      ══════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: C.surface }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase', mb: 1 }}>
              Notre équipe
            </Typography>
            <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}>
              Les artisans de votre satisfaction
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {TEAM.map((member) => (
              <Box
                key={member.name}
                sx={{
                  bgcolor: '#fff',
                  border: `1px solid ${C.border}`,
                  borderRadius: '14px',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'border-color 0.15s',
                  '&:hover': { borderColor: C.mid },
                }}
              >
                <Avatar
                  sx={{
                    width: 64, height: 64,
                    bgcolor: member.color,
                    fontSize: 20, fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {member.initials}
                </Avatar>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.dark, mb: 0.375 }}>
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
          6. CTA FINAL
      ══════════════════════════════════════════ */}
      <Box
        sx={{
          mx: { xs: 2, sm: 4, md: 6 },
          my: 8,
          bgcolor: C.dark,
          borderRadius: '16px',
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 8 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute', top: '-60px', right: '-60px',
            width: 260, height: 260, borderRadius: '50%',
            background: 'rgba(24,95,165,0.25)', filter: 'blur(60px)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: C.mid, mb: 1.5 }}>
            Prêt à commander ?
          </Typography>
          <Typography component="h2" sx={{ fontSize: { xs: 22, md: 30 }, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.4px', mb: 1.5 }}>
            Découvrez notre catalogue
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
            Parcourez plus de 1 200 produits importés directement pour vous, à des prix compétitifs.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/shop')}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#fff', color: C.dark, fontWeight: 700, fontSize: 13,
              px: 3.5, py: 1.5, borderRadius: '9px', textTransform: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', whiteSpace: 'nowrap',
              '&:hover': { bgcolor: C.light, boxShadow: '0 6px 24px rgba(0,0,0,0.2)' },
            }}
          >
            Visiter la boutique
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/contact')}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)', color: '#fff',
              fontWeight: 600, fontSize: 13, px: 3, py: 1.5,
              borderRadius: '9px', textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.5)' },
            }}
          >
            Nous contacter
          </Button>
        </Stack>
      </Box>

    </Box>
  );
}