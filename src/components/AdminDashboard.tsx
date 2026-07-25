'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  alpha,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as LayoutDashboard,
  Inventory2 as Package,
  ShoppingCart,
  People as Users,
  Settings,
  AttachMoney as DollarSign,
  Category,
  Star,
  Refresh as RefreshIcon,
  AdminPanelSettings,
  CheckCircle,
  Block,
  Search as SearchIcon,
  Visibility,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import { Product } from '@/lib/types';
import { productService } from '@/services/product.service';
import { api } from '@/lib/api';
import { ProductManagement } from './ProductManagement';
import { CategoriesManagement } from './CategoriesManagement';
import ShippingManagement from './shipping/ShippingManagement';
import { useAuth } from '@/contexts/AuthContext';

const BRAND = {
  primary: '#185FA5',
  dark: '#042C53',
  white: '#FFFFFF',
  light: '#E6F1FB',
  surface: '#F5F9FE',
  border: '#D4E8F7',
  muted: '#5F6B7A',
} as const;

interface OrderWithCustomer {
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
  source: string;
  shipping_address: { full_name: string; phone: string; address: string; city: string } | null;
  customer: { id: number; name: string; email: string | null; phone: string | null } | null;
  items: any[];
  created_at: string;
}

interface ClientWithStats {
  id: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  total_orders: number;
  total_spent: number;
  pending_orders: number;
  last_order_date: string | null;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: '20px',
        border: `1px solid ${BRAND.border}`,
        bgcolor: BRAND.white,
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(BRAND.primary, 0.1)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '15px',
            bgcolor: alpha(BRAND.primary, 0.1),
            color: BRAND.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 16.25, color: BRAND.muted, fontWeight: 500 }}>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: BRAND.primary, mt: 1 }} />
          ) : (
            <Typography sx={{ fontSize: 32.5, fontWeight: 700, color: BRAND.dark, mt: 0.5, lineHeight: 1.2 }}>
              {value}
            </Typography>
          )}
          <Typography sx={{ fontSize: 15, color: BRAND.muted, mt: 0.5 }}>
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ py: 3 }}>{children}</Box>;
}

function getOrderCustomerName(order: OrderWithCustomer) {
  if (order.customer?.name) return order.customer.name;
  const addr = order.shipping_address;
  if (addr?.full_name) return addr.full_name;
  return 'Client invité';
}

function formatFcfa(amount: number) {
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}

