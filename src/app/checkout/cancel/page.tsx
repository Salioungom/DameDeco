'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, alpha, useTheme } from '@mui/material';
import {
  ErrorOutlined as ErrorIcon,
  ShoppingBag as ShoppingBagIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

function CheckoutCancelInner() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('order_id');
  const redirectRef = useRef(false);
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!orderId || redirectRef.current) {
      setRedirecting(false);
      return;
    }
    redirectRef.current = true;
    // Le retour « annulé » n'est pas une preuve : on revérifie le statut réel côté backend.
    router.replace(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
  }, [orderId, router]);

  if (redirecting) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  const accent = theme.palette.warning.main;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ pt: 14, pb: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 5 },
            borderRadius: 4,
            border: `1px solid ${alpha(accent, 0.15)}`,
            background: `linear-gradient(135deg, ${alpha(accent, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              mx: 'auto',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(accent, 0.1),
            }}
          >
            <ErrorIcon sx={{ fontSize: 48, color: accent }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Paiement interrompu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            Votre paiement n&apos;a pas été finalisé. Si un montant a été débité, il sera automatiquement
            remboursé. Vous pouvez reprendre le paiement depuis vos commandes.
          </Typography>

          {!orderId && (
            <Alert severity="info" variant="outlined" sx={{ mb: 4, textAlign: 'left' }}>
              Référence de commande introuvable. Consultez vos commandes pour reprendre le paiement.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {orderId && (
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push(`/checkout/finalize?orderId=${encodeURIComponent(orderId)}`)}
                startIcon={<RefreshIcon />}
                sx={{ flex: 1, borderRadius: 2, py: 1.5, fontWeight: 700 }}
              >
                Réessayer le paiement
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/account/orders')}
              startIcon={<ShoppingBagIcon />}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, fontWeight: 600 }}
            >
              Voir mes commandes
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={48} />
        </Box>
      }
    >
      <CheckoutCancelInner />
    </Suspense>
  );
}
