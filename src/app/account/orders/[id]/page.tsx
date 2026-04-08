'use client';

import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/contexts/AuthContext';
import {
    Typography,
    Container,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Divider,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    LinearProgress,
    Breadcrumbs,
    Link,
    Stack,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    ShoppingCart as CartIcon,
    ShoppingCart as ShoppingCartIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as PendingIcon,
    AccessTime as ScheduleIcon,
    LocalOffer as ProductIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Home as HomeIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderService, { ORDER_STATUS, PAYMENT_STATUS } from '@/services/order.service';
import { OrderResponse, Payment } from '@/services/order.service';
import { getImageUrl } from '@/lib/imageUtils';

// Interface locale pour étendre le type produit
interface ProductWithImage {
    id: number;
    name: string;
    sku: string;
    cover_image_url?: string;
}

function OrderDetailContent() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingQuantities, setEditingQuantities] = useState<{[key: number]: number}>({});
    const [modifications, setModifications] = useState<Array<{
        action: 'add' | 'remove' | 'update';
        product_id: number;
        quantity?: number;
        unit_price?: number;
    }>>([]);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Récupérer les détails de la commande
            const orderData = await OrderService.getOrderDetails(orderId);
            setOrder(orderData);

            // Récupérer les paiements associés
            try {
                const paymentsData = await OrderService.getOrderPayments(orderId);
                setPayments(paymentsData);
            } catch (paymentError) {
                // Les paiements peuvent ne pas exister, ce n'est pas une erreur critique
                console.warn('Impossible de récupérer les paiements:', paymentError);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la commande');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            return;
        }

        try {
            setCancelling(true);
            await OrderService.cancelCustomerOrder(order.id);
            await fetchOrderDetails(); // Recharger les détails
        } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
            setError('Impossible d\'annuler la commande. Veuillez réessayer.');
        } finally {
            setCancelling(false);
        }
    };

    const handleValidateOrder = async () => {
        if (!order) return;
        
        if (!window.confirm('Êtes-vous sûr de vouloir valider cette commande ? Cette action la confirmera pour le paiement.')) {
            return;
        }

        try {
            setCancelling(true);
            
            // TODO: Intégration avec API externe pour la validation
            // Pour l'instant, nous allons juste simuler la validation
            // et mettre à jour le statut de la commande
            
            // Appel à l'API externe (à implémenter)
            // const response = await fetch('https://api-paiement-externe.com/validate', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         orderId: order.id,
            //         amount: order.total_amount,
            //         currency: order.currency
            //     })
            // });
            
            // Simulation d'une validation réussie
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler l'appel API
            
            // Recharger les détails pour voir le nouveau statut
            await fetchOrderDetails();
            
            // Message de succès
            alert('Commande validée avec succès ! Vous allez être redirigé vers la page de paiement.');
            
            // TODO: Rediriger vers la page de paiement de l'API externe
            // window.location.href = response.paymentUrl;
            
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
            setError('Impossible de valider la commande. Veuillez réessayer.');
        } finally {
            setCancelling(false);
        }
    };

    const handleBack = () => {
        router.push('/account/orders');
    };

    const handleStartEditing = () => {
        setIsEditing(true);
        setModifications([]);
        // Initialiser les quantités d'édition
        if (order?.items) {
            const quantities: {[key: number]: number} = {};
            order.items.forEach(item => {
                quantities[item.id] = item.quantity;
            });
            setEditingQuantities(quantities);
        }
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
        setEditingQuantities({});
        setModifications([]);
    };

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        const oldQuantity = editingQuantities[itemId] || 0;
        setEditingQuantities(prev => ({
            ...prev,
            [itemId]: newQuantity
        }));

        // Ajouter la modification à la liste
        const item = order?.items.find(i => i.id === itemId);
        if (item) {
            setModifications(prev => {
                // Supprimer les modifications précédentes pour cet item
                const filtered = prev.filter(mod => mod.product_id !== item.product_id);
                
                // Ajouter la nouvelle modification si la quantité a changé
                if (newQuantity !== item.quantity) {
                    return [...filtered, {
                        action: 'update',
                        product_id: item.product_id,
                        quantity: newQuantity,
                        unit_price: parseFloat(item.unit_price)
                    }];
                }
                
                return filtered;
            });
        }
    };

    const handleRemoveItem = (itemId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article de la commande ?')) {
            return;
        }
        
        const item = order?.items.find(i => i.id === itemId);
        if (item) {
            // Ajouter la modification de suppression
            setModifications(prev => [
                ...prev.filter(mod => mod.product_id !== item.product_id),
                {
                    action: 'remove',
                    product_id: item.product_id
                }
            ]);

            // Mettre à jour l'affichage local
            if (order?.items) {
                const updatedItems = order.items.filter(i => i.id !== itemId);
                setOrder({
                    ...order,
                    items: updatedItems
                });
            }

            // Mettre à jour les quantités d'édition
            const newQuantities = {...editingQuantities};
            delete newQuantities[itemId];
            setEditingQuantities(newQuantities);
        }
    };

    const handleSaveOrder = async () => {
        if (!order || modifications.length === 0) {
            alert('Aucune modification à sauvegarder.');
            return;
        }

        try {
            setCancelling(true);
            
            // Vérifier l'authentification avant l'appel API
            const { isAuthenticated } = await import('@/lib/authUtils');
            
            if (!isAuthenticated()) {
                setError('Votre session a expiré. Veuillez vous reconnecter.');
                // Rediriger vers la page de connexion après un délai
                setTimeout(() => {
                    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                }, 2000);
                return;
            }
            
            // Appeler l'API de modification
            const updatedOrder = await OrderService.modifyOrder(order.id, modifications);
            
            // Mettre à jour l'état local avec la réponse du backend
            setOrder(updatedOrder);
            
            setIsEditing(false);
            setEditingQuantities({});
            setModifications([]);
            
            alert('Commande modifiée avec succès !');
            
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'Impossible de modifier la commande. Veuillez réessayer.';
            
            // Si l'erreur est liée à l'authentification, on efface l'erreur après un délai
            if (errorMessage.includes('reconnecter') || errorMessage.includes('session a expiré')) {
                setError(errorMessage);
                setTimeout(() => {
                    setError(null);
                    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                }, 3000);
            } else {
                setError(errorMessage);
            }
        } finally {
            setCancelling(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <CheckCircleIcon />;
            case 'cancelled':
                return <CancelIcon />;
            case 'pending':
                return <PendingIcon />;
            case 'processing':
            case 'confirmed':
            case 'shipped':
                return <ShippingIcon />;
            default:
                return <ScheduleIcon />;
        }
    };

    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircleIcon />;
            case 'failed':
                return <CancelIcon />;
            default:
                return <PendingIcon />;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Erreur
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {error || 'Commande introuvable'}
                    </Typography>
                    <Button variant="contained" onClick={handleBack}>
                        Retour aux commandes
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Bouton de retour */}
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/account/orders')}
                    sx={{ 
                        borderColor: 'rgba(0,0,0,0.23)',
                        color: 'text.primary',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText'
                        }
                    }}
                >
                    Retour aux commandes
                </Button>
            </Box>

            {/* En-tête avec statut */}
            <Paper 
                sx={{ 
                    p: 4, 
                    mb: 4, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <ShoppingCartIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        Commande {order.order_number}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Passée le {OrderService.formatDate(order.created_at)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                       
                    </Grid>
                </Box>
                {/* Décoration d'arrière-plan */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: -20, 
                    right: -20, 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)' 
                }} />
                <Box sx={{ 
                    position: 'absolute', 
                    bottom: -30, 
                    left: -30, 
                    width: 180, 
                    height: 180, 
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)' 
                }} />
            </Paper>

            <Grid container spacing={4}>
                {/* Articles de la commande */}
                <Grid item xs={12} lg={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <CartIcon />
                                </Avatar>
                            }
                            title={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Articles commandés ({order.items?.length || 0})
                                    </Typography>
                                    {order.status === ORDER_STATUS.PENDING && (
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            {isEditing && modifications.length > 0 && (
                                                <Chip 
                                                    label={`${modifications.length} modification${modifications.length > 1 ? 's' : ''}`}
                                                    size="small"
                                                    color="warning"
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                            )}
                                            {!isEditing ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={handleStartEditing}
                                                >
                                                    Modifier
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={handleCancelEditing}
                                                >
                                                    Annuler
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            }
                            subheader={
                                <Typography variant="body2" color="text.secondary">
                                    Détails des produits de votre commande
                                </Typography>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            {order.items?.map((item, index) => (
                                <Box key={item.id}>
                                    <Box sx={{ 
                                        p: 3, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 3,
                                        border: isEditing && modifications.some(mod => mod.product_id === item.product_id) ? '2px solid' : '1px solid',
                                        borderColor: isEditing && modifications.some(mod => mod.product_id === item.product_id) ? 'warning.main' : 'grey.200',
                                        borderRadius: 1,
                                        backgroundColor: isEditing && modifications.some(mod => mod.product_id === item.product_id) ? 'warning.light' : 'transparent'
                                    }}>
                                        {(item.product as ProductWithImage).cover_image_url ? (
                                            <Box
                                                sx={{ 
                                                    width: 64, 
                                                    height: 64,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <img
                                                    src={getImageUrl((item.product as ProductWithImage).cover_image_url)}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Avatar 
                                                sx={{ 
                                                    width: 64, 
                                                    height: 64,
                                                    bgcolor: 'grey.100',
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <ProductIcon sx={{ color: 'grey.600' }} />
                                            </Avatar>
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6" fontWeight="medium" gutterBottom>
                                                    {item.product.name}
                                                </Typography>
                                                {isEditing && modifications.some(mod => mod.product_id === item.product_id) && (
                                                    <Chip 
                                                        label="modifié"
                                                        size="small"
                                                        color="warning"
                                                        sx={{ fontSize: '0.6rem', height: 20 }}
                                                    />
                                                )}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                                                {isEditing ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleQuantityChange(item.id, (editingQuantities[item.id] || item.quantity) - 1)}
                                                            disabled={(editingQuantities[item.id] || item.quantity) <= 1}
                                                        >
                                                            <Typography variant="body2">-</Typography>
                                                        </IconButton>
                                                        <Typography variant="body2" sx={{ minWidth: '30px', textAlign: 'center' }}>
                                                            {editingQuantities[item.id] || item.quantity}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleQuantityChange(item.id, (editingQuantities[item.id] || item.quantity) + 1)}
                                                        >
                                                            <Typography variant="body2">+</Typography>
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Chip 
                                                        label={`Qté: ${item.quantity}`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontSize: '0.75rem' }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {OrderService.formatAmount(item.unit_price, order.currency)} × {isEditing ? (editingQuantities[item.id] || item.quantity) : item.quantity}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                {OrderService.formatAmount(
                                                    isEditing 
                                                        ? (parseFloat(item.unit_price) * (editingQuantities[item.id] || item.quantity)).toFixed(2)
                                                        : item.total_price, 
                                                    order.currency
                                                )}
                                            </Typography>
                                            {isEditing && (
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    <CancelIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Box>
                                    {index < (order.items?.length || 0) - 1 && <Divider />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions - Uniquement si la commande est en attente et non annulée */}
                    {order.status === ORDER_STATUS.PENDING && (
                        <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {isEditing ? 'Modification de la commande' : 'Commande en attente de confirmation'}
                                        </Typography>
                                        <Typography variant="body2">
                                            {isEditing 
                                                ? 'Modifiez les quantités ou supprimez des articles, puis sauvegardez.'
                                                : 'Vous pouvez modifier ou annuler cette commande tant qu\'elle n\'est pas confirmée.'
                                            }
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ArrowBackIcon />}
                                            onClick={() => router.push('/account/orders')}
                                            sx={{ 
                                                borderColor: 'rgba(255,255,255,0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                                }
                                            }}
                                        >
                                            Retour
                                        </Button>
                                        
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleSaveOrder}
                                                    disabled={cancelling}
                                                    startIcon={cancelling ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                                                    size="large"
                                                    sx={{ 
                                                        bgcolor: 'success.main',
                                                        '&:hover': {
                                                            bgcolor: 'success.dark'
                                                        }
                                                    }}
                                                >
                                                    {cancelling ? 'Sauvegarde...' : 'Sauvegarder'}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleCancelEditing}
                                                    disabled={cancelling}
                                                    startIcon={<CancelIcon />}
                                                    size="large"
                                                    sx={{ 
                                                        borderColor: 'rgba(255,255,255,0.5)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            borderColor: 'white',
                                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                                        }
                                                    }}
                                                >
                                                    Annuler
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleValidateOrder()}
                                                    disabled={cancelling}
                                                    startIcon={cancelling ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                                                    size="large"
                                                    sx={{ 
                                                        bgcolor: 'success.main',
                                                        '&:hover': {
                                                            bgcolor: 'success.dark'
                                                        }
                                                    }}
                                                >
                                                    {cancelling ? 'Validation...' : 'Valider la commande'}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleCancelOrder}
                                                    disabled={cancelling}
                                                    startIcon={cancelling ? <CircularProgress size={16} /> : <CancelIcon />}
                                                    size="large"
                                                >
                                                    {cancelling ? 'Annulation...' : 'Annuler la commande'}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Message si commande annulée */}
                    {order.status === ORDER_STATUS.CANCELLED && (
                        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CancelIcon sx={{ fontSize: 40 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                Commande annulée
                                            </Typography>
                                            <Typography variant="body2">
                                                Cette commande a été annulée et ne peut plus être modifiée.
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ArrowBackIcon />}
                                        onClick={() => router.push('/account/orders')}
                                        sx={{ 
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            color: 'white',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor: 'rgba(255,255,255,0.1)'
                                            }
                                        }}
                                    >
                                        Retour aux commandes
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Informations de livraison et paiement */}
                <Grid item xs={12} lg={4}>
                    {/* Récapitulatif */}
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <PaymentIcon />
                                </Avatar>
                            }
                            title="Récapitulatif"
                            subheader="Détails financiers"
                        />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Sous-total
                                    </Typography>
                                    <Typography variant="body2">
                                        {OrderService.formatAmount(order.total_amount, order.currency)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Livraison
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        Gratuit
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Total
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        {OrderService.formatAmount(order.total_amount, order.currency)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Adresse de livraison */}
                    <Card sx={{ mb: 3 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <ShippingIcon />
                                </Avatar>
                            }
                            title="Adresse de livraison"
                            subheader="Où sera livrée votre commande"
                        />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LocationIcon color="action" />
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {order.shipping_address.street}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {order.shipping_address.city}, {order.shipping_address.country}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <PhoneIcon color="action" />
                                    <Typography variant="body2">
                                        {order.shipping_address.phone}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Informations de paiement */}
                    {payments.length > 0 && (
                        <Card>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                        <PaymentIcon />
                                    </Avatar>
                            }
                            title="Informations de paiement"
                            subheader="Détails de transaction"
                        />
                            <Divider />
                            <CardContent>
                                {payments.map((payment) => (
                                    <Box key={payment.id}>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Méthode
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {payment.payment_method}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Montant
                                                </Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {OrderService.formatAmount(payment.amount, payment.currency)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Statut
                                                </Typography>
                                                <Chip
                                                    icon={getPaymentStatusIcon(payment.status)}
                                                    label={OrderService.getPaymentStatusLabel(payment.status)}
                                                    size="small"
                                                    color={payment.status === 'paid' ? 'success' : 'warning'}
                                                />
                                            </Box>
                                            {payment.transaction_id && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Transaction
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                        {payment.transaction_id}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Typography variant="caption" color="text.secondary">
                                                {OrderService.formatDate(payment.created_at)}
                                            </Typography>
                                        </Stack>
                                        {payments.indexOf(payment) < payments.length - 1 && <Divider sx={{ my: 2 }} />}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default function OrderDetailPage() {
    return (
        <RequireRole allowedRoles={['client']}>
            <OrderDetailContent />
        </RequireRole>
    );
}
