'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState, ChangeEvent } from 'react';
import OrderService, { PAYMENT_METHODS } from '@/services/order.service';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, loadCart, cartLoading, cartError } = useStore();
    const router = useRouter();
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Charger le panier au montage
    React.useEffect(() => {
        loadCart();
    }, [loadCart]);

    // Formulaire de livraison
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Sénégal',
        paymentMethod: PAYMENT_METHODS.PAYDUNYA
    });

    // États pour la gestion des commandes
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const total = (cart || []).reduce((sum, item) => {
        const price = item.priceType === 'wholesale' ? item.product.wholesale_price : item.product.price;
        return sum + (price || 0) * item.quantity;
    }, 0);

    const handleCheckout = () => {
        setShowCheckout(true);
    };

    const handlePlaceOrder = async () => {
        // Validation simple
        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            // Préparer les données de commande
            const orderData = {
                items: cart.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    unit_price: item.priceType === 'wholesale' 
                        ? item.product.wholesale_price || 0 
                        : item.product.price || 0
                })),
                shipping_address: {
                    street: shippingInfo.address,
                    city: shippingInfo.city,
                    country: shippingInfo.country,
                    phone: shippingInfo.phone
                },
                currency: 'XOF',
                payment_method: shippingInfo.paymentMethod,
                order_type: 'standard'
            };

            // Créer la commande via l'API
            const order = await OrderService.createOrderFromCart(
                cart,
                orderData.shipping_address,
                orderData.payment_method,
                orderData.currency
            );

            setSuccess(`Commande ${order.order_number} créée avec succès!`);
            
            // Vider le panier et rediriger
            clearCart();
            setOrderPlaced(true);

            setTimeout(() => {
                router.push('/account/orders');
            }, 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création de la commande');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                        ✅ Commande passée avec succès !
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Merci pour votre achat. Vous allez être redirigé vers l'accueil...
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/')}
                    >
                        Retour à l'accueil
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Votre panier est vide
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => router.push('/shop')}
                        sx={{ mt: 2 }}
                    >
                        Continuer vos achats
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {showCheckout ? 'Finaliser la commande' : 'Mon Panier'}
            </Typography>

            {!showCheckout ? (
                // Vue Panier
                <Paper sx={{ mt: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produit</TableCell>
                                    <TableCell>Prix</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(cart) && cart.map((item, index) => {
                                    const price = item.priceType === 'wholesale'
                                        ? item.product.wholesale_price
                                        : item.product.price;
                                    const itemTotal = (price || 0) * item.quantity;

                                    return (
                                        <TableRow key={`${item.product.id}-${index}`}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <img
                                                        src={item.product.cover_image_url || ''}
                                                        alt={item.product.name}
                                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body1">{item.product.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.priceType === 'wholesale' ? 'Prix gros' : 'Prix détail'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{(price || 0).toFixed(2)} €</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography>{item.quantity}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{itemTotal.toFixed(2)} €</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={clearCart}
                        >
                            Vider le panier
                        </Button>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h5" gutterBottom>
                                Total: {total.toFixed(2)} €
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => router.push('/shop')}
                                >
                                    Continuer vos achats
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleCheckout}
                                >
                                    Passer la commande
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                // Vue Checkout
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Informations de livraison
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom complet"
                                        value={shippingInfo.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        value={shippingInfo.phone}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ville"
                                        value={shippingInfo.city}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Pays"
                                        value={shippingInfo.country}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Adresse complète"
                                        multiline
                                        rows={2}
                                        value={shippingInfo.address}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom>
                                Méthode de paiement
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {[
                                    { value: PAYMENT_METHODS.PAYDUNYA, label: 'PayDunya' },
                                    { value: PAYMENT_METHODS.WAVE, label: 'Wave' },
                                    { value: PAYMENT_METHODS.ORANGE_MONEY, label: 'Orange Money' },
                                    { value: PAYMENT_METHODS.CASH, label: 'Espèces' }
                                ].map((method) => (
                                    <Button
                                        key={method.value}
                                        variant={shippingInfo.paymentMethod === method.value ? 'contained' : 'outlined'}
                                        onClick={() => setShippingInfo({ ...shippingInfo, paymentMethod: method.value as any })}
                                    >
                                        {method.label}
                                    </Button>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Récapitulatif
                            </Typography>

                            {Array.isArray(cart) && cart.map((item, index) => {
                                const price = item.priceType === 'wholesale'
                                    ? item.product.wholesale_price
                                    : item.product.price;
                                const itemTotal = (price || 0) * item.quantity;

                                return (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            {item.product.name} x{item.quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            {itemTotal.toFixed(2)} €
                                        </Typography>
                                    </Box>
                                );
                            })}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" color="primary">
                                    {total.toFixed(2)} €
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Retour au panier
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handlePlaceOrder}
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                >
                                    {isSubmitting ? 'Création en cours...' : 'Confirmer la commande'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        {/* Messages d'erreur et de succès */}
        <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>

        <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                {success}
            </Alert>
        </Snackbar>
        </Container>
    );
}