export function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPage, setOrderPage] = useState(0);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(10);

  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('all');
  const [clientPage, setClientPage] = useState(0);
  const [clientRowsPerPage, setClientRowsPerPage] = useState(10);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const whatsappOrders = orders.filter((o) => o.source === 'whatsapp').length;
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
    return {
      totalRevenue,
      totalOrders: orders.length,
      whatsappOrders,
      pendingOrders,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (orderStatusFilter !== 'all') {
      result = result.filter((o) => o.status === orderStatusFilter);
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter((o) =>
        o.order_number.toLowerCase().includes(q) ||
        getOrderCustomerName(o).toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, orderStatusFilter, orderSearch]);

  const paginatedOrders = useMemo(() => {
    const start = orderPage * orderRowsPerPage;
    return filteredOrders.slice(start, start + orderRowsPerPage);
  }, [filteredOrders, orderPage, orderRowsPerPage]);

  const filteredClients = useMemo(() => {
    let result = clients;
    if (clientStatusFilter !== 'all') {
      const isActive = clientStatusFilter === 'active';
      result = result.filter((c) => c.is_active === isActive);
    }
    if (clientSearch.trim()) {
      const q = clientSearch.toLowerCase();
      result = result.filter((c) =>
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [clients, clientStatusFilter, clientSearch]);

  const paginatedClients = useMemo(() => {
    const start = clientPage * clientRowsPerPage;
    return filteredClients.slice(start, start + clientRowsPerPage);
  }, [filteredClients, clientPage, clientRowsPerPage]);

  const fetchDashboardData = async () => {
    setLoadingStats(true);
    setLoadingOrders(true);
    setLoadingClients(true);
    setOrdersError(null);

    try {
      const [countRes, popularRes, ordersRes, clientsRes] = await Promise.all([
        productService.getProducts({ limit: 1 }),
        productService.getProducts({ limit: 5, sort_by: 'is_featured', sort_order: 'desc' }),
        api.get('/api/v1/orders/admin', { params: { skip: 0, limit: 100 } }).catch((err) => {
          setOrdersError(err instanceof Error ? err.message : 'Impossible de charger les commandes');
          return { data: [] };
        }),
        api.get('/api/v1/users/clients', { params: { skip: 0, limit: 100 } }).catch(() => ({ data: { items: [] } })),
      ]);

      setProductsCount(countRes.error ? 0 : countRes.data?.total || 0);
      setPopularProducts(popularRes.error ? [] : popularRes.data?.items || []);

      const ordersData: OrderWithCustomer[] = Array.isArray(ordersRes.data)
        ? ordersRes.data
        : [];
      setOrders(ordersData);

      const clientsData: ClientWithStats[] = Array.isArray(clientsRes.data?.items)
        ? clientsRes.data.items
        : Array.isArray(clientsRes.data)
          ? clientsRes.data
          : [];
      setClients(clientsData);
    } catch {
      setPopularProducts([]);
      setProductsCount(0);
    } finally {
      setLoadingStats(false);
      setLoadingOrders(false);
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    setOrderPage(0);
  }, [orderSearch, orderStatusFilter]);

  useEffect(() => {
    setClientPage(0);
  }, [clientSearch, clientStatusFilter]);

  const getStatusChipSx = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      pending: { bg: alpha('#F59E0B', 0.12), color: '#B45309' },
      confirmed: { bg: alpha(BRAND.primary, 0.1), color: BRAND.primary },
      processing: { bg: alpha(BRAND.primary, 0.1), color: BRAND.primary },
      shipped: { bg: alpha('#6366F1', 0.1), color: '#4F46E5' },
      delivered: { bg: alpha('#0D7A4A', 0.1), color: '#0D7A4A' },
      cancelled: { bg: alpha('#DC2626', 0.1), color: '#DC2626' },
      refunded: { bg: alpha(BRAND.muted, 0.15), color: BRAND.muted },
    };
    const c = colors[status] || { bg: alpha(BRAND.muted, 0.1), color: BRAND.muted };
    return { bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: 13.75 };
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <Box sx={{ bgcolor: BRAND.surface, minHeight: '100vh', pb: 6 }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primary} 100%)`,
          color: BRAND.white,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3.5, md: 4.5 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            bgcolor: alpha(BRAND.white, 0.06),
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1500, mx: 'auto' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Box
                  sx={{
                    width: 55,
                    height: 55,
                    borderRadius: '15px',
                    bgcolor: alpha(BRAND.white, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 32.5 }} />
                </Box>
                <Typography sx={{ fontSize: { xs: 30, md: 37.5 }, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Dashboard Administrateur
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 17.5, opacity: 0.9 }}>
                Bienvenue{user?.full_name ? `, ${user.full_name}` : ''} — gérez votre boutique Dame Sarr
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              disabled={loadingStats || loadingOrders || loadingClients}
              sx={{
                color: BRAND.white,
                borderColor: alpha(BRAND.white, 0.4),
                borderRadius: '12.5px',
                textTransform: 'none',
                fontWeight: 600,
                alignSelf: { xs: 'flex-start', sm: 'center' },
                '&:hover': { borderColor: BRAND.white, bgcolor: alpha(BRAND.white, 0.1) },
              }}
            >
              Actualiser
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1500, mx: 'auto', px: { xs: 2, sm: 3 }, mt: -2, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '17.5px',
            border: `1px solid ${BRAND.border}`,
            bgcolor: BRAND.white,
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_e: any, v: number) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 56,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16.25,
                color: BRAND.muted,
                minHeight: 56,
              },
              '& .Mui-selected': { color: `${BRAND.primary} !important` },
              '& .MuiTabs-indicator': { height: 3.75, bgcolor: BRAND.primary },
            }}
          >
            <Tab icon={<LayoutDashboard sx={{ fontSize: 25 }} />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<Package sx={{ fontSize: 25 }} />} iconPosition="start" label="Produits" />
            <Tab icon={<Category sx={{ fontSize: 25 }} />} iconPosition="start" label="Catégories" />
            <Tab icon={<ShoppingCart sx={{ fontSize: 25 }} />} iconPosition="start" label="Commandes" />
            <Tab icon={<Star sx={{ fontSize: 25 }} />} iconPosition="start" label="Avis" />
            <Tab icon={<Users sx={{ fontSize: 25 }} />} iconPosition="start" label="Clients" />
            <Tab icon={<Settings sx={{ fontSize: 25 }} />} iconPosition="start" label="Livraison" />
          </Tabs>
        </Paper>

        {ordersError && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '15px' }} onClose={() => setOrdersError(null)}>
            {ordersError}
          </Alert>
        )}

        {/* Vue d'ensemble */}
        <CustomTabPanel value={activeTab} index={0}>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Revenu total"
                value={loadingOrders ? '—' : formatFcfa(stats.totalRevenue)}
                subtitle="Basé sur les commandes API"
                icon={<DollarSign />}
                loading={loadingOrders}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Commandes"
                value={stats.totalOrders}
                subtitle={`${stats.pendingOrders} en attente / traitement`}
                icon={<ShoppingCart />}
                loading={loadingOrders}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Produits"
                value={productsCount}
                subtitle="Catalogue actif"
                icon={<Package />}
                loading={loadingStats}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="WhatsApp"
                value={stats.whatsappOrders}
                subtitle="Commandes via WhatsApp"
                icon={<ShoppingCart />}
                loading={loadingOrders}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{ borderRadius: '20px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
              >
                <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: BRAND.dark }}>
                    Commandes récentes
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {loadingOrders ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} sx={{ color: BRAND.primary }} />
                    </Box>
                  ) : recentOrders.length === 0 ? (
                    <Typography sx={{ fontSize: 17.5, color: BRAND.muted, textAlign: 'center', py: 3 }}>
                      Aucune commande pour le moment
                    </Typography>
                  ) : (
                    <Stack spacing={1.25}>
                      {recentOrders.map((order) => (
                        <Box
                          key={order.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '12.5px',
                            border: `1px solid ${BRAND.border}`,
                            bgcolor: BRAND.surface,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography sx={{ fontSize: 17.5, fontWeight: 600, color: BRAND.dark }}>
                                {getOrderCustomerName(order)}
                              </Typography>
                              <Typography sx={{ fontSize: 15, color: BRAND.muted }}>
                                {order.order_number} · {new Date(order.created_at).toLocaleDateString('fr-FR')}
                              </Typography>
                            </Box>
                            <Chip label={order.status} size="small" sx={getStatusChipSx(order.status)} />
                          </Stack>
                          <Typography sx={{ fontSize: 17.5, fontWeight: 700, color: BRAND.primary, mt: 0.75 }}>
                            {formatFcfa(Number(order.total_amount) || 0)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{ borderRadius: '20px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
              >
                <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: BRAND.dark }}>
                    Produits populaires
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {loadingStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} sx={{ color: BRAND.primary }} />
                    </Box>
                  ) : popularProducts.length === 0 ? (
                    <Typography sx={{ fontSize: 17.5, color: BRAND.muted, textAlign: 'center', py: 3 }}>
                      Aucun produit mis en avant
                    </Typography>
                  ) : (
                    <Stack spacing={1.25}>
                      {popularProducts.map((product) => (
                        <Box
                          key={product.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '12.5px',
                            border: `1px solid ${BRAND.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: 17.5, fontWeight: 600, color: BRAND.dark }} noWrap>
                              {product.name}
                            </Typography>
                            <Typography sx={{ fontSize: 15, color: BRAND.muted }}>
                              Stock : {product.inventory_quantity ?? '—'}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 17.5, fontWeight: 700, color: BRAND.primary, flexShrink: 0 }}>
                            {formatFcfa(Number(product.price) || 0)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <ProductManagement />
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={2}>
          <CategoriesManagement />
        </CustomTabPanel>

        {/* Commandes */}
        <CustomTabPanel value={activeTab} index={3}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '20px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
          >
            <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
              <Typography sx={{ fontSize: 22.5, fontWeight: 700, color: BRAND.dark }}>
                Toutes les commandes
              </Typography>
              <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>
                {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} sur {orders.length}
              </Typography>
            </Box>

            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${BRAND.border}`, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Rechercher une commande..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                sx={{ flex: 1, minWidth: 220 }}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ color: BRAND.muted, mr: 1, fontSize: 20 }} />,
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: BRAND.muted }}>Statut</InputLabel>
                <Select
                  value={orderStatusFilter}
                  label="Statut"
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="confirmed">Confirmée</MenuItem>
                  <MenuItem value="processing">En traitement</MenuItem>
                  <MenuItem value="shipped">Expédiée</MenuItem>
                  <MenuItem value="delivered">Livrée</MenuItem>
                  <MenuItem value="cancelled">Annulée</MenuItem>
                  <MenuItem value="refunded">Remboursée</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loadingOrders ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
              </Box>
            ) : filteredOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingCart sx={{ fontSize: 60, color: BRAND.border, mb: 1 }} />
                <Typography sx={{ color: BRAND.muted }}>
                  {orders.length === 0 ? 'Aucune commande enregistrée' : 'Aucune commande ne correspond aux filtres'}
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
                            <Typography sx={{ fontSize: 16.25, fontWeight: 700, color: BRAND.primary }}>
                              {order.order_number}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: 17.5, color: BRAND.dark }}>
                              {getOrderCustomerName(order)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: 17.5, fontWeight: 600, color: BRAND.dark }}>
                              {formatFcfa(Number(order.total_amount) || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={order.status} size="small" sx={getStatusChipSx(order.status)} />
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={filteredOrders.length}
                  page={orderPage}
                  onPageChange={(_e, p) => setOrderPage(p)}
                  rowsPerPage={orderRowsPerPage}
                  onRowsPerPageChange={(e) => { setOrderRowsPerPage(Number(e.target.value)); setOrderPage(0); }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Lignes par page"
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
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
          </Paper>
        </CustomTabPanel>

        {/* Avis */}
        <CustomTabPanel value={activeTab} index={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '20px',
              border: `1px solid ${BRAND.border}`,
              bgcolor: BRAND.white,
            }}
          >
            <Star sx={{ fontSize: 60, color: BRAND.border, mb: 1 }} />
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: BRAND.dark }}>
              Module avis clients
            </Typography>
            <Typography sx={{ fontSize: 17.5, color: BRAND.muted, mt: 0.5 }}>
              Bientôt disponible
            </Typography>
          </Paper>
        </CustomTabPanel>

        {/* Clients */}
        <CustomTabPanel value={activeTab} index={5}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '20px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
          >
            <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
              <Typography sx={{ fontSize: 22.5, fontWeight: 700, color: BRAND.dark }}>
                Clients
              </Typography>
              <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>
                {loadingClients
                  ? 'Chargement…'
                  : `${filteredClients.length} client${filteredClients.length !== 1 ? 's' : ''} sur ${clients.length}`}
              </Typography>
            </Box>

            <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${BRAND.border}`, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Rechercher un client..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ flex: 1, minWidth: 220 }}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon sx={{ color: BRAND.muted, mr: 1, fontSize: 20 }} />,
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: BRAND.muted }}>Statut</InputLabel>
                <Select
                  value={clientStatusFilter}
                  label="Statut"
                  onChange={(e) => setClientStatusFilter(e.target.value)}
                  sx={{ borderRadius: '10px' }}
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loadingClients ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
              </Box>
            ) : filteredClients.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Users sx={{ fontSize: 60, color: BRAND.border, mb: 1 }} />
                <Typography sx={{ color: BRAND.muted }}>
                  {clients.length === 0 ? 'Aucun client enregistré' : 'Aucun client ne correspond aux filtres'}
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
                            py: 1.5,
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <TableCell>Nom</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Téléphone</TableCell>
                        <TableCell align="right">Total dépensé</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedClients.map((client, i) => (
                        <TableRow
                          key={client.id}
                          sx={{
                            bgcolor: i % 2 === 0 ? BRAND.white : BRAND.surface,
                            '& td': { borderColor: BRAND.border, py: 1.5 },
                          }}
                        >
                          <TableCell>
                            <Typography sx={{ fontSize: 17.5, fontWeight: 600, color: BRAND.dark }}>
                              {client.full_name || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>{client.email || '—'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: 16.25, color: BRAND.muted }}>{client.phone || '—'}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontSize: 17.5, fontWeight: 600, color: BRAND.primary }}>
                              {formatFcfa(client.total_spent)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Voir les commandes">
                              <IconButton
                                onClick={() => {
                                  setActiveTab(3);
                                  setOrderSearch(client.full_name || client.email || '');
                                }}
                                sx={{ color: BRAND.primary }}
                              >
                                <Visibility />
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
                  count={filteredClients.length}
                  page={clientPage}
                  onPageChange={(_e, p) => setClientPage(p)}
                  rowsPerPage={clientRowsPerPage}
                  onRowsPerPageChange={(e) => { setClientRowsPerPage(Number(e.target.value)); setClientPage(0); }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Lignes par page"
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
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
          </Paper>
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={6}>
          <ShippingManagement />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
