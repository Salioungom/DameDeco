'use client';

import { useState } from 'react';
import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    Paper,
    IconButton,
    alpha,
    useTheme,
    Snackbar,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    Send,
    WhatsApp,
    Facebook,
    Instagram,
    Twitter,
    AccessTime,
    ExpandMore,
    CheckCircle,
} from '@mui/icons-material';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export default function ContactPage() {
    const theme = useTheme();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Define keyframes for animations
    const keyframes = {
        fadeInUp: {
            '@keyframes fadeInUp': {
                '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                },
                '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            },
        },
        float: {
            '@keyframes float': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
                '100%': { transform: 'translateY(0px)' },
            },
        },
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setSnackbar({
                open: true,
                message: 'Veuillez corriger les erreurs du formulaire',
                severity: 'error',
            });
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            setSnackbar({
                open: true,
                message: 'Message envoyé avec succès ! Nous vous répondrons sous 24h.',
                severity: 'success',
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
            setErrors({});
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }
    };

    const contactInfo = [
        {
            icon: <Phone sx={{ fontSize: 24 }} />,
            title: 'Téléphone',
            value: '+221 XX XXX XX XX',
            description: 'Lun - Sam, 9h - 18h',
        },
        {
            icon: <Email sx={{ fontSize: 24 }} />,
            title: 'Email',
            value: 'contact@damesarr.com',
            description: 'Réponse sous 24h',
        },
        {
            icon: <LocationOn sx={{ fontSize: 24 }} />,
            title: 'Adresse',
            value: 'Dakar, Sénégal',
            description: 'Quartier des affaires',
        },
    ];

    const faqs = [
        {
            question: 'Quels sont vos délais de livraison ?',
            answer: 'Nos délais de livraison varient entre 2 et 5 jours ouvrables pour Dakar et sa banlieue, et 5 à 10 jours pour les autres régions du Sénégal. Pour les commandes sur mesure, comptez 2 à 3 semaines supplémentaires.',
        },
        {
            question: 'Proposez-vous des prix de gros ?',
            answer: 'Oui, nous offrons des tarifs préférentiels pour les achats en gros. Contactez notre service commercial pour obtenir un devis personnalisé adapté à vos besoins professionnels.',
        },
        {
            question: 'Quelles sont vos méthodes de paiement ?',
            answer: 'Nous acceptons les paiements par Wave, Orange Money, virement bancaire, et paiement à la livraison. Pour les grosses commandes, des facilités de paiement peuvent être accordées.',
        },
        {
            question: 'Puis-je retourner un article ?',
            answer: 'Oui, vous disposez de 14 jours pour retourner un article non utilisé dans son emballage d\'origine. Les frais de retour sont à la charge du client sauf en cas de défaut de fabrication.',
        },
        {
            question: 'Livrez-vous en dehors de Dakar ?',
            answer: 'Oui, nous livrons dans tout le Sénégal. Des frais de livraison supplémentaires peuvent s\'appliquer selon la distance. Contactez-nous pour un devis précis.',
        },
        {
            question: 'Comment passer commande par WhatsApp ?',
            answer: 'Cliquez sur le bouton WhatsApp de notre site, envoyez-nous la référence du produit souhaité avec la quantité. Notre équipe vous répondra rapidement pour finaliser votre commande.',
        },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    py: { xs: 12, md: 16 },
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    position: 'relative',
                    overflow: 'hidden',
                    ...keyframes.fadeInUp,
                    animation: 'fadeInUp 0.8s ease-out',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.1)} 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        opacity: 0.5,
                        pointerEvents: 'none',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '800px',
                        height: '800px',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="overline"
                        color="primary"
                        fontWeight={700}
                        letterSpacing={3}
                        sx={{
                            mb: 3,
                            display: 'block',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            animation: 'fadeInUp 0.8s ease-out 0.1s backwards',
                        }}
                    >
                        CONTACTEZ-NOUS
                    </Typography>
                    <Typography
                        variant="h1"
                        component="h1"
                        fontWeight={900}
                        sx={{
                            mb: 4,
                            fontSize: { xs: '3rem', md: '4.5rem' },
                            lineHeight: 1.1,
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            pb: 1, // Prevent text descender clipping
                            animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
                            textShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }}
                    >
                        Parlons de votre projet
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight={400}
                        sx={{
                            maxWidth: 700,
                            mx: 'auto',
                            lineHeight: 1.8,
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            mb: 0,
                            animation: 'fadeInUp 0.8s ease-out 0.3s backwards',
                        }}
                    >
                        Une question ? Besoin d'un devis ? Notre équipe d'experts est là pour vous accompagner
                        et concrétiser tous vos projets avec professionnalisme.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 12 }}>
                <Grid container spacing={6}>
                    {/* Contact Info - Left column on desktop */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Nos Coordonnées
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Retrouvez-nous via ces différents canaux.
                                </Typography>
                            </Box>

                            <Stack spacing={2}>
                                {contactInfo.map((info, index) => {
                                    const colors = [
                                        { bg: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main },
                                        { bg: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main },
                                        { bg: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main },
                                    ][index % 3];

                                    return (
                                        <Paper
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 4,
                                                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.6)}, ${alpha(theme.palette.background.default, 0.4)})`,
                                                backdropFilter: 'blur(12px)',
                                                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 12px 32px ${alpha(colors.color, 0.15)}`,
                                                    borderColor: alpha(colors.color, 0.3),
                                                    '& .icon-box': {
                                                        transform: 'scale(1.1) rotate(5deg)',
                                                        background: `linear-gradient(135deg, ${colors.color}, ${alpha(colors.color, 0.8)})`,
                                                        color: 'white',
                                                    },
                                                },
                                            }}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <Box
                                                    className="contact-icon"
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        background: `linear-gradient(135deg, ${colors.bg}, ${alpha(colors.color, 0.15)})`,
                                                        color: colors.color,
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: 56,
                                                        minHeight: 56,
                                                        boxShadow: `0 4px 12px ${alpha(colors.color, 0.1)}`,
                                                    }}
                                                >
                                                    {React.cloneElement(info.icon, { sx: { fontSize: 28 } })}
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                                        {info.title}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{ mb: 1 }}>
                                                        {info.value}
                                                    </Typography>
                                                    {info.description && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                                fontSize: '0.8rem',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            <AccessTime sx={{ fontSize: 16, color: alpha(theme.palette.text.secondary, 0.8) }} />
                                                            {info.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Contact Form - Right column on desktop */}
                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                overflow: 'visible',
                                background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.default, 0.5)})`,
                                backdropFilter: 'blur(10px)',
                                boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.05)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                <Box sx={{ mb: 5 }}>
                                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: '1.5rem', color: theme.palette.text.primary }}>
                                        Envoyez-nous un message
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1 }}>
                                        Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
                                    </Typography>
                                </Box>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Stack spacing={4}>
                                        {/* Row: Nom + Email */}
                                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Box sx={{ flex: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Nom complet"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                    InputProps={{
                                                        sx: {
                                                            borderRadius: 2.5,
                                                            fontSize: '0.95rem',
                                                            transition: 'all 0.3s ease',
                                                            '&.Mui-focused': {
                                                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                            },
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                                            },
                                                        },
                                                    }}
                                                    disabled={loading}
                                                    sx={{
                                                        '& .MuiInputLabel-root': {
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            '&.Mui-focused': {
                                                                color: 'primary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    variant="outlined"
                                                    error={!!errors.email}
                                                    helperText={errors.email}
                                                    InputProps={{
                                                        sx: {
                                                            borderRadius: 2.5,
                                                            fontSize: '0.95rem',
                                                            transition: 'all 0.3s ease',
                                                            '&.Mui-focused': {
                                                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                            },
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                                            },
                                                        },
                                                    }}
                                                    disabled={loading}
                                                    sx={{
                                                        '& .MuiInputLabel-root': {
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            '&.Mui-focused': {
                                                                color: 'primary.main',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Sujet */}
                                        <TextField
                                            fullWidth
                                            label="Sujet"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.subject}
                                            helperText={errors.subject}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: 2.5,
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.3s ease',
                                                    '&.Mui-focused': {
                                                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                    },
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                                    },
                                                },
                                            }}
                                            disabled={loading}
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    '&.Mui-focused': {
                                                        color: 'primary.main',
                                                    },
                                                },
                                            }}
                                        />

                                        {/* Message */}
                                        <TextField
                                            fullWidth
                                            label="Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            multiline
                                            rows={5}
                                            variant="outlined"
                                            error={!!errors.message}
                                            helperText={errors.message}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: 2.5,
                                                    fontSize: '0.95rem',
                                                    alignItems: 'flex-start',
                                                    transition: 'all 0.3s ease',
                                                    '&.Mui-focused': {
                                                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.01),
                                                    },
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                                    },
                                                },
                                            }}
                                            disabled={loading}
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    '&.Mui-focused': {
                                                        color: 'primary.main',
                                                    },
                                                },
                                            }}
                                        />

                                        {/* Submit Button */}
                                        <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-start' } }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                                disabled={loading}
                                                fullWidth
                                                sx={{
                                                    py: 2,
                                                    px: 6,
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 700,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                                    },
                                                    '&:active': {
                                                        transform: 'translateY(0)',
                                                    },
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            >
                                                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Réseaux Sociaux - Section indépendante et centrée */}
                {/* Community Bar Section */}
                <Container maxWidth="md" sx={{ mt: 10, mb: 16 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                            }}
                        />
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                            Rejoignez notre communauté sur les réseaux sociaux
                        </Typography>
                        <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                            {[
                                { icon: <WhatsApp />, color: '#25D366', label: 'WhatsApp' },
                                { icon: <Facebook />, color: '#1877F2', label: 'Facebook' },
                                { icon: <Instagram />, color: '#E4405F', label: 'Instagram' },
                                { icon: <Twitter />, color: '#1DA1F2', label: 'Twitter' },
                            ].map((social, idx) => (
                                <Button
                                    key={idx}
                                    variant="outlined"
                                    startIcon={social.icon}
                                    sx={{
                                        border: `1px solid ${alpha(social.color, 0.3)}`,
                                        color: theme.palette.text.primary,
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: alpha(social.color, 0.1),
                                            borderColor: social.color,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 4px 12px ${alpha(social.color, 0.2)}`,
                                        },
                                        '& .MuiButton-startIcon': {
                                            color: social.color,
                                        },
                                    }}
                                >
                                    {social.label}
                                </Button>
                            ))}
                        </Stack>
                    </Paper>
                </Container>

                {/* FAQ Section */}
                <Box sx={{ mb: 16 }}>
                    <Box textAlign="center" mb={10}>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight={700}
                            letterSpacing={3}
                            sx={{
                                textTransform: 'uppercase',
                                fontSize: '0.9rem',
                                display: 'block',
                                mb: 2,
                            }}
                        >
                            FAQ
                        </Typography>
                        <Typography
                            variant="h2"
                            component="h2"
                            fontWeight={900}
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Questions Fréquentes
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                lineHeight: 1.8,
                                fontSize: { xs: '1.1rem', md: '1.2rem' },
                            }}
                        >
                            Trouvez rapidement les réponses aux questions les plus courantes.
                            <br />
                            Une autre question ? N'hésitez pas à nous contacter !
                        </Typography>
                    </Box>

                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    borderRadius: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.default, 0.3)})`,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        margin: '0 0 16px 0',
                                        borderColor: theme.palette.primary.main,
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, transparent)`,
                                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                                    },
                                    '&:hover': {
                                        borderColor: alpha(theme.palette.primary.main, 0.5),
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease',
                                                '& .expand-icon': {
                                                    transition: 'transform 0.3s ease',
                                                    color: 'primary.main',
                                                },
                                            }}
                                        >
                                            <ExpandMore className="expand-icon" />
                                        </Box>
                                    }
                                    sx={{
                                        px: { xs: 3, md: 4 },
                                        py: 3,
                                        '&:hover': {
                                            bgcolor: 'transparent',
                                        },
                                        '&.Mui-expanded': {
                                            '& .expand-icon': {
                                                transform: 'rotate(180deg)',
                                            },
                                            '& .question-icon': {
                                                color: 'primary.main',
                                                transform: 'scale(1.1)',
                                            },
                                        },
                                    }}
                                >
                                    <Stack direction="row" spacing={3} alignItems="center" sx={{ width: '100%' }}>
                                        <Box
                                            className="question-icon"
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
                                                color: alpha(theme.palette.primary.main, 0.8),
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            <CheckCircle sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{
                                                fontSize: { xs: '1.1rem', md: '1.2rem' },
                                                lineHeight: 1.4,
                                                color: 'text.primary',
                                            }}
                                        >
                                            {faq.question}
                                        </Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: { xs: 3, md: 4 }, pt: 0, pb: 4 }}>
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.8,
                                            pl: { xs: 0, md: 5.5 },
                                            fontSize: '1.05rem',
                                        }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>

                {/* Map Section */}
                <Box sx={{ mb: 12 }}>
                    <Box textAlign="center" mb={10}>
                        <Typography
                            variant="overline"
                            color="primary"
                            fontWeight={700}
                            letterSpacing={3}
                            sx={{
                                textTransform: 'uppercase',
                                fontSize: '0.9rem',
                                display: 'block',
                                mb: 2,
                            }}
                        >
                            LOCALISATION
                        </Typography>
                        <Typography
                            variant="h2"
                            component="h2"
                            fontWeight={900}
                            gutterBottom
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Nous Trouver
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.8,
                                mb: 6,
                            }}
                        >
                            Situés au cœur de Dakar, notre showroom vous accueille
                            pour découvrir nos créations en personne.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 6,
                            overflow: 'hidden',
                            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
                            background: theme.palette.background.paper,
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 30px 60px ${alpha(theme.palette.common.black, 0.15)}`,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 30,
                                left: 30,
                                zIndex: 2,
                                background: alpha(theme.palette.background.paper, 0.8),
                                backdropFilter: 'blur(12px)',
                                borderRadius: 3,
                                px: 2.5,
                                py: 1.5,
                                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.4)',
                                        animation: 'pulse 2s infinite',
                                    }}
                                />
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
                                    Dakar, Sénégal
                                </Typography>
                            </Stack>
                        </Box>
                        <Box
                            sx={{
                                height: { xs: 350, md: 500 },
                                position: 'relative',
                            }}
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61681.33063469812!2d-17.497849!3d14.7167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d7f729c37d5%3A0x4c3f03b804b572d!2sDakar%2C%20Senegal!5e0!3m2!1sen!2sus!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                    '& .MuiSnackbar-root': {
                        borderRadius: 3,
                    },
                }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                        },
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
