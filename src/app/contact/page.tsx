'use client';

import { useState } from 'react';
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
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="overline"
                        color="primary"
                        fontWeight={700}
                        letterSpacing={1.5}
                        sx={{ mb: 2, display: 'block' }}
                    >
                        CONTACTEZ-NOUS
                    </Typography>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight={800}
                        sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                    >
                        Parlons de votre projet
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight={400}
                        sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}
                    >
                        Une question ? Besoin d'un devis ? Notre équipe est là pour vous accompagner dans tous vos projets.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 12 }}>
                <Grid container spacing={6}>
                    {/* Contact Info */}
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
                                {contactInfo.map((info, index) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: `1px solid ${theme.palette.divider}`,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                                            },
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main',
                                                }}
                                            >
                                                {info.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {info.title}
                                                </Typography>
                                                <Typography variant="body1" color="text.primary" sx={{ mb: 0.5 }}>
                                                    {info.value}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                                >
                                                    <AccessTime sx={{ fontSize: 14 }} />
                                                    {info.description}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>

                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    Réseaux Sociaux
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {[
                                        { icon: <WhatsApp />, color: '#25D366' },
                                        { icon: <Facebook />, color: '#1877F2' },
                                        { icon: <Instagram />, color: '#E4405F' },
                                        { icon: <Twitter />, color: '#1DA1F2' },
                                    ].map((social, idx) => (
                                        <IconButton
                                            key={idx}
                                            sx={{
                                                bgcolor: alpha(social.color, 0.1),
                                                color: social.color,
                                                '&:hover': {
                                                    bgcolor: social.color,
                                                    color: 'white',
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Contact Form */}
                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                borderRadius: 4,
                                border: `1px solid ${theme.palette.divider}`,
                                overflow: 'visible',
                            }}
                        >
                            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    Envoyez-nous un message
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
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
                                                InputProps={{ sx: { borderRadius: 2 } }}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
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
                                                InputProps={{ sx: { borderRadius: 2 } }}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
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
                                                InputProps={{ sx: { borderRadius: 2 } }}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                multiline
                                                rows={6}
                                                variant="outlined"
                                                error={!!errors.message}
                                                helperText={errors.message}
                                                InputProps={{ sx: { borderRadius: 2 } }}
                                                disabled={loading}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                                disabled={loading}
                                                sx={{
                                                    py: 1.5,
                                                    px: 4,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                    },
                                                    transition: 'all 0.3s',
                                                }}
                                            >
                                                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* FAQ Section */}
                <Box sx={{ mt: 10 }}>
                    <Box textAlign="center" mb={6}>
                        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1.5}>
                            FAQ
                        </Typography>
                        <Typography variant="h3" component="h2" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
                            Questions Fréquentes
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                            Trouvez rapidement les réponses aux questions les plus courantes
                        </Typography>
                    </Box>

                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                elevation={0}
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': {
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        },
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="h6" fontWeight={600}>
                                            {faq.question}
                                        </Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
                                    <Typography color="text.secondary" sx={{ lineHeight: 1.8, pl: 4 }}>
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>

                {/* Map Section */}
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center" mb={4}>
                        Notre Localisation
                    </Typography>
                    <Box
                        sx={{
                            height: 450,
                            borderRadius: 4,
                            overflow: 'hidden',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: 4,
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
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
