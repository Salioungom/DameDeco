'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  InputBase,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  ShoppingCartOutlined,
  PersonOutline,
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AdminPanelSettingsOutlined,
  DashboardOutlined,
  LogoutOutlined,
  AccountCircleOutlined,
  FavoriteBorder,
  StorefrontOutlined,
  HomeOutlined,
  InfoOutlined,
  MailOutline,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';

/** Hauteur fixe de la navbar — utilisée pour le padding du layout */
export const NAVBAR_HEIGHT = 72;

const ACTION_SIZE = 40;
const ICON_SIZE = 22;

type NavItem = { label: string; path: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', path: '/', icon: <HomeOutlined sx={{ fontSize: ICON_SIZE }} /> },
  { label: 'Boutique', path: '/shop', icon: <StorefrontOutlined sx={{ fontSize: ICON_SIZE }} /> },
  { label: 'À propos', path: '/about', icon: <InfoOutlined sx={{ fontSize: ICON_SIZE }} /> },
  { label: 'Contact', path: '/contact', icon: <MailOutline sx={{ fontSize: ICON_SIZE }} /> },
];

/** Bouton d'action à taille fixe — évite tout décalage au clic / hover */
const NavActionButton = memo(function NavActionButton({
  children,
  onClick,
  href,
  ariaLabel,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  ariaLabel: string;
  active?: boolean;
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const sx = {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    minWidth: ACTION_SIZE,
    minHeight: ACTION_SIZE,
    p: 0,
    borderRadius: '12px',
    border: `1px solid ${alpha(primary, 0.12)}`,
    bgcolor: active ? alpha(primary, 0.08) : 'transparent',
    color: active ? primary : theme.palette.text.secondary,
    flexShrink: 0,
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      bgcolor: alpha(primary, 0.06),
      color: primary,
      borderColor: alpha(primary, 0.25),
    },
    '& .MuiTouchRipple-root': { display: 'none' },
    '&:active': { transform: 'none' },
  };

  if (href) {
    return (
      <IconButton
        component={Link}
        href={href}
        aria-label={ariaLabel}
        disableRipple
        sx={sx}
      >
        {children}
      </IconButton>
    );
  }

  return (
    <IconButton
      aria-label={ariaLabel}
      onClick={onClick}
      disableRipple
      sx={sx}
    >
      {children}
    </IconButton>
  );
});

const Brand = memo(function Brand() {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexShrink: 0 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
        }}
      >
        DS
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          Dame Sarr
        </Typography>
        <Typography
          sx={{
            fontSize: 10,
            color: theme.palette.text.secondary,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Import & Commerce
        </Typography>
      </Box>
    </Stack>
  );
});

const NavLink = memo(function NavLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Button
      component={Link}
      href={item.path}
      disableRipple
      sx={{
        position: 'relative',
        borderRadius: '10px',
        px: 1.75,
        py: 1,
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        textTransform: 'none',
        color: active ? primary : theme.palette.text.secondary,
        bgcolor: 'transparent',
        minWidth: 'auto',
        flexShrink: 0,
        transition: 'color 0.2s ease',
        '&:hover': { bgcolor: alpha(primary, 0.05), color: primary },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
          width: '60%',
          height: 2,
          borderRadius: 1,
          bgcolor: theme.palette.golden?.main ?? primary,
          transition: 'transform 0.25s ease',
        },
        '& .MuiButton-startIcon': {
          mr: 0.75,
          ml: 0,
          '& svg': { fontSize: 18 },
        },
      }}
      startIcon={item.icon}
    >
      {item.label}
    </Button>
  );
});

