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
import { MoreVert, ShoppingBag as ShoppingBagIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import OrderService, { ORDER_STATUS, PAYMENT_STATUS } from '@/services/order.service';
import { OrderResponse } from '@/services/order.service';

const STATUS_FILTERS = [
    { value: null, label: 'Toutes' },
    { value: ORDER_STATUS.PENDING, label: OrderService.getStatusLabel(ORDER_STATUS.PENDING) },
    { value: ORDER_STATUS.CONFIRMED, label: OrderService.getStatusLabel(ORDER_STATUS.CONFIRMED) },
    { value: ORDER_STATUS.PROCESSING, label: OrderService.getStatusLabel(ORDER_STATUS.PROCESSING) },
    { value: ORDER_STATUS.SHIPPED, label: OrderService.getStatusLabel(ORDER_STATUS.SHIPPED) },
    { value: ORDER_STATUS.DELIVERED, label: OrderService.getStatusLabel(ORDER_STATUS.DELIVERED) },
    { value: ORDER_STATUS.CANCELLED, label: OrderService.getStatusLabel(ORDER_STATUS.CANCELLED) },
    { value: ORDER_STATUS.REFUNDED, label: OrderService.getStatusLabel(ORDER_STATUS.REFUNDED) },
] as const;

function OrdersContent() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPageChanging, setIsPageChanging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOrderId, setMenuOrderId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [hasOrders, setHasOrders] = useState(false);
    const [statusFilter, setStatusFilter] = useState<typeof ORDER_STATUS[keyof typeof ORDER_STATUS] | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setIsPageChanging(true);
            setError(null);
            const ordersData = await OrderService.getCustomerOrders(page, rowsPerPage, statusFilter ?? undefined);
            setOrders(ordersData);
            
            // Détecter si on a atteint la dernière page
            setHasMore(ordersData.length === rowsPerPage);
            setHasOrders(ordersData.length > 0 || page > 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
            setIsPageChanging(false);
        }
    }, [page, rowsPerPage, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleChangePage = (event: unknown, newPage: number) => {
        // Empêcher d'avancer au-delà de la dernière page
        if (newPage > page && !hasMore) {
            return;
        }
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusFilterChange = (value: typeof ORDER_STATUS[keyof typeof ORDER_STATUS] | null) => {
        setStatusFilter(value);
        setPage(0);
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
                router.push(`/checkout/finalize?orderId=${order.id}`);
                break;
        }
    };

    if (loading && !isPageChanging) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Mes Commandes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    Historique de vos commandes
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                <FilterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                {STATUS_FILTERS.map(({ value, label }) => (
                    <Chip
                        key={label}
                        label={label}
                        size="small"
                        variant={statusFilter === value ? 'filled' : 'outlined'}
                        color={statusFilter === value ? 'primary' : 'default'}
                        onClick={() => handleStatusFilterChange(value)}
                        sx={{ fontWeight: statusFilter === value ? 600 : 400 }}
                    />
                ))}
            </Box>

            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <Table sx={{ minWidth: { xs: 300, sm: 500, md: 650 } }}>
                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>N° Commande</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Articles</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Total</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Statut</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        hover
                                        sx={{ '&:last-child td': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <Typography variant="body2" fontWeight="bold" color="primary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                {order.order_number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                {OrderService.formatDate(order.created_at)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ShoppingBagIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'text.secondary' }} />
                                                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                    {order.items_count || 0}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                {OrderService.formatAmount(order.total_amount, order.currency)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <Chip
                                                label={OrderService.getStatusLabel(order.status)}
                                                color={OrderService.getStatusColor(order.status)}
                                                size="small"
                                                sx={{ fontWeight: 'medium', fontSize: { xs: '0.65rem', sm: '0.75rem' }, height: { xs: 20, sm: 24 } }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                            <IconButton
                                                onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, order.id)}
                                                sx={{ '&:hover': { bgcolor: 'action.hover' }, p: { xs: 0.5, sm: 1 } }}
                                                size="small"
                                            >
                                                <MoreVert sx={{ fontSize: { xs: 18, sm: 24 } }} />
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
                                                {order.status === ORDER_STATUS.PENDING && (
                                                    <MenuItem onClick={() => handleMenuAction('change_info', order)} sx={{ color: 'info.main' }}>
                                                        Changer mes informations
                                                    </MenuItem>
                                                )}
                                                {order.status === ORDER_STATUS.PENDING && (
                                                    <MenuItem onClick={() => handleMenuAction('validate', order)} sx={{ color: 'success.main' }}>
                                                        Valider
                                                    </MenuItem>
                                                )}
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
                        sx={{ borderTop: 1, borderColor: 'divider', '& .MuiTablePagination-toolbar': { minHeight: { xs: 40, sm: 52 } } }}
                        slotProps={{
                            actions: {
                                showFirstButton: { sm: true },
                                showLastButton: { sm: false }, // Désactiver le bouton last car on ne connaît pas le total
                                nextButton: { 
                                    size: 'small',
                                    disabled: !hasMore // Désactiver le bouton suivant quand on atteint la dernière page
                                },
                                previousButton: { size: 'small' }
                            },
                            select: {
                                sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {orders.length === 0 && page === 0 && !hasOrders && (
                <Card elevation={0} sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50' }}>
                    <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {statusFilter
                            ? `Aucune commande avec le statut « ${OrderService.getStatusLabel(statusFilter)} »`
                            : "Vous n'avez pas encore de commandes"}
                    </Typography>
                    {statusFilter ? (
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={() => handleStatusFilterChange(null)}
                        >
                            Voir toutes les commandes
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={() => window.location.href = '/shop'}
                        >
                            Commencer vos achats
                        </Button>
                    )}
                </Card>
            )}

            {orders.length === 0 && page > 0 && (
                <Card elevation={0} sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Aucune commande sur cette page
                    </Typography>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{ mt: 2 }}
                        onClick={() => setPage(page - 1)}
                    >
                        Retour à la page précédente
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
