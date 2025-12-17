'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    TextField,
    Button,
    Alert,
    Typography,
    Container,
    Link as MuiLink,
    IconButton,
    InputAdornment,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    PersonAdd,
    ArrowBack,
} from '@mui/icons-material';
import NextLink from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json?.error || 'Échec de la connexion');
            }

            const { user } = await res.json();

            // Verify auth was set by fetching /api/auth/me
            const meRes = await fetch('/api/auth/me', { credentials: 'include' });
            if (!meRes.ok) {
                throw new Error('Impossible de vérifier l´authentification');
            }

            const meData = await meRes.json();
            const authenticatedUser = meData.user;

            // Redirect based on role
            if (authenticatedUser?.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else if (authenticatedUser?.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }

            // Force a router refresh to update server components/middleware state if needed
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, 
                    ${theme.palette.primary.dark} 0%, 
                    ${theme.palette.primary.main} 50%, 
                    ${theme.palette.secondary.main} 100%)`,
            }}
        >
            {/* Animated Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                        '50%': { transform: 'translateY(-20px) translateX(20px)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '50%',
                    height: '50%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
                    animation: 'float 8s ease-in-out infinite',
                    animationDelay: '1s',
                }}
            />

            {/* Back to Home Button */}
            <IconButton
                component={NextLink}
                href="/"
                sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    color: 'white',
                    bgcolor: alpha('#fff', 0.1),
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                        bgcolor: alpha('#fff', 0.2),
                        transform: 'translateX(-4px)',
                    },
                    transition: 'all 0.3s',
                    zIndex: 10,
                }}
            >
                <ArrowBack />
            </IconButton>

            <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4,
                    }}
                >
                    {/* Login Card with Glassmorphism */}
                    <Box
                        sx={{
                            width: '100%',
                            p: { xs: 3, sm: 5 },
                            borderRadius: 4,
                            background: alpha('#fff', 0.95),
                            backdropFilter: 'blur(20px)',
                            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`,
                            border: `1px solid ${alpha('#fff', 0.3)}`,
                            animation: 'slideUp 0.6s ease-out',
                            '@keyframes slideUp': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateY(30px)',
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            },
                        }}
                    >
                        {/* Logo/Title */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                Dame Sarr
                            </Typography>
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                Bienvenue de retour
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Connectez-vous pour continuer
                            </Typography>
                        </Box>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    animation: 'shake 0.5s',
                                    '@keyframes shake': {
                                        '0%, 100%': { transform: 'translateX(0)' },
                                        '25%': { transform: 'translateX(-10px)' },
                                        '75%': { transform: 'translateX(10px)' },
                                    },
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse Email ou Téléphone"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                                        },
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    '&:hover': {
                                                        color: theme.palette.primary.main,
                                                    },
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                                        },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                startIcon={<LoginIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                    '&.Mui-disabled': {
                                        background: theme.palette.action.disabledBackground,
                                    },
                                }}
                            >
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                ou
                            </Typography>
                        </Divider>

                        <Button
                            component={NextLink}
                            href="/register"
                            fullWidth
                            variant="outlined"
                            startIcon={<PersonAdd />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                borderWidth: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    borderWidth: 2,
                                    borderColor: theme.palette.primary.dark,
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                            }}
                        >
                            Créer un compte
                        </Button>

                        {/* Demo Accounts Info */}
                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="info.main"
                                fontWeight={600}
                                gutterBottom
                                sx={{ mb: 2 }}
                            >
                                📝 Comptes de démonstration
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {[
                                    { role: 'SuperAdmin', email: 'superadmin@example.com', pass: 'super123' },
                                    { role: 'Admin', email: 'admin@example.com', pass: 'admin123' },
                                    { role: 'Client', email: 'client@example.com', pass: 'client123' },
                                ].map((account, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            bgcolor: 'background.paper',
                                            border: `1px solid ${theme.palette.divider}`,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                borderColor: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <Typography variant="caption" fontWeight={600} display="block" color="primary">
                                            {account.role}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {account.email} / {account.pass}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
