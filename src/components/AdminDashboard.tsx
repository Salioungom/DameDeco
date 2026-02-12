'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Dashboard as LayoutDashboard,
  Inventory2 as Package,
  ShoppingCart,
  People as Users,
  Settings,
  TrendingUp,
  AttachMoney as DollarSign,
  Visibility as Eye,
  Chat,
  Category,
  ArrowUpward,
  Star
} from '@mui/icons-material';

import { Product } from '@/lib/types';
import { productService } from '@/services/product.service';
import { ProductManagement } from './ProductManagement';
import { CategoriesManagement } from './CategoriesManagement';

// Local Mock Data for Orders and Customers (to be replaced by real services later)
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  paymentMethod: string;
  shippingAddress: string;
  source?: 'website' | 'whatsapp';
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Marie Diop',
    email: 'marie.diop@email.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    totalOrders: 5,
    totalSpent: 250000,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Ahmadou Bâ',
    email: 'ahmadou.ba@email.com',
    phone: '+221 76 987 65 43',
    address: 'Thiès, Sénégal',
    totalOrders: 3,
    totalSpent: 180000,
    joinDate: '2024-02-20',
    status: 'active'
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'Marie Diop',
    items: [
      {
        productId: '1',
        productName: 'Ensemble draps luxe 6 pièces',
        quantity: 2,
        price: 45000,
        total: 90000
      }
    ],
    total: 90000,
    status: 'delivered',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    paymentMethod: 'Wave',
    shippingAddress: 'Dakar, Sénégal',
    source: 'website'
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customerName: 'Ahmadou Bâ',
    items: [
      {
        productId: '2',
        productName: 'Rideaux premium 3 pièces',
        quantity: 1,
        price: 35000,
        total: 35000
      }
    ],
    total: 35000,
    status: 'processing',
    orderDate: '2024-02-25',
    paymentMethod: 'Orange Money',
    shippingAddress: 'Thiès, Sénégal',
    source: 'whatsapp'
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Use local mock data for now
  const orders = mockOrders;
  const customers = mockCustomers;

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const whatsappOrders = orders.filter(order => order.source === 'whatsapp').length;

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [countRes, popularRes] = await Promise.all([
          productService.getProducts({ limit: 1 }), // Just to get total count locally if needed or rely on metadata
          productService.getProducts({ limit: 5, sort_by: 'is_featured', sort_order: 'desc' }) // Popular products
        ]);
        setProductsCount(countRes.total);
        setPopularProducts(popularRes.items);
      } catch (error) {
        console.error("Error fetching admin stats", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.default, 1)} 50%)`,
      width: '100%'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Dashboard Administrateur
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Gérez votre boutique en ligne avec style
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center'
              }
            }}
          >
            <Tab icon={<LayoutDashboard />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<Package />} iconPosition="start" label="Produits" />
            <Tab icon={<Category />} iconPosition="start" label="Categories" />
            <Tab icon={<ShoppingCart />} iconPosition="start" label="Commandes" />
            <Tab icon={<Star />} iconPosition="start" label="Avis Clients" />
            <Tab icon={<Users />} iconPosition="start" label="Clients" />
            <Tab icon={<Settings />} iconPosition="start" label="Paramètres" />
          </Tabs>
        </Box>

        <Box>
          {/* Overview Tab */}
          <CustomTabPanel value={activeTab} index={0}>
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
              <Grid item xs={12} sm={6} lg={2.4}>
                <Card
                  elevation={8}
                  sx={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-8px) scale(1.02)' },
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                    borderRadius: 3,
                  }}
                >
                  <CardHeader
                    title="Revenu Total"
                    titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700, color: 'primary.main' }}
                    action={<DollarSign fontSize="small" sx={{ color: 'primary.main' }} />}
                  />
                  <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                    <Typography variant="h3" color="primary.main" fontWeight={800}>
                      {totalRevenue.toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={2.4}>
                <Card elevation={8} sx={{ borderRadius: 3 }}>
                  <CardHeader title="Commandes" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }} action={<ShoppingCart />} />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800}>{totalOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={2.4}>
                <Card elevation={8} sx={{ borderRadius: 3 }}>
                  <CardHeader title="Produits" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }} action={<Package />} />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800}>
                      {loadingStats ? <CircularProgress size={24} /> : productsCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={2.4}>
                <Card elevation={8} sx={{ borderRadius: 3 }}>
                  <CardHeader title="Clients" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }} action={<Users />} />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800}>{totalCustomers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={2.4}>
                <Card elevation={8} sx={{ borderRadius: 3 }}>
                  <CardHeader title="WhatsApp" titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }} action={<Chat />} />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800}>{whatsappOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} lg={6}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardHeader title="Commandes récentes" />
                  <CardContent>
                    <Stack spacing={2}>
                      {orders.slice(0, 5).map((order) => (
                        <Box key={order.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="subtitle2">{order.customerName}</Typography>
                          <Typography variant="caption">{order.total} FCFA - {order.status}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardHeader title="Produits populaires" />
                  <CardContent>
                    <Stack spacing={2}>
                      {loadingStats ? (
                        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                      ) : popularProducts.length > 0 ? (
                        popularProducts.map((product) => (
                          <Box key={product.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="subtitle2">{product.name}</Typography>
                              <Typography variant="caption">Stock: {product.inventory_quantity}</Typography>
                            </Box>
                            <Typography variant="subtitle2" color="primary">{product.price.toLocaleString('fr-FR')} FCFA</Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">Aucun produit populaire.</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* Products Tab */}
          <CustomTabPanel value={activeTab} index={1}>
            <ProductManagement />
          </CustomTabPanel>

          {/* Categories Tab */}
          <CustomTabPanel value={activeTab} index={2}>
            <CategoriesManagement />
          </CustomTabPanel>

          {/* Orders Tab */}
          <CustomTabPanel value={activeTab} index={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status) as any} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CustomTabPanel>

          {/* Reviews Tab */}
          <CustomTabPanel value={activeTab} index={4}>
            <Typography>Module Avis bientôt disponible</Typography>
          </CustomTabPanel>

          {/* Clients Tab */}
          <CustomTabPanel value={activeTab} index={5}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Commandes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CustomTabPanel>

          {/* Settings Tab */}
          <CustomTabPanel value={activeTab} index={6}>
            <Typography>Module Paramètres bientôt disponible</Typography>
          </CustomTabPanel>

        </Box>
      </Container>
    </Box>
  );
}