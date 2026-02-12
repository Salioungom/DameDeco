'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/auth';
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
    Grid,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAdd,
    Login as LoginIcon,
    ArrowBack,
} from '@mui/icons-material';
import NextLink from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const theme = useTheme();
    const [formData, setFormData] = useState({
        fullName: '',       // ✅ camelCase - premier champ
        email: '',          // ✅ email sert d'identifiant unique
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Validation des champs selon spécifications finales
            if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
                throw new Error('Tous les champs sont obligatoires');
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            // ✅ Validation du mot de passe sécurisé (minimum 12 caractères)
            if (formData.password.length < 12) {
                throw new Error('Le mot de passe doit contenir au moins 12 caractères');
            }

            if (!/[A-Z]/.test(formData.password)) {
                throw new Error('Le mot de passe doit contenir au moins une lettre majuscule');
            }

            if (!/[!@#$%^&*]/.test(formData.password)) {
                throw new Error('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)');
            }

            // Interdire les motifs prévisibles
            if (/123456|password|qwerty/i.test(formData.password)) {
                throw new Error('Le mot de passe ne peut pas contenir de motifs prévisibles');
            }

            // Vérifier que le mot de passe ne contient pas le nom/prénom
            if (formData.fullName.toLowerCase().split(' ').some(part => formData.password.toLowerCase().includes(part))) {
                throw new Error('Le mot de passe ne peut pas contenir votre nom ou prénom');
            }

            // Utiliser le format selon les spécifications backend FINALES
            const response = await authAPI.register(formData);

            // Si la promesse est résolue, l'inscription est réussie
            setSuccess('Compte créé avec succès ! Veuillez vérifier votre email.');
            // Rediriger vers verify-otp après 2 secondes avec l'email
            setTimeout(() => {
                router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
            }, 2000);


        } catch (err: any) {
            console.error('Erreur inscription:', err);
            let errorMessage = err.message || 'Erreur d\'inscription';

            // Tenter d'extraire le message d'erreur de la réponse API
            if (err.response && err.response.data) {
                if (err.response.data.detail) {
                    if (Array.isArray(err.response.data.detail)) {
                        errorMessage = err.response.data.detail.map((e: any) => e.msg).join(', ');
                    } else {
                        errorMessage = err.response.data.detail;
                    }
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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

            <Container component="main" maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                    {/* Register Card with Glassmorphism */}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 700, // ✅ Largeur réduite (800 → 700)
                            p: { xs: 3, sm: 4 },
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
                                Créer votre compte
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Rejoignez Dame Déco et accédez à nos services exclusifs
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
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                }}
                            >
                                {success}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            {/* Wrapper pour contrôler la largeur du formulaire et le centrer via maxWidth + mx:auto */}
                            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                {/* Layout à deux colonnes responsive avec alignement strict */}
                                <Grid container spacing={3} alignItems="center">
                                    {/* Ligne 1: Nom complet (gauche) et Email (droite) */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="fullName"
                                            label="Nom complet"
                                            name="fullName"
                                            autoComplete="name"
                                            autoFocus
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            sx={{
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Adresse email"
                                            name="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            sx={{
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
                                    </Grid>

                                    {/* Ligne 2: Téléphone (gauche) et Mot de passe (droite) */}
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="phone"
                                            label="Téléphone"
                                            name="phone"
                                            autoComplete="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            sx={{
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Mot de passe"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                    </Grid>

                                    {/* Ligne 3: Confirmation mot de passe (pleine largeur) */}
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirmer le mot de passe"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                            sx={{
                                                                color: theme.palette.text.secondary,
                                                                '&:hover': {
                                                                    color: theme.palette.primary.main,
                                                                },
                                                            }}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                mb: 2.5,
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
                                    </Grid>
                                </Grid>
                            </Box>

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
                                    '&.Mui-disabled': {
                                        background: theme.palette.action.disabledBackground,
                                    },
                                }}
                            >
                                {loading ? 'Création en cours...' : 'Créer mon compte'}
                            </Button>

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
                                Se connecter
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
