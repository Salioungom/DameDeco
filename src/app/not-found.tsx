'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button, alpha, Stack } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { BRAND_BLUE } from '@/theme';

const BRAND = {
  primary: BRAND_BLUE,
  dark: '#042C53',
  white: '#FFFFFF',
  light: '#E6F1FB',
  surface: '#F5F9FE',
  border: '#D4E8F7',
  muted: '#5F6B7A',
} as const;

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primary} 60%, ${BRAND.dark} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative floating circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: alpha(BRAND.white, 0.04),
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: alpha(BRAND.white, 0.03),
          animation: 'float 10s ease-in-out infinite 2s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '10%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          bgcolor: alpha(BRAND.white, 0.025),
          animation: 'float 7s ease-in-out infinite 1s',
        }}
      />

      {/* Content card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: { xs: 3, sm: 4 },
          maxWidth: 520,
          width: '100%',
        }}
      >
        {/* Big 404 number */}
        <Typography
          sx={{
            fontSize: { xs: 120, sm: 160, md: 200 },
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: alpha(BRAND.white, 0.9),
            textShadow: `0 4px 40px ${alpha(BRAND.dark, 0.4)}`,
            mb: 1,
            animation: 'slideUp 0.6s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          404
        </Typography>

        {/* Divider line */}
        <Box
          sx={{
            width: 64,
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(BRAND.white, 0.5),
            mx: 'auto',
            mb: 3,
            animation: 'slideUp 0.6s ease-out 0.15s both',
          }}
        />

        {/* Title */}
        <Typography
          sx={{
            fontSize: { xs: 22, sm: 26 },
            fontWeight: 700,
            color: BRAND.white,
            mb: 1.5,
            animation: 'slideUp 0.6s ease-out 0.2s both',
          }}
        >
          Page introuvable
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: { xs: 14, sm: 15 },
            color: alpha(BRAND.white, 0.7),
            lineHeight: 1.7,
            mb: 4,
            animation: 'slideUp 0.6s ease-out 0.3s both',
          }}
        >
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </Typography>

        {/* Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              py: 1.5,
              px: 3.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              bgcolor: BRAND.white,
              color: BRAND.dark,
              boxShadow: `0 8px 32px ${alpha(BRAND.dark, 0.25)}`,
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: BRAND.light,
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 40px ${alpha(BRAND.dark, 0.3)}`,
              },
            }}
          >
            Retour
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            href="/"
            sx={{
              py: 1.5,
              px: 3.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              color: alpha(BRAND.white, 0.9),
              borderColor: alpha(BRAND.white, 0.3),
              transition: 'all 0.25s ease',
              '&:hover': {
                borderColor: BRAND.white,
                bgcolor: alpha(BRAND.white, 0.1),
                transform: 'translateY(-2px)',
              },
            }}
          >
            Accueil
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
