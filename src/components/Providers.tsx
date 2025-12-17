'use client';

import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

import { usePathname } from 'next/navigation';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

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
          {!isAuthPage && <Navigation />}
          <Box
            component="main"
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
              pt: isAuthPage ? 0 : { xs: 8, md: 9 }, // Compensation pour header fixe
            }}
          >
            {children}
          </Box>
          {!isAuthPage && <Footer />}
          <CartDrawer />
          <Toaster />
        </Box>
      </SnackbarProvider>
    </AuthProvider>
  );
}

