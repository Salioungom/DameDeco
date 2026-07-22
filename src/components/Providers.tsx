'use client';

import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import { Navigation, NAVBAR_HEIGHT } from './Navigation';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { Toaster } from 'sonner';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { cartLog } from '@/lib/cart-logger';

interface ProvidersProps {
  children: React.ReactNode;
}

function CartInitializer() {
  const { loadCart, initGuestSession, flushOfflineQueue } = useStore();

  useEffect(() => {
    const init = async () => {
      await initGuestSession();
      await loadCart();
    };
    init();

    // ─── Sync on window focus ─────────────────────────────────────────
    const onFocus = () => {
      cartLog('Window focused — syncing cart');
      loadCart(true);
    };

    // ─── Sync on back online ──────────────────────────────────────────
    const onOnline = () => {
      cartLog('Network restored — flushing offline queue');
      flushOfflineQueue();
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onOnline);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onOnline);
    };
  }, [loadCart, initGuestSession, flushOfflineQueue]);

  return null;
}

function FavoritesInitializer() {
  const { loadFavorites, setUser } = useStore();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const storeUser = {
        id: user.id,
        name: user.full_name,
        email: user.email || '',
        role: user.role,
        type: 'retail' as const,
        avatar: user.avatar,
        phone: user.phone,
      };
      setUser(storeUser);
      loadFavorites();
    } else if (!isAuthenticated) {
      setUser(null);
    }
  }, [isAuthenticated, user, loadFavorites, setUser]);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={4000}
    >
      <CartInitializer />
      <FavoritesInitializer />
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
            pt: isAuthPage ? 0 : `${NAVBAR_HEIGHT}px`,
          }}
        >
          {children}
        </Box>
        {!isAuthPage && <Footer />}
        <CartDrawer />
        <Toaster />
      </Box>
    </SnackbarProvider>
  );
}
