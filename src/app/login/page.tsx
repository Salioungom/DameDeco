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
import { useAuth } from '@/contexts/AuthContext';
import { ClientOnly } from '@/components/ClientOnly';

export default function LoginPage() {
    const router = useRouter();
    const theme = useTheme();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setFieldErrors({});

        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = 'L\'adresse email est obligatoire';
        }

        if (!password) {
            errors.password = 'Le mot de passe est obligatoire';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        try {
            const result = await login(email.trim(), password);

            if (result.success) {
                const storedToken = localStorage.getItem('accessToken');
                
                setTimeout(() => {
                    const user = result.user;
                    
                    if (user?.role === 'superadmin') {
                        router.push('/dashboards');
                    } else if (user?.role === 'admin') {
                        router.push('/dashboard');
                    } else {
                        router.push('/account');
                    }
                    router.refresh();
                }, 200);
            } else {
                setError(result.error || 'Email ou mot de passe incorrect');
            }
        } catch {
            setError('Erreur de connexion. Veuillez réessayer.');
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
                background: `linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)`,
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
                    background: `radial-gradient(circle, ${alpha('#85B7EB', 0.25)}, transparent)`,
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
                    background: `radial-gradient(circle, ${alpha('#E6F1FB', 0.2)}, transparent)`,
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
                    <ClientOnly>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: 440,
                                p: { xs: 3.5, sm: 5 },
                                borderRadius: '16px',
                                background: alpha('#fff', 0.97),
                                backdropFilter: 'blur(24px)',
                                boxShadow: '0 8px 32px rgba(4, 44, 83, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
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
                            <Box sx={{ textAlign: 'center', mb: 4.5 }}>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 56,
                                        height: 56,
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                                        mb: 2.5,
                                        boxShadow: '0 4px 16px rgba(24, 95, 165, 0.3)',
                                    }}
                                >
                                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                                        DS
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#042C53',
                                        mb: 0.75,
                                        fontSize: { xs: '1.75rem', sm: '2rem' },
                                    }}
                                >
                                    Bienvenue
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    Connectez-vous à votre compte Dame Sarr
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
                                    label="Adresse email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    error={!!fieldErrors.email}
                                    helperText={fieldErrors.email}
                                    sx={{
                                        mb: 2.5,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '10px',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#85B7EB',
                                            },
                                            '&.Mui-focused': {
                                                borderColor: '#185FA5',
                                                boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: '0.875rem',
                                            '&.Mui-focused': {
                                                color: '#185FA5',
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value);
                                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                                }}
                                error={!!fieldErrors.password}
                                helperText={fieldErrors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    color: '#888780',
                                                    '&:hover': {
                                                        color: '#185FA5',
                                                        bgcolor: 'rgba(24, 95, 165, 0.08)',
                                                    },
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: '#85B7EB',
                                        },
                                        '&.Mui-focused': {
                                            borderColor: '#185FA5',
                                            boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '0.875rem',
                                        '&.Mui-focused': {
                                            color: '#185FA5',
                                        },
                                    },
                                }}
                            />

                            <Box sx={{ mb: 3, textAlign: 'right' }}>
                                <MuiLink
                                    component={NextLink}
                                    href="/forgot-password"
                                    sx={{
                                        color: '#185FA5',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: '#0C447C',
                                        },
                                    }}
                                >
                                    Mot de passe oublié ?
                                </MuiLink>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                startIcon={!loading && <LoginIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    py: 1.625,
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                                    boxShadow: '0 4px 16px rgba(24, 95, 165, 0.35)',
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0C447C 0%, #185FA5 100%)',
                                        boxShadow: '0 6px 20px rgba(24, 95, 165, 0.45)',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                    '&.Mui-disabled': {
                                        background: '#E6F1FB',
                                        color: '#888780',
                                    },
                                }}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3.5, borderColor: '#E6F1FB' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                ou
                            </Typography>
                        </Divider>

                        <Button
                            component={NextLink}
                            href="/register"
                            fullWidth
                            variant="outlined"
                            startIcon={<PersonAdd sx={{ fontSize: 18 }} />}
                            sx={{
                                py: 1.625,
                                borderRadius: '10px',
                                borderWidth: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                borderColor: '#185FA5',
                                color: '#185FA5',
                                fontSize: '0.95rem',
                                transition: 'all 0.25s ease',
                                '&:hover': {
                                    borderWidth: 1.5,
                                    borderColor: '#0C447C',
                                    bgcolor: 'rgba(24, 95, 165, 0.06)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(24, 95, 165, 0.2)',
                                },
                            }}
                        >
                            Créer un compte
                        </Button>
                        </Box>
                    </ClientOnly>
                </Box>
            </Container>
        </Box>
    );
}