const SearchField = memo(function SearchField({
  value,
  onChange,
  onSubmit,
  autoFocus,
  fullWidth,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  autoFocus?: boolean;
  fullWidth?: boolean;
}) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ width: fullWidth ? '100%' : { md: 220, lg: 260 } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: ACTION_SIZE,
          px: 1.5,
          borderRadius: '12px',
          bgcolor: alpha(primary, 0.04),
          border: `1px solid ${alpha(primary, 0.1)}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:focus-within': {
            borderColor: alpha(primary, 0.35),
            boxShadow: `0 0 0 3px ${alpha(primary, 0.08)}`,
          },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: alpha(primary, 0.5), flexShrink: 0 }} />
        <InputBase
          placeholder="Rechercher un produit…"
          value={value}
          autoFocus={autoFocus}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          sx={{
            flex: 1,
            fontSize: 13,
            fontWeight: 500,
            color: theme.palette.text.primary,
            '& input::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
});

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, logout, loading: authLoading } = useAuth();
  const { isAdmin, toggleAdmin, cart, toggleCart } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useMemo(
    () => (cart || []).reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const profileMenuOpen = Boolean(profileAnchor);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setProfileAnchor(null);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setSearchOpen(false);
      }
    },
    [searchQuery, router],
  );

  const openProfileMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(e.currentTarget);
  }, []);

  const closeProfileMenu = useCallback(() => {
    setProfileAnchor(null);
  }, []);

  const userMenuItems = useMemo(() => {
    if (!user) return [];
    if (user.role === 'superadmin') {
      return [
        { label: 'Tableau de bord', icon: <DashboardOutlined fontSize="small" />, path: '/dashboards' },
        { label: 'Profil', icon: <AccountCircleOutlined fontSize="small" />, path: '/settings/profile' },
        { label: 'Déconnexion', icon: <LogoutOutlined fontSize="small" />, action: 'logout' as const },
      ];
    }
    if (user.role === 'admin') {
      return [
        { label: 'Tableau de bord', icon: <DashboardOutlined fontSize="small" />, path: '/dashboard' },
        { label: 'Profil', icon: <AccountCircleOutlined fontSize="small" />, path: '/settings/profile' },
        { label: 'Déconnexion', icon: <LogoutOutlined fontSize="small" />, action: 'logout' as const },
      ];
    }
    return [
      { label: 'Tableau de bord', icon: <DashboardOutlined fontSize="small" />, path: '/account' },
      { label: 'Profil', icon: <AccountCircleOutlined fontSize="small" />, path: '/settings/profile' },
      { label: 'Déconnexion', icon: <LogoutOutlined fontSize="small" />, action: 'logout' as const },
    ];
  }, [user]);

  const drawer = (
    <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Brand />
        <NavActionButton ariaLabel="Fermer le menu" onClick={() => setMobileOpen(false)}>
          <CloseIcon sx={{ fontSize: ICON_SIZE }} />
        </NavActionButton>
      </Box>

      <Box sx={{ px: 2, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          fullWidth
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    mx: 1.5,
                    borderRadius: '10px',
                    py: 1.25,
                    mb: 0.25,
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {isAdmin && (
          <>
            <Divider sx={{ mx: 2, my: 1 }} />
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    toggleAdmin?.();
                    setMobileOpen(false);
                  }}
                  sx={{ mx: 1.5, borderRadius: '10px' }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                    <AdminPanelSettingsOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Mode Admin" primaryTypographyProps={{ fontWeight: 600, color: 'error.main' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>

      <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
        {user ? (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={user.avatar} sx={{ width: 42, height: 42, bgcolor: 'primary.main' }}>
              {user.full_name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography fontWeight={600} fontSize={14}>
                {user.full_name}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href="/login"
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: '10px', py: 1.1, fontWeight: 600, boxShadow: 'none' }}
            >
              Se connecter
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/register"
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: '10px', py: 1.1, fontWeight: 500 }}
            >
              Créer un compte
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );

  const profileTrigger = (
    <Box
      component="button"
      type="button"
      onClick={openProfileMenu}
      aria-label="Mon compte"
      aria-expanded={profileMenuOpen}
      aria-haspopup="true"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        width: user && !isMobile ? 'auto' : ACTION_SIZE,
        minWidth: ACTION_SIZE,
        height: ACTION_SIZE,
        pl: user && !isMobile ? 0.75 : 0,
        pr: user && !isMobile ? 1.25 : 0,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        borderRadius: '12px',
        bgcolor: profileMenuOpen ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          borderColor: alpha(theme.palette.primary.main, 0.25),
        },
      }}
    >
      {authLoading ? (
        <Avatar sx={{ width: 28, height: 28, bgcolor: 'action.hover' }} />
      ) : user ? (
        <>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12, fontWeight: 700 }}>
            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
          </Avatar>
          {!isMobile && (
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', maxWidth: 88 }} noWrap>
              {user.full_name?.split(' ')[0] || 'Compte'}
            </Typography>
          )}
          <KeyboardArrowDown
            sx={{
              fontSize: 18,
              color: 'text.disabled',
              transition: 'transform 0.2s ease',
              transform: profileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}
          />
        </>
      ) : (
        <PersonOutline sx={{ fontSize: ICON_SIZE, color: 'text.secondary' }} />
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: NAVBAR_HEIGHT,
          justifyContent: 'center',
          bgcolor: scrolled ? alpha('#fff', 0.92) : '#fff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid',
          borderColor: scrolled ? alpha(theme.palette.divider, 0.9) : 'divider',
          boxShadow: scrolled ? `0 4px 24px ${alpha(theme.palette.common.black, 0.06)}` : 'none',
          transition: 'background-color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%', px: { xs: 2, md: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              height: NAVBAR_HEIGHT,
              minHeight: `${NAVBAR_HEIGHT}px !important`,
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Gauche */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <Box sx={{ display: { lg: 'none' } }}>
                <NavActionButton
                  ariaLabel="Ouvrir le menu"
                  onClick={() => setMobileOpen(true)}
                  active={mobileOpen}
                >
                  <MenuIcon sx={{ fontSize: ICON_SIZE }} />
                </NavActionButton>
              </Box>
              <Button
                component={Link}
                href="/"
                disableRipple
                sx={{ p: 0, minWidth: 'auto', textTransform: 'none', '&:hover': { bgcolor: 'transparent' } }}
              >
                <Brand />
              </Button>
            </Stack>

            {/* Centre — desktop */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ display: { xs: 'none', lg: 'flex' }, flex: 1, justifyContent: 'center' }}
            >
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.path} item={item} active={pathname === item.path} />
              ))}
            </Stack>

            {/* Droite — slots fixes */}
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ flexShrink: 0, minWidth: { xs: 'auto', md: 280 } }}
            >
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <SearchField
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                />
              </Box>

              <Box sx={{ display: { md: 'none' } }}>
                <NavActionButton
                  ariaLabel="Rechercher"
                  onClick={() => setSearchOpen((p) => !p)}
                  active={searchOpen}
                >
                  <SearchIcon sx={{ fontSize: ICON_SIZE }} />
                </NavActionButton>
              </Box>

              <Box
                sx={{
                  width: '1px',
                  height: 24,
                  bgcolor: 'divider',
                  mx: 0.25,
                  display: { xs: 'none', sm: 'block' },
                }}
              />

              <NavActionButton ariaLabel="Mes favoris" href="/favorites" active={pathname === '/favorites'}>
                <FavoriteBorder sx={{ fontSize: ICON_SIZE }} />
              </NavActionButton>

              <NavActionButton ariaLabel="Panier" onClick={() => toggleCart()} active={false}>
                <Badge
                  badgeContent={cartCount > 0 ? cartCount : undefined}
                  color="primary"
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: 10,
                      fontWeight: 700,
                      height: 18,
                      minWidth: 18,
                      top: 4,
                      right: 4,
                    },
                  }}
                >
                  <ShoppingCartOutlined sx={{ fontSize: ICON_SIZE }} />
                </Badge>
              </NavActionButton>

              {profileTrigger}
            </Stack>
          </Toolbar>
        </Container>

        {/* Recherche mobile — overlay sans changer la hauteur de la barre */}
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            px: 2,
            py: 1.5,
            bgcolor: alpha('#fff', 0.98),
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            boxShadow: searchOpen ? `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}` : 'none',
            opacity: searchOpen ? 1 : 0,
            visibility: searchOpen ? 'visible' : 'hidden',
            pointerEvents: searchOpen ? 'auto' : 'none',
            transition: 'opacity 0.2s ease, visibility 0.2s ease',
            display: { md: 'none' },
          }}
        >
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            autoFocus={searchOpen}
            fullWidth
          />
        </Box>
      </AppBar>

      {/* Menu profil — portal MUI, pas de Popper dans l'AppBar */}
      <Menu
        anchorEl={profileAnchor}
        open={profileMenuOpen}
        onClose={closeProfileMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              mt: 1,
              minWidth: 260,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.12)}`,
              overflow: 'hidden',
            },
          },
        }}
        MenuListProps={{ sx: { py: 1 } }}
        disableScrollLock
      >
        {user && (
          <Box
            component="li"
            sx={{
              listStyle: 'none',
              px: 2,
              py: 1.5,
              mx: 1,
              mb: 0.5,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                {user.full_name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600} fontSize={14} noWrap>
                  {user.full_name || 'Utilisateur'}
                </Typography>
                <Typography fontSize={12} color="text.secondary" noWrap>
                  {user.email}
                </Typography>
              </Box>
            </Stack>
            {user.role && (
              <Chip
                size="small"
                label={
                  user.role === 'superadmin'
                    ? 'SuperAdmin'
                    : user.role === 'admin'
                      ? 'Admin'
                      : 'Client'
                }
                sx={{ mt: 1, height: 22, fontSize: 11, fontWeight: 600 }}
                color={user.role === 'client' ? 'default' : 'primary'}
                variant="outlined"
              />
            )}
          </Box>
        )}
        {user && <Divider sx={{ my: 0.5 }} />}
        {user &&
          userMenuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={async () => {
                closeProfileMenu();
                if ('action' in item && item.action === 'logout') {
                  await logout();
                } else if ('path' in item && item.path) {
                  router.push(item.path);
                }
              }}
              sx={{ mx: 1, borderRadius: '8px', py: 1, fontSize: 14 }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        {!user && (
          <Box
            component="li"
            sx={{ listStyle: 'none', px: 2, py: 1.5, minWidth: 220 }}
          >
            <Typography fontSize={13} color="text.secondary" textAlign="center" sx={{ mb: 1.5 }}>
              Connectez-vous pour accéder à votre compte
            </Typography>
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/login"
                onClick={closeProfileMenu}
                sx={{ borderRadius: '10px', fontWeight: 600, boxShadow: 'none' }}
              >
                Se connecter
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/register"
                onClick={closeProfileMenu}
                sx={{ borderRadius: '10px', fontWeight: 500 }}
              >
                Créer un compte
              </Button>
            </Stack>
          </Box>
        )}
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: 300, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
