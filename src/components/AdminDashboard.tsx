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
  TableHead,
  TableRow,
  Chip,
  Stack,
  alpha,
  CircularProgress,
  Alert,
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
  LocalShippingOutlined,
} from '@mui/icons-material';
import Link from 'next/link';

import { Product, Order } from '@/lib/types';
import { productService } from '@/services/product.service';
import { getAdminOrders } from '@/lib/api';
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

interface DerivedCustomer {
  id: string | number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
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
        borderRadius: '16px',
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
            width: 48,
            height: 48,
            borderRadius: '12px',
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
          <Typography sx={{ fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: BRAND.primary, mt: 1 }} />
          ) : (
            <Typography sx={{ fontSize: 26, fontWeight: 700, color: BRAND.dark, mt: 0.5, lineHeight: 1.2 }}>
              {value}
            </Typography>
          )}
          <Typography sx={{ fontSize: 12, color: BRAND.muted, mt: 0.5 }}>
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

function getOrderCustomerName(order: Order & { customer?: { full_name?: string; name?: string; email?: string } }) {
  const customer = (order as { customer?: { full_name?: string; name?: string } }).customer;
  if (customer?.full_name) return customer.full_name;
  if (customer?.name) return customer.name;
  const addr = order.shipping_address as { first_name?: string; last_name?: string } | undefined;
  if (addr?.first_name || addr?.last_name) {
    return [addr.first_name, addr.last_name].filter(Boolean).join(' ');
  }
  return `Commande ${order.order_number || order.id}`;
}

