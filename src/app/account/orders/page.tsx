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
    Menu,
    MenuItem,
    TablePagination,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import { MoreVert, ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderService, { ORDER_STATUS, PAYMENT_STATUS } from '@/services/order.service';
import { OrderResponse } from '@/services/order.service';

function OrdersContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOrderId, setMenuOrderId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await OrderService.getCustomerOrders(page, rowsPerPage);
            setOrders(ordersData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage]);

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

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuOrderId(orderId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuOrderId(null);
    };

    const handleMenuAction = (action: string, order: OrderResponse) => {
        handleMenuClose();
        switch (action) {
            case 'cancel':
                openCancelDialog(order);
                break;
            case 'details':
                router.push(`/account/orders/${order.id}`);
                break;
            case 'change_info':
                router.push(`/checkout?orderId=${order.id}`);
                break;
            case 'validate':
                // TODO: Implémenter la validation
                console.log('Valider commande', order.id);
                break;
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

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Mes Commandes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Historique de vos commandes
                </Typography>
            </Box>

            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>N° Commande</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Articles</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Total</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Statut</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        hover
                                        sx={{ '&:last-child td': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="primary">
                                                {order.order_number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {OrderService.formatDate(order.created_at)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ShoppingBagIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {order.items_count || 0}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {OrderService.formatAmount(order.total_amount, order.currency)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={OrderService.getStatusLabel(order.status)}
                                                color={OrderService.getStatusColor(order.status)}
                                                size="small"
                                                sx={{ fontWeight: 'medium' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, order.id)}
                                                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                anchorEl={menuAnchorEl}
                                                open={menuOrderId === order.id}
                                                onClose={handleMenuClose}
                                                PaperProps={{
                                                    elevation: 3,
                                                    sx: { minWidth: 180 }
                                                }}
                                            >
                                                {order.status === ORDER_STATUS.PENDING && (
                                                    <MenuItem onClick={() => handleMenuAction('cancel', order)} sx={{ color: 'error.main' }}>
                                                        Annuler
                                                    </MenuItem>
                                                )}
                                                <MenuItem onClick={() => handleMenuAction('details', order)} sx={{ color: 'primary.main' }}>
                                                    Détails
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuAction('change_info', order)} sx={{ color: 'info.main' }}>
                                                    Changer mes informations
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuAction('validate', order)} sx={{ color: 'success.main' }}>
                                                    Valider
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={-1} // -1 indique que le nombre total n'est pas connu
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Lignes par page:"
                        labelDisplayedRows={({ from, to }: { from: number; to: number }) => `${from}-${to}`}
                        sx={{ borderTop: 1, borderColor: 'divider' }}
                    />
                </CardContent>
            </Card>

            {orders.length === 0 && (
                <Card elevation={0} sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50' }}>
                    <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Vous n'avez pas encore de commandes
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.href = '/shop'}
                    >
                        Commencer vos achats
                    </Button>
                </Card>
            )}

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
