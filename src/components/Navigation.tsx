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
  alpha,
  styled,
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
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';


const StyledAppBar = styled(AppBar)(({ theme }: { theme: any }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
  backdropFilter: 'blur(25px) saturate(180%)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
  boxShadow: `0 8px 40px ${alpha(theme.palette.common.black, 0.08)}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: `0 12px 50px ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const SearchContainer = styled(Box)(({ theme }: { theme: any }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 4,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    borderColor: alpha(theme.palette.primary.main, 0.25),
    transform: 'translateY(-1px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    '&::before': {
      opacity: 1,
    },
  },
  '&:focus-within': {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.2)}`,
    '&::before': {
      opacity: 1,
    },
  },
}));

const NavButton = styled(Button)(({ theme }: { theme: any }) => ({
  position: 'relative',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  padding: '10px 20px',
  borderRadius: theme.shape.borderRadius * 3,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  letterSpacing: '0.01em',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%) scaleX(0)',
    width: '60%',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
    '&::after': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 700,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'translateY(-1px)',
    boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.15)}`,
    '&::after': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }: { theme: any }) => ({
  borderRadius: theme.shape.borderRadius * 2.5,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: alpha(theme.palette.primary.main, 0.1),
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.4s ease',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    transform: 'scale(1.08) translateY(-1px)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
    '&::before': {
      width: '100%',
      height: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const LogoBox = styled(Box)(({ theme }: { theme: any }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.shape.borderRadius * 2.5,
  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    borderRadius: 'inherit',
    opacity: 0,
    zIndex: -1,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'scale(1.08) rotate(-3deg)',
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
    '&::before': {
      opacity: 1,
    },
  },
}));

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Utiliser AuthContext au lieu de l'état local
  const { user, isAuthenticated, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileAnchorRef = useRef<HTMLButtonElement>(null);

  const { isAdmin, toggleAdmin, cart, toggleCart } = useStore();
  const cartCount = cart.reduce((acc: number, item) => acc + item.quantity, 0);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileMenuToggle = () => {
    setProfileMenuOpen((prevOpen: boolean) => !prevOpen);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
  };

  const handleClickAway = (event: Event | React.SyntheticEvent) => {
    if (profileAnchorRef.current &&
      event.target instanceof Node &&
      !profileAnchorRef.current.contains(event.target)) {
      setProfileMenuOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Accueil', path: '/', icon: <Home fontSize="small" /> },
    { label: 'Boutique', path: '/shop', icon: <Store fontSize="small" /> },
    { label: 'À propos', path: '/about', icon: <Info fontSize="small" /> },
    { label: 'Contact', path: '/contact', icon: <ContactMail fontSize="small" /> },
  ];

  const userMenuItems = [
    // Menu simplifié pour admin/superadmin
    ...(user?.role === 'superadmin' ? [
      {
        label: 'Tableau de bord',
        icon: <Dashboard fontSize="small" />,
        path: '/superadmin/dashboard'  // ✅ Dashboard SuperAdmin
      },
      {
        label: 'Déconnexion',
        icon: <Logout fontSize="small" />,
        onClick: async () => {
          setProfileMenuOpen(false);
          await logout();
        }
      },
    ] : user?.role === 'admin' ? [
      {
        label: 'Tableau de bord',
        icon: <Dashboard fontSize="small" />,
        path: '/admin/security/summary'  // ✅ Admin security
      },
      {
        label: 'Déconnexion',
        icon: <Logout fontSize="small" />,
        onClick: async () => {
          setProfileMenuOpen(false);
          await logout();
        }
      },
    ] : [
      // Menu normal pour les clients
      {
        label: 'Mon profil',
        icon: <AccountCircle fontSize="small" />,
        path: '/account'
      },
      {
        label: 'Mes favoris',
        icon: <Favorite fontSize="small" />,
        path: '/favorites'
      },
      {
        label: 'Déconnexion',
        icon: <Logout fontSize="small" />,
        onClick: async () => {
          setProfileMenuOpen(false);
          await logout();
        }
      },
    ]),
  ];

  const drawer = (
    <Box
      sx={{
        width: { xs: '100%', sm: 400 },
        maxWidth: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LogoBox
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            DS
          </LogoBox>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              Dame Sarr
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Import & Commerce
            </Typography>
          </Box>
        </Stack>
        <StyledIconButton onClick={handleDrawerToggle} size="large">
          <CloseIcon />
        </StyledIconButton>
      </Box>

      <Divider />

      {/* Search in drawer */}
      <Box sx={{ p: 3 }}>
        <form onSubmit={handleSearch}>
          <SearchContainer sx={{ p: 1.5 }}>
            <InputBase
              fullWidth
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              startAdornment={
                <SearchIcon sx={{ color: 'text.secondary', mr: 1.5 }} />
              }
            />
          </SearchContainer>
        </form>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={pathname === item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {isAdmin && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  toggleAdmin?.();
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText
                  primary="Mode Admin"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: 'error.main',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        )}
      </Box>

      {/* User Section */}
      <Divider />
      {user ? (
        <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={user.avatar}
              alt={user.full_name}
              sx={{
                width: 56,
                height: 56,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            >
              {user.full_name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href="/login"
            onClick={() => setMobileOpen(false)}
            sx={{ mb: 1, py: 1 }}
          >
            Se connecter
          </Button>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href="/register"
            onClick={() => setMobileOpen(false)}
            sx={{ py: 1 }}
          >
            Créer un compte
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <StyledAppBar
      position="fixed"
      elevation={scrolled ? 2 : 0}
      sx={{
        transform: scrolled ? 'translateY(0)' : 'translateY(0)',
        py: scrolled ? 0.5 : 1.5,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            gap: { xs: 1, md: 3 },
          }}
        >
          {/* Mobile Menu Button */}
          <StyledIconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </StyledIconButton>

          {/* Logo */}
          <Button
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textTransform: 'none',
              color: 'text.primary',
              p: 1,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            <LogoBox
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: { xs: 1.5, md: 2 },
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              DS
            </LogoBox>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="h6"
                fontWeight={800}
                lineHeight={1.2}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Dame Sarr
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Import & Commerce
              </Typography>
            </Box>
          </Button>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              ml: 4,
            }}
          >
            {navItems.map((item) => (
              <NavButton
                key={item.path}
                component={Link}
                href={item.path}
                startIcon={item.icon}
                className={pathname === item.path ? 'active' : ''}
                sx={{
                  color: pathname === item.path ? 'primary.main' : 'text.primary',
                }}
              >
                {item.label}
              </NavButton>
            ))}
          </Stack>

          {/* Search - Desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 300,
              mr: 2,
            }}
          >
            <form onSubmit={handleSearch}>
              <SearchContainer sx={{ p: 1 }}>
                <SearchIcon
                  sx={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'text.secondary',
                    fontSize: 20,
                  }}
                />
                <InputBase
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  sx={{
                    width: '100%',
                    pl: 5,
                    pr: 2,
                    fontSize: '0.875rem',
                  }}
                />
              </SearchContainer>
            </form>
          </Box>

          {/* Right Side Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* User Menu */}
            <StyledIconButton
              ref={profileAnchorRef}
              onClick={handleProfileMenuToggle}
              sx={{ position: 'relative' }}
            >
              {user ? (
                <Badge
                  overlap="circular"
                  variant="dot"
                  color="success"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </Avatar>
                </Badge>
              ) : (
                <AccountCircle sx={{ fontSize: 28 }} />
              )}
            </StyledIconButton>

            {/* Cart */}
            <StyledIconButton onClick={() => toggleCart()}>
              <Badge
                badgeContent={cartCount}
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 950,
                    fontSize: '0.5rem',
                  },
                }}
              >
                <ShoppingCart />
              </Badge>
            </StyledIconButton>

            {/* Admin Badge */}
            {isAdmin && (
              <Chip
                icon={<AdminPanelSettings />}
                label="Admin"
                size="small"
                color="error"
                variant="outlined"
                onClick={toggleAdmin}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                  },
                }}
              />
            )}
          </Stack>

          {/* User Menu Popper */}
          <Popper
            open={profileMenuOpen}
            anchorEl={profileAnchorRef.current}
            role={undefined}
            placement="bottom-end"
            transition
            disablePortal
            sx={{ zIndex: theme.zIndex.modal }}
          >
            {({ TransitionProps }: { TransitionProps: any }) => (
              <Grow {...TransitionProps}>
                <Paper
                  elevation={8}
                  sx={{
                    minWidth: 260,
                    borderRadius: 3,
                    overflow: 'hidden',
                    mt: 1.5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <ClickAwayListener onClickAway={handleClickAway}>
                    <MenuList sx={{ p: 1 }}>
                      {user ? (
                        [
                          <Box key="user-info" sx={{ 
                            px: 2, 
                            py: 2.5, 
                            mb: 1,
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                            borderRadius: 2,
                            border: '1px solid rgba(99, 102, 241, 0.1)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'primary.main',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  mr: 2,
                                  border: '2px solid',
                                  borderColor: 'primary.light'
                                }}
                              >
                                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
                                  {user.full_name || 'Utilisateur'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.2 }}>
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                            {user.role && (
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Chip 
                                  size="small" 
                                  label={
                                    user.role === 'superadmin' ? '👑 SuperAdmin' : 
                                    user.role === 'admin' ? '⚙️ Admin' : 
                                    user.role === 'client' ? '👤 Client' :
                                    user.role
                                  }
                                  color="primary" 
                                  variant="filled"
                                  sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 24,
                                    borderRadius: 1
                                  }}
                                />
                              </Box>
                            )}
                          </Box>,
                          <Divider key="divider" sx={{ mb: 1 }} />,
                          ...userMenuItems.map((item, index) => (
                            <MenuItem
                              key={`menu-item-${index}`}
                              onClick={() => {
                                if (item.onClick) {
                                  item.onClick();
                                } else if (item.path) {
                                  router.push(item.path);
                                }
                                setProfileMenuOpen(false);
                              }}
                              sx={{
                                borderRadius: 1.5,
                                py: 1.2,
                                mb: 0.3,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText 
                                primary={item.label}
                                primaryTypographyProps={{
                                  fontSize: '0.875rem',
                                  fontWeight: 500
                                }}
                              />
                            </MenuItem>
                          ))
                        ]
                      ) : (
                        <Box sx={{ p: 1.5, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary" mb={1.5}>
                            Connectez-vous pour accéder à votre compte
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            component={Link}
                            href="/login"
                            onClick={() => setProfileMenuOpen(false)}
                            startIcon={<AccountCircle />}
                            sx={{ mb: 1, py: 0.75 }}
                          >
                            Se connecter
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            href="/register"
                            onClick={() => setProfileMenuOpen(false)}
                            startIcon={<UserIcon />}
                            sx={{ py: 0.75 }}
                          >
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
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: '85vw', sm: 400 },
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </StyledAppBar>
  );
}