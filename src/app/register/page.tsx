'use client';

import { useState, useEffect } from 'react';
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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAdd,
    Login as LoginIcon,
    ArrowBack,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';
import NextLink from 'next/link';

// ClientOnly wrapper to prevent hydration mismatches
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    return isMounted ? <>{children}</> : null;
};

export default function RegisterPage() {
    const router = useRouter();
    const theme = useTheme();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Validation en temps réel du mot de passe
    const getPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            special: /[!@#$%^&*]/.test(password),
            noPredictable: !/123456|password|qwerty/i.test(password),
            noName: !formData.fullName.toLowerCase().split(' ').some(part => 
                part && password.toLowerCase().includes(part)
            ),
        };
        
        const passed = Object.values(checks).filter(Boolean).length;
        const strength = passed === 0 ? 'empty' : 
                       passed <= 2 ? 'weak' : 
                       passed <= 4 ? 'medium' : 'strong';
        
        return { checks, strength, passed };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFieldErrors({});
        setLoading(true);

        try {
            // Validation des champs selon spécifications finales
            const errors: {[key: string]: string} = {};
            
            if (!formData.fullName) {
                errors.fullName = 'Le nom complet est obligatoire';
            }
            
            if (!formData.email) {
                errors.email = 'L\'adresse email est obligatoire';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'L\'adresse email n\'est pas valide';
            }
            
            if (!formData.phone) {
                errors.phone = 'Le numéro de téléphone est obligatoire';
            }
            
            if (!formData.password) {
                errors.password = 'Le mot de passe est obligatoire';
            } else {
                // Validation du mot de passe sécurisé (minimum 12 caractères)
                if (formData.password.length < 12) {
                    errors.password = 'Le mot de passe doit contenir au moins 12 caractères';
                } else if (!/[A-Z]/.test(formData.password)) {
                    errors.password = 'Le mot de passe doit contenir au moins une lettre majuscule';
                } else if (!/[!@#$%^&*]/.test(formData.password)) {
                    errors.password = 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)';
                } else if (/123456|password|qwerty/i.test(formData.password)) {
                    errors.password = 'Le mot de passe ne peut pas contenir de motifs prévisibles';
                } else if (formData.fullName.toLowerCase().split(' ').some(part => 
                    part && formData.password.toLowerCase().includes(part))) {
                    errors.password = 'Le mot de passe ne peut pas contenir votre nom ou prénom';
                }
            }
            
            if (!formData.confirmPassword) {
                errors.confirmPassword = 'La confirmation du mot de passe est obligatoire';
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Les mots de passe ne correspondent pas';
            }
            
            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                throw new Error('Veuillez corriger les erreurs dans le formulaire');
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
            console.error('Détails de l\'erreur:', err.response?.data);
            console.error('Status:', err.response?.status);
            console.error('Données envoyées:', formData);
            
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Effacer l'erreur du champ modifié
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Composant pour l'indicateur de force du mot de passe
    const PasswordStrengthIndicator = () => {
        if (!passwordFocused && !formData.password) return null;
        
        const strengthColors: { [key: string]: string } = {
            empty: 'grey.300',
            weak: 'error.main',
            medium: 'warning.main',
            strong: 'success.main'
        };
        
        const strengthLabels: { [key: string]: string } = {
            empty: '',
            weak: 'Faible',
            medium: 'Moyen',
            strong: 'Fort'
        };
        
        return (
            <Box sx={{ mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Force du mot de passe:
                    </Typography>
                    <Chip
                        label={strengthLabels[passwordStrength.strength]}
                        size="small"
                        sx={{
                            bgcolor: strengthColors[passwordStrength.strength],
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>
                <List dense sx={{ py: 0 }}>
                    <PasswordRequirement
                        met={passwordStrength.checks.length}
                        text="Au moins 12 caractères"
                    />
                    <PasswordRequirement
                        met={passwordStrength.checks.uppercase}
                        text="Au moins une lettre majuscule"
                    />
                    <PasswordRequirement
                        met={passwordStrength.checks.special}
                        text="Au moins un caractère spécial (!@#$%^&*)"
                    />
                    <PasswordRequirement
                        met={passwordStrength.checks.noPredictable}
                        text="Pas de motifs prévisibles"
                    />
                    <PasswordRequirement
                        met={passwordStrength.checks.noName}
                        text="Ne contient pas votre nom"
                    />
                </List>
            </Box>
        );
    };
    
    const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
        <ListItem sx={{ py: 0.5, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
                {met ? (
                    <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                ) : (
                    <Cancel sx={{ color: 'grey.400', fontSize: 16 }} />
                )}
            </ListItemIcon>
            <ListItemText 
                primary={text}
                primaryTypographyProps={{
                    variant: 'caption',
                    color: met ? 'text.primary' : 'text.secondary',
                    sx: { 
                        textDecoration: met ? 'none' : 'line-through',
                        fontSize: '0.75rem'
                    }
                }}
            />
        </ListItem>
    );

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
                            maxWidth: 700,
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
                            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                                {/* Layout à deux colonnes responsive avec alignement strict */}
                                <Grid container spacing={3} alignItems="center">
                                    {/* Ligne 1: Nom complet (gauche) et Email (droite) */}
                                    <Grid item xs={12} sm={6}>
                                        <ClientOnly>
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
                                                error={!!fieldErrors.fullName}
                                                helperText={fieldErrors.fullName}
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
                                        </ClientOnly>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ClientOnly>
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label="Adresse email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={!!fieldErrors.email}
                                                helperText={fieldErrors.email}
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
                                        </ClientOnly>
                                    </Grid>

                                    {/* Ligne 2: Téléphone (gauche) et Mot de passe (droite) */}
                                    <Grid item xs={12} sm={6}>
                                        <ClientOnly>
                                            <TextField
                                                required
                                                fullWidth
                                                id="phone"
                                                label="Téléphone"
                                                name="phone"
                                                autoComplete="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                error={!!fieldErrors.phone}
                                                helperText={fieldErrors.phone}
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
                                        </ClientOnly>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ClientOnly>
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
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                                error={!!fieldErrors.password}
                                                helperText={fieldErrors.password}
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
                                            <PasswordStrengthIndicator />
                                        </ClientOnly>
                                    </Grid>

                                    {/* Ligne 3: Confirmation mot de passe (pleine largeur) */}
                                    <Grid item xs={12} sm={12}>
                                        <ClientOnly>
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
                                                error={!!fieldErrors.confirmPassword}
                                                helperText={fieldErrors.confirmPassword}
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
                                        </ClientOnly>
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
