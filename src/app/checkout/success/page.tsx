'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    ShoppingBag as ShoppingBagIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simuler un chargement court pour l'effet visuel
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleViewOrders = () => {
        router.push('/account/orders');
    };

    const handleContinueShopping = () => {
        router.push('/');
    };

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Traitement de votre commande...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => router.push('/checkout')}>
                    Retour au paiement
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 4 }}>
                    <CheckCircleIcon 
                        sx={{ 
                            fontSize: 80, 
                            color: 'success.main',
                            mb: 2
                        }} 
                    />
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Commande confirmée !
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Merci pour votre achat. Votre commande a été enregistrée avec succès.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Vous recevrez bientôt une confirmation par email avec les détails de votre commande.
                    </Typography>
                </Box>

                <Card sx={{ mb: 4, bgcolor: 'grey.50' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <ShoppingBagIcon color="primary" />
                            <Typography variant="h6" fontWeight="medium">
                                Prochaines étapes
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body2" paragraph>
                                1. Confirmation de votre commande par email
                            </Typography>
                            <Typography variant="body2" paragraph>
                                2. Préparation de vos articles
                            </Typography>
                            <Typography variant="body2" paragraph>
                                3. Expédition vers votre adresse
                            </Typography>
                            <Typography variant="body2">
                                4. Livraison et suivi de votre colis
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleViewOrders}
                        startIcon={<ShoppingBagIcon />}
                        sx={{ flex: 1 }}
                    >
                        Voir mes commandes
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={handleContinueShopping}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ flex: 1 }}
                    >
                        Continuer mes achats
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
