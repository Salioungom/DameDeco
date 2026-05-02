'use client';

import { RequireRole } from '@/components/RequireRole';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Divider,
    Chip,
    LinearProgress,
    Stack,
    Avatar,
    AvatarGroup,
    alpha,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    AccountCircle,
    FolderOpen,
    ShoppingBag,
    Settings,
    TrendingUp,
    Pending,
    Star,
    ChevronRight,
    HeadsetMic,
    Inventory2,
    LocationOn
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { StatsService } from '@/services/stats.service';

function AccountPageContent() {
    const router = useRouter();
    const { user } = useAuth();
    const theme = useTheme();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        favoritesCount: 0,
        currency: 'XOF',
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const userStats = await StatsService.getUserStats();
            setStats({
                totalOrders: userStats.totalOrders,
                totalSpent: userStats.totalSpent,
                pendingOrders: userStats.pendingOrders,
                favoritesCount: userStats.totalFavorites,
                currency: 'XOF',
            });
            setRecentOrders(userStats.recentOrders);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'processing': return 'En cours';
            case 'shipped': return 'Expédiée';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return 'Inconnu';
        }
    };

    const statCards = [
        {
            title: 'Vos Commandes',
            value: stats.totalOrders,
            icon: <ShoppingBag sx={{ fontSize: 32 }} />,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1),
            path: '/account/orders',
        },
        {
            title: 'Total Dépensé',
            value: `${stats.totalSpent.toLocaleString('fr-FR')} FCFA`,
            icon: <TrendingUp sx={{ fontSize: 32 }} />,
            color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
            path: '/account/orders',
        },
        {
            title: 'En Cours',
            value: stats.pendingOrders,
            icon: <Pending sx={{ fontSize: 32 }} />,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1),
            path: '/account/orders',
        },
        {
            title: 'Favoris',
            value: stats.favoritesCount,
            icon: <Star sx={{ fontSize: 32 }} />,
            color: theme.palette.error.main,
            bgColor: alpha(theme.palette.error.main, 0.1),
            path: '/favorites',
        },
    ];

    const quickActions = [
        { title: 'Mon Profil', icon: <AccountCircle />, path: '/account/profile', color: '#3b82f6' },
        { title: 'Mes Adresses', icon: <LocationOn />, path: '/account/addresses', color: '#8b5cf6' },
        { title: 'Mes Commandes', icon: <Inventory2 />, path: '/account/orders', color: '#10b981' },
        { title: 'Mes Favoris', icon: <FolderOpen />, path: '/favorites', color: '#f43f5e' },
    ];

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 12, mb: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                    <LinearProgress sx={{ width: '100%', maxWidth: 400, borderRadius: 2 }} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 8 }, mb: 8 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    mb: 5,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.info.main || '#8b5cf6', 0.8)} 100%)`,
                    color: 'white',
                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)',
                }}
            >
                {/* Decorative Elements */}
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
                <Box sx={{ position: 'absolute', bottom: -100, left: '15%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />

                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 3, md: 4 } }}>
                    <Avatar
                        sx={{
                            width: { xs: 100, md: 120 },
                            height: { xs: 100, md: 120 },
                            bgcolor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '3px solid rgba(255,255,255,0.5)',
                            fontSize: '3.5rem',
                            fontWeight: 700,
                            color: 'white',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h3" gutterBottom fontWeight={800} sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)', fontSize: { xs: '2rem', md: '3rem' } }}>
                            Bonjour, {user?.full_name || user?.email?.split('@')[0] || 'Cher client'} 👋
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600 }}>
                            Bienvenue sur votre espace personnel. Gérez vos commandes, vos favoris et vos paramètres en toute simplicité.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Statistiques / KPIs */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card
                            elevation={0}
                            onClick={() => router.push(stat.path)}
                            sx={{
                                height: '100%',
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.4),
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: `0 16px 32px -10px ${alpha(stat.color, 0.3)}`,
                                    borderColor: alpha(stat.color, 0.4),
                                    '& .stat-icon-wrapper': {
                                        transform: 'scale(1.1) rotate(8deg)',
                                    }
                                },
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ height: '100%' }}>
                                    <Box>
                                        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.75rem', letterSpacing: 1.2 }}>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color="text.primary" mt={0.5}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box
                                        className="stat-icon-wrapper"
                                        sx={{
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: stat.bgColor,
                                            color: stat.color,
                                            transition: 'all 0.4s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `inset 0 0 0 1px ${alpha(stat.color, 0.1)}`
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Commandes Récentes */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 0, 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: alpha(theme.palette.divider, 0.4),
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box sx={{ 
                            p: 3, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            borderBottom: '1px solid', 
                            borderColor: 'divider', 
                            bgcolor: alpha(theme.palette.background.paper, 0.5) 
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 40, height: 40 }}>
                                    <Inventory2 sx={{ fontSize: 20 }} />
                                </Avatar>
                                <Typography variant="h5" fontWeight={700}>
                                    Commandes Récentes
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                endIcon={<ChevronRight />}
                                onClick={() => router.push('/account/orders')}
                                sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                            >
                                Voir tout
                            </Button>
                        </Box>

                        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: recentOrders.length === 0 ? 'center' : 'flex-start' }}>
                            {recentOrders.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                    <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 3, bgcolor: alpha(theme.palette.text.disabled, 0.05), color: theme.palette.text.secondary }}>
                                        <ShoppingBag sx={{ fontSize: 50, opacity: 0.5 }} />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
                                        Aucune commande trouvée
                                    </Typography>
                                    <Typography variant="body1" color="text.disabled" mb={4}>
                                        Votre historique de commandes est vide.
                                    </Typography>
                                    <Button variant="contained" size="large" disableElevation onClick={() => router.push('/shop')} sx={{ borderRadius: 3, px: 5, fontWeight: 700, textTransform: 'none' }}>
                                        Commencer à acheter
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={1.5}>
                                    {recentOrders.map((order) => (
                                        <Card
                                            key={order.id}
                                            elevation={0}
                                            sx={{
                                                border: '1px solid transparent',
                                                bgcolor: alpha(theme.palette.background.default, 0.4),
                                                borderRadius: 3,
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: 'background.paper',
                                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                                    transform: 'translateX(6px)',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                                                },
                                            }}
                                            onClick={() => router.push(`/account/orders/${order.id}`)}
                                        >
                                            <CardContent sx={{ py: '16px !important' }}>
                                                <Grid container alignItems="center" spacing={3} sx={{ mb: { xs: 1, sm: 0} }}>
                                                    <Grid size={{ xs: 12, sm: 4 }}>
                                                        <Typography variant="caption" color="text.tertiary" fontWeight={600} textTransform="uppercase" display="block" mb={0.5}>
                                                            N° Commande
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body1" fontWeight={700}>
                                                                {order.orderNumber || `${order.id}`}
                                                            </Typography>
                                                            {order.productImages && order.productImages.length > 0 && (
                                                                <AvatarGroup
                                                                    max={4}
                                                                    sx={{
                                                                        '& .MuiAvatar-root': {
                                                                            width: 38,
                                                                            height: 38,
                                                                            fontSize: '0.65rem',
                                                                            border: '2px solid',
                                                                            borderColor: 'background.paper',
                                                                        },
                                                                    }}
                                                                >
                                                                    {order.productImages.map((imageUrl: string, index: number) => (
                                                                        <Avatar
                                                                            key={index}
                                                                            alt={`Produit ${index + 1}`}
                                                                            src={imageUrl}
                                                                            sx={{ width: 24, height: 24 }}
                                                                        />
                                                                    ))}
                                                                </AvatarGroup>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 6, sm: 3 }}>
                                                        <Typography variant="caption" color="text.tertiary" fontWeight={600} textTransform="uppercase" display="block" mb={0.5}>
                                                            Date
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Non disponible'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6, sm: 3 }}>
                                                        <Typography variant="caption" color="text.tertiary" fontWeight={600} textTransform="uppercase" display="block" mb={0.5}>
                                                            Montant
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight={800} color="text.primary">
                                                            {order.totalAmount ? StatsService.formatAmount(order.totalAmount, 'XOF') : 'Non disponible'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 6, sm: 2 }}>
                                                        <Typography variant="caption" color="text.tertiary" fontWeight={600} textTransform="uppercase" display="block" mb={0.5}>
                                                            Statut
                                                        </Typography>
                                                        <Chip
                                                            label={getStatusLabel(order.status)}
                                                            color={getStatusColor(order.status) as any}
                                                            size="medium"
                                                            sx={{ 
                                                                fontWeight: 700, 
                                                                borderRadius: 2,
                                                                height: 32,
                                                                px: 1,
                                                                bgcolor: alpha(theme.palette[getStatusColor(order.status) as 'primary'|'success'|'warning'|'error'|'info']?.main || '#999', 0.1),
                                                                color: theme.palette[getStatusColor(order.status) as 'primary'|'success'|'warning'|'error'|'info']?.main,
                                                                border: 'none',
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Actions Rapides & Aide */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={4} sx={{ height: '100%' }}>
                        {/* Tuiles d'actions rapides */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                border: '1px solid', 
                                borderColor: alpha(theme.palette.divider, 0.4),
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' }}>
                                    <Settings sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight={700}>
                                    Gérer mon Cpte
                                </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                                {quickActions.map((action, index) => (
                                    <Grid size={{ xs: 6 }} key={index}>
                                        <Paper
                                            component={Link}
                                            href={action.path}
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 2,
                                                height: '100%',
                                                borderRadius: 3,
                                                textDecoration: 'none',
                                                color: 'text.primary',
                                                bgcolor: alpha(action.color, 0.04),
                                                border: '1px solid transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: alpha(action.color, 0.08),
                                                    borderColor: alpha(action.color, 0.2),
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: `0 8px 24px ${alpha(action.color, 0.12)}`,
                                                }
                                            }}
                                        >
                                            <Avatar sx={{ 
                                                bgcolor: action.color, 
                                                color: 'white', 
                                                width: 50, 
                                                height: 50, 
                                                boxShadow: `0 4px 12px ${alpha(action.color, 0.3)}` 
                                            }}>
                                                {action.icon}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={600} textAlign="center">
                                                {action.title}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        {/* Box D'assistance */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                borderRadius: 4, 
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.info.main, 0.15),
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative background circle */}
                            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: alpha(theme.palette.info.main, 0.05) }} />

                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'white', mb: 2, color: 'info.main', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', position: 'relative', zIndex: 1 }}>
                                <HeadsetMic sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
                                Besoin d'assistance ?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4, position: 'relative', zIndex: 1, maxWidth: 280 }}>
                                Notre équipe de support client est disponible pour répondre à vos questions 7j/7.
                            </Typography>
                            <Button
                                variant="contained"
                                color="info"
                                disableElevation
                                component={Link}
                                href="/contact"
                                sx={{ borderRadius: 8, px: 5, py: 1.5, fontWeight: 700, textTransform: 'none', position: 'relative', zIndex: 1 }}
                            >
                                Contacter l'aide
                            </Button>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}

export default function AccountPage() {
    return (
        <RequireRole allowedRoles={['client']}>
            <AccountPageContent />
        </RequireRole>
    );
}
