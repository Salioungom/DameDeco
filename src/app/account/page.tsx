'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Button,
    Divider,
} from '@mui/material';
import {
    AccountCircle,
    FolderOpen,
    ShoppingBag,
    Settings,
} from '@mui/icons-material';
import Link from 'next/link';

export default function AccountPage() {
    const router = useRouter();

    const accountSections = [
        {
            title: 'Mon Profil',
            description: 'Gérez vos informations personnelles',
            icon: <AccountCircle sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: '/account/profile',
        },
        {
            title: 'Mes Commandes',
            description: 'Consultez l\'historique de vos commandes',
            icon: <ShoppingBag sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: '/account/orders',
        },
        {
            title: 'Mes Favoris',
            description: 'Retrouvez vos produits favoris',
            icon: <FolderOpen sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: '/favorites',
        },
        {
            title: 'Paramètres',
            description: 'Configurez votre compte',
            icon: <Settings sx={{ fontSize: 48, color: 'primary.main' }} />,
            path: '/account/settings',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
            <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'background.default' }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                    Mon Compte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Gérez vos informations personnelles et vos préférences
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {accountSections.map((section) => (
                    <Grid item xs={12} sm={6} md={3} key={section.path}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                },
                            }}
                            onClick={() => router.push(section.path)}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                                <Box sx={{ mb: 2 }}>
                                    {section.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    {section.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {section.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>
                    Besoin d'aide ?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Notre équipe est là pour vous aider. Contactez-nous pour toute question.
                </Typography>
                <Button
                    variant="outlined"
                    component={Link}
                    href="/contact"
                >
                    Nous contacter
                </Button>
            </Paper>
        </Container>
    );
}
