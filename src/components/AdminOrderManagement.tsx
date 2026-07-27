'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Stack,
  alpha,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { getAdminOrders, updateOrderStatus } from '@/lib/api';
import { BRAND_BLUE } from '@/theme';

const BRAND = {
  primary: BRAND_BLUE,
  dark: '#042C53',
  white: '#FFFFFF',
  light: '#E6F1FB',
  surface: '#F5F9FE',
  border: '#D4E8F7',
  muted: '#5F6B7A',
} as const;

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    name: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number | null;
  status: string;
  payment_status: string;
  payment_method: string;
  mode: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  created_at: string;
  shipping_address: {
    full_name?: string;
    phone?: string;
    address?: string;
    city?: string;
  } | null;
  customer: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  items: OrderItem[];
}

export function AdminOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Snackbar Alert State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch orders (API max limit is 100)
      const data = await getAdminOrders(0, 100) as any;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching admin orders:', err);
      setError(err?.message || 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNotes('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setNotes('');
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return;
    setSubmittingStatus(true);
    try {
      await updateOrderStatus(selectedOrder.id, newStatus, notes);
      
      // Update local state immediately
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );

      setSnackbar({
        open: true,
        message: `Statut de la commande ${selectedOrder.order_number} mis à jour avec succès.`,
        severity: 'success',
      });
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setSnackbar({
        open: true,
        message: err?.message || 'Erreur lors de la mise à jour du statut.',
        severity: 'error',
      });
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Helper to format currency
  const formatFcfa = (amount: number) => {
    return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
  };

  // Helper to get Customer Name
  const getOrderCustomerName = (order: Order) => {
    if (order.customer?.name) return order.customer.name;
    if (order.shipping_address?.full_name) return order.shipping_address.full_name;
    return 'Client invité';
  };

  // Chip Styling per Status
  const getStatusChipSx = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      pending: { bg: alpha('#F59E0B', 0.12), color: '#B45309' }, // orange/warning
      confirmed: { bg: alpha('#0288D1', 0.12), color: '#0288D1' }, // bleu/info
      processing: { bg: alpha('#9C27B0', 0.12), color: '#9C27B0' }, // violet/secondaire
      shipped: { bg: alpha('#3F51B5', 0.12), color: '#3F51B5' }, // indigo/bleu foncé
      delivered: { bg: alpha('#2E7D32', 0.12), color: '#2E7D32' }, // vert/success
      cancelled: { bg: alpha('#D32F2F', 0.12), color: '#D32F2F' }, // rouge/error
      refunded: { bg: alpha('#757575', 0.15), color: '#757575' }, // gris/default
    };
    const c = colors[status] || { bg: alpha(BRAND.muted, 0.1), color: BRAND.muted };
    return {
      bgcolor: c.bg,
      color: c.color,
      fontWeight: 600,
      fontSize: 13,
      px: 1,
    };
  };

  // Filter and Search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const search = searchQuery.toLowerCase().trim();
      const customerName = getOrderCustomerName(order).toLowerCase();
      const orderNumber = order.order_number.toLowerCase();
      const matchesSearch =
        !search ||
        orderNumber.includes(search) ||
        customerName.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Paginated data
  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // Reset page on search or filter change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '20px',
        border: `1px solid ${BRAND.border}`,
        bgcolor: BRAND.white,
        overflow: 'hidden',
      }}
    >
      {/* Header Info */}
      <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
        <Typography sx={{ fontSize: 22.5, fontWeight: 700, color: BRAND.dark }}>
          Gestion des commandes
        </Typography>
        <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>
          {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} trouvée{filteredOrders.length !== 1 ? 's' : ''} sur {orders.length} au total
        </Typography>
      </Box>

      {/* Toolbar Controls */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${BRAND.border}`,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Rechercher une commande..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: BRAND.muted, mr: 1, fontSize: 20 }} />,
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: BRAND.muted }}>Filtrer par Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Filtrer par Statut"
            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: '10px' }}
          >
            <MenuItem value="all">Tous les statuts</MenuItem>
            <MenuItem value="pending">En attente (pending)</MenuItem>
            <MenuItem value="confirmed">Confirmée (confirmed)</MenuItem>
            <MenuItem value="processing">En traitement (processing)</MenuItem>
            <MenuItem value="shipped">Expédiée (shipped)</MenuItem>
            <MenuItem value="delivered">Livrée (delivered)</MenuItem>
            <MenuItem value="cancelled">Annulée (cancelled)</MenuItem>
            <MenuItem value="refunded">Remboursée (refunded)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: BRAND.primary }} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" variant="outlined" sx={{ width: 'fit-content', mx: 'auto' }}>
            {error}
          </Alert>
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: BRAND.border, mb: 1 }} />
          <Typography sx={{ color: BRAND.muted }}>
            Aucune commande correspondante.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: BRAND.dark,
                    '& th': {
                      color: BRAND.white,
                      fontWeight: 600,
                      fontSize: 15,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      py: 1.5,
                      borderBottom: 'none',
                    },
                  }}
                >
                  <TableCell>N° commande</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order, i) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      bgcolor: i % 2 === 0 ? BRAND.white : BRAND.surface,
                      '& td': { borderColor: BRAND.border, py: 1.5 },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: 16, fontWeight: 700, color: BRAND.primary }}>
                        {order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 16.5, color: BRAND.dark }}>
                        {getOrderCustomerName(order)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 16.5, fontWeight: 600, color: BRAND.dark }}>
                        {formatFcfa(Number(order.total_amount) || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.toUpperCase()}
                        size="small"
                        sx={getStatusChipSx(order.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 15, color: BRAND.muted }}>
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Modifier le statut">
                        <IconButton
                          onClick={() => handleOpenDialog(order)}
                          sx={{
                            color: BRAND.primary,
                            bgcolor: alpha(BRAND.primary, 0.08),
                            '&:hover': {
                              bgcolor: alpha(BRAND.primary, 0.15),
                            },
                          }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, p: number) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }: { from: number; to: number; count: number }) => `${from}–${to} sur ${count}`}
            sx={{
              borderTop: `1px solid ${BRAND.border}`,
              '& .MuiTablePagination-toolbar': { minHeight: 52 },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: BRAND.muted,
                fontSize: 15,
              },
              '& .MuiIconButton-root': { color: BRAND.primary },
            }}
          />
        </>
      )}

      {/* Change Status Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Modifier le statut
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {selectedOrder && (
              <Typography sx={{ color: BRAND.muted, fontSize: 15 }}>
                Commande : <strong>{selectedOrder.order_number}</strong> ({getOrderCustomerName(selectedOrder)})
              </Typography>
            )}

            <FormControl fullWidth size="small">
              <InputLabel>Nouveau Statut</InputLabel>
              <Select
                value={newStatus}
                label="Nouveau Statut"
                onChange={(e: SelectChangeEvent) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">En attente (pending)</MenuItem>
                <MenuItem value="confirmed">Confirmée (confirmed)</MenuItem>
                <MenuItem value="processing">En traitement (processing)</MenuItem>
                <MenuItem value="shipped">Expédiée (shipped)</MenuItem>
                <MenuItem value="delivered">Livrée (delivered)</MenuItem>
                <MenuItem value="cancelled">Annulée (cancelled)</MenuItem>
                <MenuItem value="refunded">Remboursée (refunded)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Notes / Réf (optionnel)"
              multiline
              rows={3}
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Ex: Raison du retour, informations de livraison..."
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: BRAND.muted,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmStatusChange}
            variant="contained"
            disabled={submittingStatus}
            sx={{
              bgcolor: BRAND.primary,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                bgcolor: BRAND.dark,
              },
            }}
          >
            {submittingStatus ? 'Mise à jour...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
