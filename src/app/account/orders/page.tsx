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
    Snackbar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useState, useEffect } from 'react';
import OrderService, { ORDER_STATUS, PAYMENT_STATUS } from '@/services/order.service';
import { OrderResponse } from '@/services/order.service';

function OrdersContent() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await OrderService.getCustomerOrders(0, 20);
            setOrders(ordersData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (order: OrderResponse) => {
        try {
            setError(null);
            await OrderService.cancelCustomerOrder(order.id);
            setSuccess(`Commande ${order.order_number} annulée avec succès`);
            setCancelDialogOpen(false);
            setSelectedOrder(null);
            // Rafraîchir la liste
            fetchOrders();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'annulation de la commande');
        }
    };

    const openCancelDialog = (order: OrderResponse) => {
        setSelectedOrder(order);
        setCancelDialogOpen(true);
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Mes Commandes
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Historique de vos commandes
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>N° Commande</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Articles</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {order.order_number}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {OrderService.formatDate(order.created_at)}
                                    </TableCell>
                                    <TableCell>{order.items_count || 0}</TableCell>
                                    <TableCell>
                                        {OrderService.formatAmount(order.total_amount, order.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={OrderService.getStatusLabel(order.status)}
                                            color={OrderService.getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {order.status === ORDER_STATUS.PENDING && (
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => openCancelDialog(order)}
                                            >
                                                Annuler
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            onClick={() => window.location.href = `/account/orders/${order.id}`}
                                        >
                                            Détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {orders.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Vous n'avez pas encore de commandes
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => window.location.href = '/shop'}
                        >
                            Commencer vos achats
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Dialogue de confirmation d'annulation */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Confirmer l'annulation</DialogTitle>
                <DialogContent>
                    <Typography>
                        Êtes-vous sûr de vouloir annuler la commande {selectedOrder?.order_number} ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        onClick={() => selectedOrder && handleCancelOrder(selectedOrder)}
                        color="error"
                        variant="contained"
                    >
                        Confirmer l'annulation
                    </Button>
                </DialogActions>
            </Dialog>

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

export default function OrdersPage() {
    return (
        <RequireRole allowedRoles={['client']}>
            <OrdersContent />
        </RequireRole>
    );
}