function formatFcfa(amount: number) {
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const whatsappOrders = orders.filter((o) => (o as { source?: string }).source === 'whatsapp').length;
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
    return {
      totalRevenue,
      totalOrders: orders.length,
      whatsappOrders,
      pendingOrders,
    };
  }, [orders]);

  const derivedCustomers = useMemo((): DerivedCustomer[] => {
    const map = new Map<string | number, DerivedCustomer>();
    orders.forEach((order) => {
      const key = (order as { customer_id?: number }).customer_id ?? `order-${order.id}`;
      const name = getOrderCustomerName(order);
      const email =
        (order as { customer?: { email?: string } }).customer?.email ||
        (order.shipping_address as { phone?: string })?.phone ||
        '—';
      const amount = Number(order.total_amount) || 0;

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.totalOrders += 1;
        existing.totalSpent += amount;
      } else {
        map.set(key, {
          id: key,
          name,
          email,
          totalOrders: 1,
          totalSpent: amount,
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const fetchDashboardData = async () => {
    setLoadingStats(true);
    setLoadingOrders(true);
    setOrdersError(null);

    try {
      const [countRes, popularRes, ordersData] = await Promise.all([
        productService.getProducts({ limit: 1 }),
        productService.getProducts({ limit: 5, sort_by: 'is_featured', sort_order: 'desc' }),
        getAdminOrders(0, 100).catch((err) => {
          setOrdersError(err instanceof Error ? err.message : 'Impossible de charger les commandes');
          return [] as Order[];
        }),
      ]);

      setProductsCount(countRes.error ? 0 : countRes.data?.total || 0);
      setPopularProducts(popularRes.error ? [] : popularRes.data?.items || []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch {
      setPopularProducts([]);
      setProductsCount(0);
    } finally {
      setLoadingStats(false);
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    return { bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: 11 };
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <Box sx={{ bgcolor: BRAND.surface, minHeight: '100vh', pb: 6 }}>
      {/* Hero */}
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
            width: 280,
            height: 280,
            borderRadius: '50%',
            bgcolor: alpha(BRAND.white, 0.06),
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto' }}>
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
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: alpha(BRAND.white, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AdminPanelSettings sx={{ fontSize: 26 }} />
                </Box>
                <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Dashboard Administrateur
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 14, opacity: 0.9 }}>
                Bienvenue{user?.full_name ? `, ${user.full_name}` : ''} — gérez votre boutique Dame Sarr
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboardData}
              disabled={loadingStats || loadingOrders}
              sx={{
                color: BRAND.white,
                borderColor: alpha(BRAND.white, 0.4),
                borderRadius: '10px',
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

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, mt: -2, position: 'relative', zIndex: 2 }}>
        {/* Tabs */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '14px',
            border: `1px solid ${BRAND.border}`,
            bgcolor: BRAND.white,
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 56,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 13,
                color: BRAND.muted,
                minHeight: 56,
              },
              '& .Mui-selected': { color: `${BRAND.primary} !important` },
              '& .MuiTabs-indicator': { height: 3, bgcolor: BRAND.primary },
            }}
          >
            <Tab icon={<LayoutDashboard sx={{ fontSize: 20 }} />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<Package sx={{ fontSize: 20 }} />} iconPosition="start" label="Produits" />
            <Tab icon={<Category sx={{ fontSize: 20 }} />} iconPosition="start" label="Catégories" />
            <Tab icon={<ShoppingCart sx={{ fontSize: 20 }} />} iconPosition="start" label="Commandes" />
            <Tab icon={<Star sx={{ fontSize: 20 }} />} iconPosition="start" label="Avis" />
            <Tab icon={<Users sx={{ fontSize: 20 }} />} iconPosition="start" label="Clients" />
            <Tab icon={<Settings sx={{ fontSize: 20 }} />} iconPosition="start" label="Livraison" />
          </Tabs>
        </Paper>

        {ordersError && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setOrdersError(null)}>
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
                sx={{ borderRadius: '16px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
              >
                <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: BRAND.dark }}>
                    Commandes récentes
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {loadingOrders ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} sx={{ color: BRAND.primary }} />
                    </Box>
                  ) : recentOrders.length === 0 ? (
                    <Typography sx={{ fontSize: 14, color: BRAND.muted, textAlign: 'center', py: 3 }}>
                      Aucune commande pour le moment
                    </Typography>
                  ) : (
                    <Stack spacing={1.25}>
                      {recentOrders.map((order) => (
                        <Box
                          key={order.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            border: `1px solid ${BRAND.border}`,
                            bgcolor: BRAND.surface,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.dark }}>
                                {getOrderCustomerName(order)}
                              </Typography>
                              <Typography sx={{ fontSize: 12, color: BRAND.muted }}>
                                {order.order_number} · {new Date(order.created_at).toLocaleDateString('fr-FR')}
                              </Typography>
                            </Box>
                            <Chip label={order.status} size="small" sx={getStatusChipSx(order.status)} />
                          </Stack>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: BRAND.primary, mt: 0.75 }}>
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
                sx={{ borderRadius: '16px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
              >
                <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: BRAND.dark }}>
                    Produits populaires
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {loadingStats ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} sx={{ color: BRAND.primary }} />
                    </Box>
                  ) : popularProducts.length === 0 ? (
                    <Typography sx={{ fontSize: 14, color: BRAND.muted, textAlign: 'center', py: 3 }}>
                      Aucun produit mis en avant
                    </Typography>
                  ) : (
                    <Stack spacing={1.25}>
                      {popularProducts.map((product) => (
                        <Box
                          key={product.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            border: `1px solid ${BRAND.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.dark }} noWrap>
                              {product.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: BRAND.muted }}>
                              Stock : {product.inventory_quantity ?? '—'}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: BRAND.primary, flexShrink: 0 }}>
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

          <Paper
            elevation={0}
            sx={{ mt: 2.5, p: 2.5, borderRadius: '16px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: BRAND.dark, mb: 2 }}>
              Raccourcis
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={Link}
                href="/admin/shipping"
                variant="outlined"
                startIcon={<LocalShippingOutlined />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: BRAND.border,
                  color: BRAND.dark,
                  '&:hover': { borderColor: BRAND.primary, bgcolor: alpha(BRAND.primary, 0.04) },
                }}
              >
                Paramètres livraison
              </Button>
              <Button
                variant="outlined"
                onClick={() => setActiveTab(1)}
                startIcon={<Package />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: BRAND.border,
                  color: BRAND.dark,
                  '&:hover': { borderColor: BRAND.primary, bgcolor: alpha(BRAND.primary, 0.04) },
                }}
              >
                Gérer les produits
              </Button>
            </Stack>
          </Paper>
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
            sx={{ borderRadius: '16px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
          >
            <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: BRAND.dark }}>
                Toutes les commandes
              </Typography>
              <Typography sx={{ fontSize: 13, color: BRAND.muted }}>
                Données issues de l&apos;API · {orders.length} commande{orders.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            {loadingOrders ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingCart sx={{ fontSize: 48, color: BRAND.border, mb: 1 }} />
                <Typography sx={{ color: BRAND.muted }}>Aucune commande enregistrée</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: BRAND.dark,
                        '& th': {
                          color: BRAND.white,
                          fontWeight: 600,
                          fontSize: 12,
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
                    {orders.map((order, i) => (
                      <TableRow
                        key={order.id}
                        hover
                        sx={{
                          bgcolor: i % 2 === 0 ? BRAND.white : BRAND.surface,
                          '& td': { borderColor: BRAND.border, py: 1.5 },
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontSize: 13, fontWeight: 700, color: BRAND.primary }}>
                            {order.order_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: 14, color: BRAND.dark }}>
                            {getOrderCustomerName(order)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.dark }}>
                            {formatFcfa(Number(order.total_amount) || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={order.status} size="small" sx={getStatusChipSx(order.status)} />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: 13, color: BRAND.muted }}>
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              bgcolor: BRAND.white,
            }}
          >
            <Star sx={{ fontSize: 48, color: BRAND.border, mb: 1 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: BRAND.dark }}>
              Module avis clients
            </Typography>
            <Typography sx={{ fontSize: 14, color: BRAND.muted, mt: 0.5 }}>
              Bientôt disponible
            </Typography>
          </Paper>
        </CustomTabPanel>

        {/* Clients */}
        <CustomTabPanel value={activeTab} index={5}>
          <Paper
            elevation={0}
            sx={{ borderRadius: '16px', border: `1px solid ${BRAND.border}`, bgcolor: BRAND.white, overflow: 'hidden' }}
          >
            <Box sx={{ px: 2.5, py: 2, bgcolor: BRAND.light, borderBottom: `1px solid ${BRAND.border}` }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: BRAND.dark }}>
                Clients
              </Typography>
              <Typography sx={{ fontSize: 13, color: BRAND.muted }}>
                Dérivés des commandes ({derivedCustomers.length} client{derivedCustomers.length !== 1 ? 's' : ''})
              </Typography>
            </Box>
            {loadingOrders ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
              </Box>
            ) : derivedCustomers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Users sx={{ fontSize: 48, color: BRAND.border, mb: 1 }} />
                <Typography sx={{ color: BRAND.muted }}>Aucun client identifié via les commandes</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: BRAND.dark,
                        '& th': {
                          color: BRAND.white,
                          fontWeight: 600,
                          fontSize: 12,
                          py: 1.5,
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <TableCell>Nom</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell align="right">Commandes</TableCell>
                      <TableCell align="right">Total dépensé</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {derivedCustomers.map((customer, i) => (
                      <TableRow
                        key={String(customer.id)}
                        sx={{
                          bgcolor: i % 2 === 0 ? BRAND.white : BRAND.surface,
                          '& td': { borderColor: BRAND.border, py: 1.5 },
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.dark }}>
                            {customer.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: 13, color: BRAND.muted }}>{customer.email}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{customer.totalOrders}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.primary }}>
                            {formatFcfa(customer.totalSpent)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
