'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Alert,
    useTheme,
    alpha,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    ShoppingBag as ShoppingBagIcon,
    ArrowForward as ArrowForwardIcon,
    StoreOutlined,
} from '@mui/icons-material';

export default function OrderConfirmationPage() {
    const theme = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const brandBlue = theme.palette.primary.main;
    const brandDark = '#042C53';

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={56} sx={{ color: brandBlue }} />
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 3, color: 'text.secondary' }}>
                        Traitement de votre commande...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 14 }}>
                <Container maxWidth="sm">
                    <Alert severity="error" variant="outlined" sx={{ mb: 3, animation: 'slideUp 0.35s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>{error}</Alert>
                    <Button variant="contained" onClick={() => router.push('/checkout')} sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Retour au paiement
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="sm" sx={{ pt: 14, pb: 8 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        py: { xs: 6, md: 8 },
                        px: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(brandBlue, 0.04)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                    }}
                >
                    <Box
                        sx={{
                            width: 88,
                            height: 88,
                            borderRadius: '50%',
                            mx: 'auto',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                    </Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Commande confirmée !
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1, lineHeight: 1.7 }}>
                        Merci pour votre achat. Votre commande a été enregistrée avec succès.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 5, lineHeight: 1.6 }}>
                        Vous recevrez bientôt une confirmation par email avec les détails de votre commande.
                    </Typography>

                    <Box
                        sx={{
                            textAlign: 'left',
                            p: 3,
                            mb: 4,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                            bgcolor: alpha(theme.palette.common.white, 0.6),
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <StoreOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                            <Typography variant="subtitle1" fontWeight={700}>
                                Prochaines étapes
                            </Typography>
                        </Box>
                        {[
                            'Confirmation de votre commande par email',
                            'Préparation de vos articles',
                            'Expédition vers votre adresse',
                            'Livraison et suivi de votre colis',
                        ].map((step, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: i < 3 ? 1.5 : 0 }}>
                                <Box
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: alpha(brandBlue, 0.1),
                                        color: brandBlue,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        flexShrink: 0,
                                    }}
                                >
                                    {i + 1}
                                </Box>
                                <Typography variant="body2" color="text.secondary">{step}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/account/orders')}
                            startIcon={<ShoppingBagIcon />}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 700,
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            Voir mes commandes
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.push('/')}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                flex: 1,
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 600,
                                borderColor: alpha(theme.palette.divider, 0.8),
                            }}
                        >
                            Continuer mes achats
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
