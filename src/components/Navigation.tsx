'use client';

import { useState, useEffect, useRef } from 'react';
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
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Person as UserIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AdminPanelSettings,
  Dashboard,
  Logout,
  AccountCircle,
  Favorite,
  Store,
  Home,
  Info,
  ContactMail,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { ClientOnly } from './ClientOnly';

const C = {
  primary: '#185FA5',
  dark:    '#042C53',
  light:   '#E6F1FB',
  surface: '#F5F9FE',
  border:  '#E6F1FB',
  mid:     '#85B7EB',
  muted:   '#888780',
  text:    '#5F5E5A',
  iconMid: '#B5D4F4',
} as const;

export function Navigation() {
  const pathname = usePathname();
  const router   = useRouter();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const { user, isAuthenticated, logout } = useAuth();

  const [searchQuery,     setSearchQuery]     = useState('');
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [searchOpen,      setSearchOpen]      = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileAnchorRef = useRef<HTMLButtonElement>(null);

  const { isAdmin, toggleAdmin, cart, toggleCart } = useStore();
  const cartCount = (cart || []).reduce((acc: number, item) => acc + item.quantity, 0);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleProfileMenuToggle = () => setProfileMenuOpen((p) => !p);
  const handleProfileMenuClose  = () => setProfileMenuOpen(false);
  const handleDrawerToggle      = () => setMobileOpen((p) => !p);

  const handleClickAway = (e: Event | React.SyntheticEvent) => {
    if (
      profileAnchorRef.current &&
      e.target instanceof Node &&
      !profileAnchorRef.current.contains(e.target)
    ) setProfileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Accueil',  path: '/',        icon: <Home        fontSize="small" /> },
    { label: 'Boutique', path: '/shop',    icon: <Store       fontSize="small" /> },
    { label: 'À propos', path: '/about',   icon: <Info        fontSize="small" /> },
    { label: 'Contact',  path: '/contact', icon: <ContactMail fontSize="small" /> },
  ];

  const userMenuItems = [
    ...(user?.role === 'superadmin' ? [
      { label: 'Tableau de bord', icon: <Dashboard     fontSize="small" />, path: '/dashboards' },
      { label: 'Profil',          icon: <AccountCircle fontSize="small" />, path: '/settings/profile' },
      { label: 'Déconnexion',     icon: <Logout        fontSize="small" />, onClick: async () => { setProfileMenuOpen(false); await logout(); } },
    ] : user?.role === 'admin' ? [
      { label: 'Tableau de bord', icon: <Dashboard     fontSize="small" />, path: '/dashboard' },
      { label: 'Profil',          icon: <AccountCircle fontSize="small" />, path: '/settings/profile' },
      { label: 'Déconnexion',     icon: <Logout        fontSize="small" />, onClick: async () => { setProfileMenuOpen(false); await logout(); } },
    ] : [
      { label: 'Mon profil',  icon: <AccountCircle fontSize="small" />, path: '/account' },
      { label: 'Mes favoris', icon: <Favorite      fontSize="small" />, path: '/favorites' },
      { label: 'Déconnexion', icon: <Logout        fontSize="small" />, onClick: async () => { setProfileMenuOpen(false); await logout(); } },
    ]),
  ];

  // ── sx partagé icône bouton ────────────────────────────────────────────────
  const iconBtnSx = {
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    width: 34,
    height: 34,
    color: C.text,
    flexShrink: 0,
    '&:hover': { bgcolor: C.surface, color: C.primary, borderColor: C.mid },
  } as const;

  // ── Brand ─────────────────────────────────────────────────────────────────
  const Brand = () => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 36, height: 36,
          borderRadius: '50%',
          bgcolor: C.primary,
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', flexShrink: 0,
        }}
      >
        DS
      </Box>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.dark, lineHeight: 1.2, letterSpacing: '-0.2px' }}>
          Dame Sarr
        </Typography>
        <Typography sx={{ fontSize: 10, color: C.muted, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          Import & Commerce
        </Typography>
      </Box>
    </Stack>
  );

  // ── Search box ────────────────────────────────────────────────────────────
  const SearchBox = ({ autoFocus = false, fullWidth = false }: { autoFocus?: boolean; fullWidth?: boolean }) => (
    <form onSubmit={handleSearch}>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 0.875,
          bgcolor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          px: 1.25,
          height: 34,
          transition: 'border-color 0.15s',
          '&:focus-within': { borderColor: C.primary },
        }}
      >
        <SearchIcon sx={{ fontSize: 15, color: C.iconMid, flexShrink: 0 }} />
        <ClientOnly>
          <InputBase
            placeholder="Rechercher..."
            value={searchQuery}
            autoFocus={autoFocus}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            sx={{
              fontSize: 12,
              color: C.text,
              width: fullWidth ? '100%' : 150,
              '& input::placeholder': { color: C.iconMid, opacity: 1 },
            }}
          />
        </ClientOnly>
      </Box>
    </form>
  );

  // ── Drawer mobile ─────────────────────────────────────────────────────────
  const drawer = (
    <Box sx={{ width: 280, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}` }}>
        <Brand />
        <IconButton aria-label="Fermer le menu" onClick={handleDrawerToggle} size="small" sx={iconBtnSx}>
          <CloseIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${C.border}` }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.875,
          bgcolor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '8px', px: 1.25, height: 36,
          '&:focus-within': { borderColor: C.primary },
        }}>
          <SearchIcon sx={{ fontSize: 15, color: C.iconMid }} />
          <ClientOnly>
            <InputBase
              fullWidth
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              sx={{ fontSize: 12, color: C.text }}
            />
          </ClientOnly>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List disablePadding>
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    mx: 1, borderRadius: '8px', py: 1.125, mb: 0.25,
                    bgcolor: active ? C.light : 'transparent',
                    color:   active ? C.primary : C.text,
                    '&:hover': { bgcolor: active ? C.light : C.surface, color: C.primary },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: active ? 600 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {isAdmin && (
          <>
            <Divider sx={{ mx: 2, my: 1, borderColor: C.border }} />
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { toggleAdmin?.(); setMobileOpen(false); }}
                  sx={{ mx: 1, borderRadius: '8px', py: 1.125, bgcolor: 'rgba(211,47,47,0.06)', '&:hover': { bgcolor: 'rgba(211,47,47,0.10)' } }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: 'error.main' }}><AdminPanelSettings fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Mode Admin" primaryTypographyProps={{ fontSize: 13, fontWeight: 600, color: 'error.main' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>

      <Box sx={{ borderTop: `1px solid ${C.border}` }}>
        {user ? (
          <Box sx={{ px: 2.5, py: 2 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar src={user.avatar} alt={user.full_name} sx={{ width: 38, height: 38, bgcolor: C.primary, fontSize: 14, fontWeight: 600 }}>
                {user.full_name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{user.full_name}</Typography>
                <Typography sx={{ fontSize: 11, color: C.muted }}>{user.email}</Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button fullWidth variant="contained" component={Link} href="/login" onClick={() => setMobileOpen(false)}
              sx={{ bgcolor: C.primary, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 13, boxShadow: 'none', '&:hover': { bgcolor: C.dark, boxShadow: 'none' } }}>
              Se connecter
            </Button>
            <Button fullWidth variant="outlined" component={Link} href="/register" onClick={() => setMobileOpen(false)}
              sx={{ borderColor: C.border, color: C.primary, borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 13, '&:hover': { bgcolor: C.surface, borderColor: C.mid } }}>
              Créer un compte
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderBottom: `1px solid ${C.border}`,
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.2s ease',
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: '64px !important',
            height: 64,
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* ── LEFT ── */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            <IconButton
              aria-label="Ouvrir le menu"
              onClick={handleDrawerToggle}
              size="small"
              sx={{ ...iconBtnSx, display: { md: 'none' } }}
            >
              <MenuIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <Button
              component={Link}
              href="/"
              disableRipple
              sx={{ p: 0, minWidth: 'auto', textTransform: 'none', '&:hover': { bgcolor: 'transparent' } }}
            >
              <Brand />
            </Button>
          </Stack>

          {/* ── CENTER ── */}
          <Stack
            direction="row"
            spacing={0.25}
            sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}
          >
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  href={item.path}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: '8px',
                    px: 1.375,
                    py: 0.75,
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    textTransform: 'none',
                    color:   active ? C.primary : C.text,
                    bgcolor: active ? C.light    : 'transparent',
                    minWidth: 'auto',
                    '&:hover': { bgcolor: active ? C.light : C.surface, color: C.primary },
                    '& .MuiButton-startIcon': { mr: 0.5 },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          {/* ── RIGHT ── */}
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
            {/* Search desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <SearchBox />
            </Box>

            {/* Search mobile */}
            <IconButton
              aria-label="Rechercher"
              onClick={() => setSearchOpen((p) => !p)}
              size="small"
              sx={{ ...iconBtnSx, display: { md: 'none' } }}
            >
              <SearchIcon sx={{ fontSize: 17 }} />
            </IconButton>

            {/* Panier */}
            <IconButton
              aria-label="Panier"
              onClick={() => toggleCart()}
              size="small"
              sx={iconBtnSx}
            >
              <Badge
                badgeContent={cartCount || 0}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: C.primary, color: '#fff',
                    fontSize: 9, height: 15, minWidth: 15,
                    top: 1, right: 1,
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: 18 }} />
              </Badge>
            </IconButton>

            {/* User — avec nom affiché si connecté */}
            {user ? (
              <Box
                component="button"
                ref={profileAnchorRef as any}
                onClick={handleProfileMenuToggle}
                aria-label="Mon compte"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.875,
                  pl: 0.625, pr: 1.125, py: 0.625,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': { bgcolor: C.surface, borderColor: C.mid },
                }}
              >
                <Avatar sx={{ width: 26, height: 26, bgcolor: C.primary, fontSize: 10, fontWeight: 700 }}>
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </Avatar>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.dark, display: { xs: 'none', sm: 'block' } }}>
                  {user.full_name?.split(' ')[0] || 'Mon compte'}
                </Typography>
                <KeyboardArrowDown sx={{ fontSize: 14, color: C.iconMid }} />
              </Box>
            ) : (
              <IconButton
                aria-label="Mon compte"
                ref={profileAnchorRef}
                onClick={handleProfileMenuToggle}
                size="small"
                sx={iconBtnSx}
              >
                <AccountCircle sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      {/* Search bar mobile */}
      {searchOpen && (
        <Box sx={{ bgcolor: '#fff', borderTop: `1px solid ${C.border}`, px: 2, py: 1.25 }}>
          <SearchBox autoFocus fullWidth />
        </Box>
      )}

      {/* User menu popper */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={profileMenuOpen}
          anchorEl={profileAnchorRef.current}
          placement="bottom-end"
          transition
          disablePortal
          sx={{ zIndex: theme.zIndex.modal }}
        >
          {({ TransitionProps }: { TransitionProps: any }) => (
            <Grow {...TransitionProps}>
              <Paper
                elevation={0}
                sx={{
                  minWidth: 236,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.09)',
                  overflow: 'hidden',
                  mt: 0.75,
                }}
              >
                <ClickAwayListener onClickAway={handleClickAway}>
                  <MenuList sx={{ p: 0.75 }}>
                    {user ? (
                      <>
                        <Box sx={{ px: 1.375, py: 1.375, mb: 0.5, bgcolor: C.surface, borderRadius: '8px' }}>
                          <Stack direction="row" spacing={1.125} alignItems="center" sx={{ mb: 0.875 }}>
                            <Avatar sx={{ width: 34, height: 34, bgcolor: C.primary, fontSize: 12, fontWeight: 700 }}>
                              {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.dark, lineHeight: 1.2 }}>
                                {user.full_name || 'Utilisateur'}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: C.muted }}>{user.email}</Typography>
                            </Box>
                          </Stack>
                          {user.role && (
                            <Chip
                              size="small"
                              label={
                                user.role === 'superadmin' ? '👑 SuperAdmin' :
                                user.role === 'admin'      ? '⚙️ Admin'      :
                                                             '👤 Client'
                              }
                              sx={{ bgcolor: C.light, color: C.primary, fontWeight: 600, fontSize: 10, height: 20, borderRadius: '5px' }}
                            />
                          )}
                        </Box>
                        <Divider sx={{ my: 0.625, borderColor: C.border }} />
                        {userMenuItems.map((item, i) => (
                          <MenuItem
                            key={i}
                            onClick={() => {
                              if (item.onClick) item.onClick();
                              else if (item.path) router.push(item.path);
                              setProfileMenuOpen(false);
                            }}
                            sx={{
                              borderRadius: '7px', py: 0.875, mb: 0.25,
                              fontSize: 13, color: C.text,
                              '&:hover': { bgcolor: C.surface, color: C.primary },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>{item.icon}</ListItemIcon>
                            <ListItemText primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}>
                              {item.label}
                            </ListItemText>
                          </MenuItem>
                        ))}
                      </>
                    ) : (
                      <Box sx={{ p: 0.75 }}>
                        <Typography sx={{ fontSize: 12, color: C.muted, textAlign: 'center', mb: 1.25, px: 0.5 }}>
                          Connectez-vous pour accéder à votre compte
                        </Typography>
                        <Button fullWidth variant="contained" component={Link} href="/login" onClick={handleProfileMenuClose}
                          sx={{ bgcolor: C.primary, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 13, boxShadow: 'none', mb: 0.625, '&:hover': { bgcolor: C.dark, boxShadow: 'none' } }}>
                          Se connecter
                        </Button>
                        <Button fullWidth variant="outlined" component={Link} href="/register" onClick={handleProfileMenuClose}
                          sx={{ borderColor: C.border, color: C.primary, borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 13, '&:hover': { bgcolor: C.surface, borderColor: C.mid } }}>
                          Créer un compte
                        </Button>
                      </Box>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ClickAwayListener>

      {/* Drawer mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280, border: 'none' },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}