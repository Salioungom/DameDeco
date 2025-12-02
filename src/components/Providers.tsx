'use client';

import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          <Navigation />
          <Box
            component="main"
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
              pt: { xs: 8, md: 9 }, // Compensation pour header fixe
            }}
          >
            {children}
          </Box>
          <Footer />
          <CartDrawer />
          <Toaster />
        </Box>
      </SnackbarProvider>
    </AuthProvider>
  );
}

