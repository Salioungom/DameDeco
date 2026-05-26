'use client';

import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    TextField,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Snackbar,
    useTheme,
    alpha,
    Chip,
    Skeleton,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingBagOutlined,
    ArrowBack,
    ArrowForward,
    LocalShippingOutlined,
    PaymentOutlined,
    CheckCircleOutline,
    KeyboardArrowLeft,
} from '@mui/icons-material';
import { useStore } from '@/store/useStore';
import { useCartWithProducts } from '@/hooks/useCartWithProducts';
import OrderService, { PAYMENT_METHODS } from '@/services/order.service';

export default function CartPage() {
    const theme = useTheme();
    const router = useRouter();
    const { removeFromCart, updateQuantity, clearCart, loadCart, cartLoading, cartError } = useStore();
    const { cart: cartWithProducts, loading: productsLoading } = useCartWithProducts();
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const brandBlue = '#185FA5';
    const brandDark = '#042C53';

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Sénégal',
        paymentMethod: PAYMENT_METHODS.PAYDUNYA
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const total = useMemo(() =>
        (cartWithProducts || []).reduce((sum, item) => {
            const price = item.product
                ? (item.price_type === 'wholesale' ? (item.product.wholesale_price || 0) : (item.product.price || 0))
                : (item.unit_price || 0);
            return sum + price * item.quantity;
        }, 0),
    [cartWithProducts]);

    const itemCount = cartWithProducts?.length ?? 0;

    const handleCheckout = () => setShowCheckout(true);

    const handlePlaceOrder = async () => {
        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const order = await OrderService.createOrderFromCart(
                cartWithProducts,
                {
                    first_name: shippingInfo.name.split(' ')[0] || 'Client',
                    last_name: shippingInfo.name.split(' ').slice(1).join(' ') || '',
                    address: shippingInfo.address,
                    street: shippingInfo.address,
                    city: shippingInfo.city,
                    country: shippingInfo.country,
                    phone: shippingInfo.phone,
                },
                shippingInfo.paymentMethod,
                'XOF',
            );

            setSuccess(`Commande ${order.order_number} créée avec succès !`);
            clearCart();
            setOrderPlaced(true);

            setTimeout(() => router.push('/account/orders'), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création de la commande');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = cartLoading || productsLoading;

    if (orderPlaced) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Container maxWidth="sm" sx={{ pt: 14, pb: 8 }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 4,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(brandBlue, 0.04)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                mx: 'auto',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                            }}
                        >
                            <CheckCircleOutline sx={{ fontSize: 44, color: 'success.main' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Commande confirmée !
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Merci pour votre achat. Vous allez être redirigé vers vos commandes...
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/')}
                            sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 600 }}
                        >
                            Retour à l'accueil
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Container maxWidth="lg" sx={{ pt: 14, pb: 8 }}>
                    <Skeleton variant="rounded" width={240} height={40} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="rounded" width={160} height={24} sx={{ mb: 5, borderRadius: 2 }} />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2, borderRadius: 3 }} />
                    ))}
                </Container>
            </Box>
        );
    }

    if (itemCount === 0) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Container maxWidth="lg" sx={{ pt: 14, pb: 8 }}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: { xs: 10, md: 14 },
                            px: 4,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(brandBlue, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                            border: `1px solid ${alpha(brandBlue, 0.12)}`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                mx: 'auto',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${alpha(brandBlue, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                                border: `2px solid ${alpha(brandBlue, 0.18)}`,
                            }}
                        >
                            <ShoppingBagOutlined sx={{ fontSize: 44, color: brandBlue }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>
                            Votre panier est vide
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 4, lineHeight: 1.7 }}>
                            Parcourez notre catalogue et ajoutez vos articles préférés à votre panier.
                        </Typography>
                        <Button
                            variant="contained"
                            component={Link}
                            href="/shop"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                fontWeight: 600,
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }}
                        >
                            Découvrir nos produits
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!showCheckout) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Box
                    sx={{
                        background: `linear-gradient(135deg, ${alpha(brandBlue, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                        borderBottom: `1px solid ${alpha(brandBlue, 0.1)}`,
                        pt: { xs: 12, md: 14 },
                        pb: { xs: 4, md: 5 },
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    fontWeight={800}
                                    sx={{ fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.02em' }}
                                >
                                    Mon Panier
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, fontSize: 15 }}>
                                    {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 3,
                                    py: 1.25,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${alpha(brandBlue, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                                    border: `1px solid ${alpha(brandBlue, 0.18)}`,
                                }}
                            >
                                <ShoppingBagOutlined sx={{ fontSize: 20, color: brandBlue }} />
                                <Typography fontWeight={700} fontSize={18} color={brandBlue}>
                                    {itemCount}
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
                    {cartError && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{cartError}</Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {cartWithProducts.map((item) => {
                            const price = item.product
                                ? (item.price_type === 'wholesale' ? (item.product.wholesale_price || 0) : (item.product.price || 0))
                                : (item.unit_price || 0);
                            const itemTotal = price * item.quantity;

                            return (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        gap: { xs: 2, md: 3 },
                                        p: { xs: 2, md: 2.5 },
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                                        '&:hover': {
                                            borderColor: alpha(brandBlue, 0.2),
                                            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 80, md: 100 },
                                            height: { xs: 80, md: 100 },
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            bgcolor: 'action.hover',
                                            flexShrink: 0,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                                        }}
                                    >
                                        {item.product && (
                                            <Box
                                                component="img"
                                                src={item.product.cover_image_url || ''}
                                                alt={item.product.name}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                                                {item.product?.name || `Produit #${item.product_id}`}
                                            </Typography>
                                            <Chip
                                                label={item.price_type === 'wholesale' ? 'Prix gros' : 'Prix détail'}
                                                size="small"
                                                sx={{
                                                    mt: 0.5,
                                                    height: 20,
                                                    fontSize: 10,
                                                    fontWeight: 600,
                                                    bgcolor: alpha(brandBlue, 0.1),
                                                    color: brandBlue,
                                                    border: 'none',
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2" fontWeight={700} color="primary" sx={{ mr: 1 }}>
                                                    {price.toLocaleString('fr-FR')} FCFA
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ borderRadius: 1.5, p: 0.5 }}
                                                        onClick={() => updateQuantity(item.product_id.toString(), Math.max(1, item.quantity - 1))}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Typography variant="body2" sx={{ width: 28, textAlign: 'center', fontWeight: 600 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ borderRadius: 1.5, p: 0.5 }}
                                                        onClick={() => updateQuantity(item.product_id.toString(), item.quantity + 1)}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {itemTotal.toLocaleString('fr-FR')} FCFA
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeFromCart(item.product_id.toString())}
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.error.main, 0.08),
                                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    <Box
                        sx={{
                            mt: 4,
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            bgcolor: 'background.paper',
                            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={clearCart}
                                    startIcon={<DeleteIcon />}
                                    sx={{ borderRadius: 2, fontWeight: 500 }}
                                >
                                    Vider le panier
                                </Button>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Sous-total
                                </Typography>
                                <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                                    {total.toLocaleString('fr-FR')} FCFA
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.push('/shop')}
                                        startIcon={<KeyboardArrowLeft />}
                                        sx={{ borderRadius: 2, fontWeight: 500 }}
                                    >
                                        Continuer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleCheckout}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            fontWeight: 600,
                                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        }}
                                    >
                                        Passer la commande
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(brandBlue, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                    borderBottom: `1px solid ${alpha(brandBlue, 0.1)}`,
                    pt: { xs: 12, md: 14 },
                    pb: { xs: 4, md: 5 },
                }}
            >
                <Container maxWidth="lg">
                    <Button
                        onClick={() => setShowCheckout(false)}
                        startIcon={<ArrowBack />}
                        sx={{ mb: 2, borderRadius: 2, fontWeight: 500, color: 'text.secondary' }}
                    >
                        Retour au panier
                    </Button>
                    <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{ fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.02em' }}
                    >
                        Finaliser la commande
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Box
                            sx={{
                                p: { xs: 2.5, md: 3.5 },
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LocalShippingOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                                <Typography variant="h6" fontWeight={700}>
                                    Informations de livraison
                                </Typography>
                            </Box>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom complet"
                                        value={shippingInfo.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={shippingInfo.email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        value={shippingInfo.phone}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ville"
                                        value={shippingInfo.city}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Pays"
                                        value={shippingInfo.country}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
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
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.black, 0.02),
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3.5 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                                <PaymentOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                                <Typography variant="h6" fontWeight={700}>
                                    Méthode de paiement
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                {[
                                    { value: PAYMENT_METHODS.PAYDUNYA, label: 'PayDunya' },
                                    { value: PAYMENT_METHODS.WAVE, label: 'Wave' },
                                    { value: PAYMENT_METHODS.ORANGE_MONEY, label: 'Orange Money' },
                                    { value: PAYMENT_METHODS.CASH, label: 'Espèces' },
                                ].map((method) => (
                                    <Button
                                        key={method.value}
                                        variant={shippingInfo.paymentMethod === method.value ? 'contained' : 'outlined'}
                                        onClick={() => setShippingInfo({ ...shippingInfo, paymentMethod: method.value as any })}
                                        sx={{
                                            borderRadius: 2,
                                            px: 3,
                                            py: 1,
                                            fontWeight: 600,
                                            fontSize: 13,
                                            borderColor: shippingInfo.paymentMethod === method.value ? undefined : alpha(theme.palette.divider, 0.8),
                                        }}
                                    >
                                        {method.label}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                p: { xs: 2.5, md: 3.5 },
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                position: 'sticky',
                                top: 100,
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                                Récapitulatif
                            </Typography>

                            {cartWithProducts.map((item) => {
                                const price = item.product
                                    ? (item.price_type === 'wholesale' ? (item.product.wholesale_price || 0) : (item.product.price || 0))
                                    : (item.unit_price || 0);
                                const itemTotal = price * item.quantity;

                                return (
                                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '65%' }} noWrap>
                                            {item.product?.name || `Produit #${item.product_id}`} x{item.quantity}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {itemTotal.toLocaleString('fr-FR')} FCFA
                                        </Typography>
                                    </Box>
                                );
                            })}

                            <Divider sx={{ my: 2.5 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">Sous-total</Typography>
                                <Typography fontWeight={600}>{total.toLocaleString('fr-FR')} FCFA</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">Livraison</Typography>
                                <Chip
                                    label="Gratuite"
                                    size="small"
                                    sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', border: 'none' }}
                                />
                            </Box>

                            <Divider sx={{ my: 2.5 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3.5 }}>
                                <Typography variant="h6" fontWeight={800}>Total</Typography>
                                <Typography variant="h6" fontWeight={800} color="primary">
                                    {total.toLocaleString('fr-FR')} FCFA
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                                }}
                            >
                                {isSubmitting ? 'Création en cours...' : 'Confirmer la commande'}
                            </Button>

                            <Button
                                fullWidth
                                onClick={() => setShowCheckout(false)}
                                sx={{ mt: 1.5, borderRadius: 2, fontWeight: 500, color: 'text.secondary' }}
                            >
                                Retour au panier
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ borderRadius: 2, width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{ borderRadius: 2, width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}
