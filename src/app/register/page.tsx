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
    IconButton,
    InputAdornment,
    Divider,
    alpha,
    useTheme,
    LinearProgress,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAdd,
    Login as LoginIcon,
    ArrowBack,
    CheckCircle,
} from '@mui/icons-material';
import NextLink from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const theme = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!name || (!email && !phone) || !password || !confirmPassword) {
            setError('Nom, Email ou Téléphone, et mot de passe sont requis');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, password, name }),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Échec de l\'inscription');
            }

            setSuccess('Inscription réussie ! Redirection vers la page de connexion...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const passwordStrength = () => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return strength;
    };

    const getPasswordColor = () => {
        const strength = passwordStrength();
        if (strength <= 25) return theme.palette.error.main;
        if (strength <= 50) return theme.palette.warning.main;
        if (strength <= 75) return theme.palette.info.main;
        return theme.palette.success.main;
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden',
                // Match Login Page Gradient
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
                    left: '-10%',
                    width: '45%',
                    height: '45%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
                    animation: 'float 7s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                        '50%': { transform: 'translateY(20px) translateX(-20px)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '55%',
                    height: '55%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
                    animation: 'float 9s ease-in-out infinite',
                    animationDelay: '1.5s',
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
                                Créer votre compte
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Rejoignez-nous pour commencer vos achats
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

                        {success && (
                            <Alert
                                severity="success"
                                icon={<CheckCircle />}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    animation: 'fadeIn 0.5s',
                                    '@keyframes fadeIn': {
                                        from: { opacity: 0 },
                                        to: { opacity: 1 },
                                    },
                                }}
                            >
                                {success}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Nom complet"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
                                fullWidth
                                id="email"
                                label="Adresse Email (Optionnel)"
                                name="email"
                                autoComplete="email"
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
                                fullWidth
                                id="phone"
                                label="Numéro de téléphone (Optionnel si email fourni)"
                                name="phone"
                                autoComplete="tel"
                                value={phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
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
                                autoComplete="new-password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 1,
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

                            {password && (
                                <Box sx={{ mb: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={passwordStrength()}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: alpha(getPasswordColor(), 0.2),
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: getPasswordColor(),
                                                borderRadius: 3,
                                            },
                                        }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        Force du mot de passe: {
                                            passwordStrength() <= 25 ? 'Faible' :
                                                passwordStrength() <= 50 ? 'Moyen' :
                                                    passwordStrength() <= 75 ? 'Bon' : 'Excellent'
                                        }
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirmer le mot de passe"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                startIcon={<PersonAdd />}
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
                                }}
                            >
                                {loading ? 'Création en cours...' : 'Créer mon compte'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                ou
                            </Typography>
                        </Divider>

                        <Button
                            component={NextLink}
                            href="/login"
                            fullWidth
                            variant="outlined"
                            startIcon={<LoginIcon />}
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
                            J'ai déjà un compte
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
