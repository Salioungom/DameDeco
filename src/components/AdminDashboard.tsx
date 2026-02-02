'use client';

import { useState } from 'react';
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
  InputAdornment,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Paper,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Fade,
  Zoom,
  Skeleton,
  LinearProgress,
  Fab,
  Tooltip,
  Badge,
  useMediaQuery,
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
  Edit,
  Delete as Trash2,
  Add as Plus,
  Search,
  FilterList,
  Refresh,
  Download,
  Upload,
  Star,
  WhatsApp,
  Chat,
  FolderOpen,
  Close as CloseIcon,
  Logout,
  Notifications,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Schedule,
  LocalShipping,
  CheckCircle,
  Pending,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { products, orders, customers, categories } from '../lib/data';

// Définition des types manquants
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  images?: string[];
  description?: string;
  wholesalePrice?: number;
  pieces?: number;
}

interface Order {
  id: string;
  customerId: string;
  customer?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date?: string;
  payment?: string;
  source?: 'website' | 'whatsapp';
  items?: any[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
  orders?: number;
}
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductManagement } from './ProductManagement';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isViewCustomerOpen, setIsViewCustomerOpen] = useState(false);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const whatsappOrders = orders.filter(order => (order as any).source === 'whatsapp').length;

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

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteProductOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      // toast.success(`${productToDelete.name} supprimé avec succès`);
      setIsDeleteProductOpen(false);
      setProductToDelete(null);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderOpen(true);
  };

  const handleSaveProduct = () => {
    // toast.success('Produit modifié avec succès');
    setIsEditProductOpen(false);
  };

  const handleAddProduct = () => {
    // toast.success('Produit ajouté avec succès');
  };

  const handleViewCustomer = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setIsViewCustomerOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const router = useRouter();

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
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.light, 0.15)})`,
                  },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.1)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  }
                }}
              >
                <CardHeader
                  title="Revenu Total"
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700, color: 'primary.main' }}
                  action={
                    <Box sx={{ 
                      p: 1,
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DollarSign fontSize="small" sx={{ color: 'primary.main' }} />
                    </Box>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                  <Typography variant="h3" component="div" sx={{ 
                    fontWeight: 800, 
                    color: 'primary.main', 
                    mb: 1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {totalRevenue.toLocaleString('fr-FR')} FCFA
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 0.5,
                    fontWeight: 600
                  }}>
                    <ArrowUpward fontSize="small" sx={{ color: 'success.main' }} />
                    +12% ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card 
                elevation={8}
                sx={{ 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)}, ${alpha(theme.palette.info.light, 0.15)})`,
                  },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.light, 0.1)})`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                  }
                }}
              >
                <CardHeader
                  title="Commandes"
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700, color: 'info.main' }}
                  action={
                    <Box sx={{ 
                      p: 1,
                      borderRadius: 2,
                      background: alpha(theme.palette.info.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCart fontSize="small" sx={{ color: 'info.main' }} />
                    </Box>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                  <Typography variant="h3" component="div" sx={{ 
                    fontWeight: 800, 
                    color: 'info.main', 
                    mb: 1,
                    background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 0.5,
                    fontWeight: 600
                  }}>
                    <ArrowUpward fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography component="span" variant="caption" color="success.main" fontWeight={600}>+5</Typography> cette semaine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card 
                elevation={8}
                sx={{ 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)}, ${alpha(theme.palette.warning.light, 0.15)})`,
                  },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)}, ${alpha(theme.palette.warning.light, 0.1)})`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                  }
                }}
              >
                <CardHeader
                  title="Produits"
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700, color: 'warning.main' }}
                  action={
                    <Box sx={{ 
                      p: 1,
                      borderRadius: 2,
                      background: alpha(theme.palette.warning.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package fontSize="small" sx={{ color: 'warning.main' }} />
                    </Box>
                  }
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                  <Typography variant="h3" component="div" sx={{ 
                    fontWeight: 800, 
                    color: 'warning.main', 
                    mb: 1,
                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {totalProducts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 600
                  }}>
                    En catalogue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card 
                sx={{ 
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.light, 0.1)})`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                }}
              >
                <CardHeader
                  title="Clients"
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                  action={<Users fontSize="small" sx={{ color: 'success.main' }} />}
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {totalCustomers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    <TrendingUp fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography component="span" variant="caption" color="success.main" fontWeight={600}>+2</Typography> nouveaux ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card 
                sx={{ 
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  },
                  background: `linear-gradient(135deg, ${alpha('#25D366', 0.05)}, ${alpha('#25D366', 0.1)})`,
                  border: `1px solid ${alpha('#25D366', 0.2)}`
                }}
              >
                <CardHeader
                  title="WhatsApp"
                  titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
                  action={<Chat fontSize="small" sx={{ color: '#25D366' }} />}
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#25D366', mb: 1 }}>
                    {whatsappOrders}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Commandes WhatsApp
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <CardHeader 
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Commandes récentes
                    </Typography>
                  } 
                  sx={{ 
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.light, 0.05)})`
                  }} 
                />
                <CardContent>
                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    {orders.slice(0, 5).map((order, index) => (
                      <Box 
                        key={order.id} 
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.light, 0.05)})`
                          },
                          width: '100%',
                          maxWidth: 400
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {(order as any).customer || `Client ${order.customerId}`}
                              </Typography>
                              {(order as any).source === 'whatsapp' && (
                                <Chat sx={{ fontSize: 14, color: 'success.main' }} />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {order.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {(order as any).date ? new Date((order as any).date).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {(order as any).payment || 'Paiement non spécifié'}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {order.total.toLocaleString('fr-FR')} FCFA
                            </Typography>
                            <Chip 
                              label={order.status} 
                              color={getStatusColor(order.status)} 
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <CardHeader 
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Produits populaires
                    </Typography>
                  } 
                  sx={{ 
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.02)}, ${alpha(theme.palette.warning.light, 0.05)})`
                  }} 
                />
                <CardContent>
                  <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    {products
                      .filter((p) => p.popular)
                      .slice(0, 5)
                      .map((product, index) => (
                        <Box 
                          key={product.id} 
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateX(4px)',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.02)}, ${alpha(theme.palette.warning.light, 0.05)})`
                            },
                            width: '100%',
                            maxWidth: 400
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Stock: {product.stock}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                              {product.price.toLocaleString('fr-FR')} FCFA
                            </Typography>
                          </Box>
                        </Box>
                      ))}
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

        {/* Orders Tab */}
        <CustomTabPanel value={activeTab} index={2}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Commande</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Articles</TableCell>
                    <TableCell>Paiement</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{(order as any).customer || `Client ${order.customerId}`}</TableCell>
                      <TableCell>{(order as any).date ? new Date((order as any).date).toLocaleDateString('fr-FR') : 'Date non spécifiée'}</TableCell>
                      <TableCell>
                        {(order as any).items && Array.isArray((order as any).items) 
                          ? `${(order as any).items.length} article(s)` 
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip label={(order as any).payment || 'Non spécifié'} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        {(order as any).source === 'whatsapp' ? (
                          <Chip icon={<Chat sx={{ fontSize: 14 }} />} label="WhatsApp" color="success" size="small" />
                        ) : (
                          <Chip label="Site Web" variant="outlined" size="small" />
                        )}
                      </TableCell>
                      <TableCell>{order.total.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          size="small"
                          sx={{ minWidth: 120 }}
                        // onChange={(e) => toast.success(`Statut mis à jour: ${e.target.value}`)}
                        >
                          <MenuItem value="pending">En attente</MenuItem>
                          <MenuItem value="processing">En cours</MenuItem>
                          <MenuItem value="shipped">Expédiée</MenuItem>
                          <MenuItem value="delivered">Livrée</MenuItem>
                          <MenuItem value="cancelled">Annulée</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewOrder(order)}>
                          <Eye fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CustomTabPanel>

        {/* Reviews Tab */}
        <CustomTabPanel value={activeTab} index={3}>
          <Card sx={{ mb: 4 }}>
            <CardHeader
              title="Avis Clients"
              subheader="Gérez et modérez les avis laissés par vos clients"
            />
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Commentaire</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products
                    .filter((p) => p.reviews && p.reviews.length > 0)
                    .flatMap((product) =>
                      (product.reviews || []).map((review) => ({
                        ...review,
                        productName: product.name,
                      }))
                    )
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.productName}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{review.customerName}</Typography>
                            {review.verified && (
                              <Chip label="Vérifié" size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: '0.625rem' }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                sx={{
                                  fontSize: 16,
                                  color: star <= review.rating ? 'warning.main' : 'action.disabled',
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" noWrap>{review.comment}</Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Chip label="Publié" color="success" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => { }}>
                            <Eye fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => { }}>
                            <Trash2 fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader
                  title="Total des avis"
                  action={<Star fontSize="small" color="action" />}
                />
                <CardContent>
                  <Typography variant="h4">
                    {products.reduce((sum, p) => sum + (p.reviews?.length || 0), 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Tous les produits</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader
                  title="Note moyenne"
                  action={<Star fontSize="small" color="warning" />}
                />
                <CardContent>
                  <Typography variant="h4">
                    {(
                      products
                        .flatMap((p) => p.reviews || [])
                        .reduce((sum, r) => sum + r.rating, 0) /
                      Math.max(products.flatMap((p) => p.reviews || []).length, 1)
                    ).toFixed(1)}
                    /5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Moyenne globale</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader
                  title="Avis vérifiés"
                  action={<Chip label="Vérifié" size="small" />}
                />
                <CardContent>
                  <Typography variant="h4">
                    {products.flatMap((p) => p.reviews || []).filter((r) => r.verified).length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Clients ayant acheté le produit</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Customers Tab */}
        <CustomTabPanel value={activeTab} index={4}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Téléphone</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Commandes</TableCell>
                    <TableCell>Total dépensé</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={(customer as any).type === 'wholesale' ? 'Grossiste' : 'Détail'}
                          color={(customer as any).type === 'wholesale' ? 'primary' : 'default'}
                          variant={(customer as any).type === 'wholesale' ? 'filled' : 'outlined'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{(customer as any).orders || 'N/A'}</TableCell>
                      <TableCell>{customer.totalSpent?.toLocaleString('fr-FR') || '0'} FCFA</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleViewCustomer(customer)}>
                          <Eye fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CustomTabPanel>

        {/* Settings Tab */}
        <CustomTabPanel value={activeTab} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader title="Méthodes de paiement" />
                <CardContent>
                  <Stack spacing={2}>
                    {[
                      { name: 'Wave', desc: 'Mobile Money' },
                      { name: 'Orange Money', desc: 'Mobile Money' },
                      { name: 'PayPal', desc: 'Carte bancaire' },
                      { name: 'Paiement à la livraison', desc: 'COD' },
                    ].map((method) => (
                      <Box key={method.name} display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body1">{method.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{method.desc}</Typography>
                        </Box>
                        <Chip label="Actif" color="success" size="small" />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader title="Informations boutique" />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField label="Nom de la boutique" defaultValue="Dame Sarr Import & Commerce" fullWidth />
                    <TextField label="Téléphone" defaultValue="+221 77 XXX XX XX" fullWidth />
                    <TextField label="Adresse" defaultValue="Dakar, Sénégal" fullWidth />
                    <Button variant="contained" onClick={() => { }}>Sauvegarder</Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ mt: 3 }}>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chat sx={{ color: 'success.main' }} />
                      Configuration WhatsApp
                    </Box>
                  }
                />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="Numéro WhatsApp pour commandes"
                      defaultValue="78 595 06 01"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        sx: { bgcolor: 'action.hover' }
                      }}
                      helperText="Les clients peuvent commander directement via WhatsApp"
                    />
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha('#4caf50', 0.1), borderColor: alpha('#4caf50', 0.3) }}>
                      <Box display="flex" gap={1}>
                        <Chat sx={{ color: 'success.main', mt: 0.5 }} fontSize="small" />
                        <Box>
                          <Typography variant="subtitle2" color="success.dark">Commandes WhatsApp actives</Typography>
                          <Typography variant="caption" color="success.dark">
                            Les clients peuvent commander via WhatsApp depuis les pages produits.
                            Chaque commande inclut l'image du produit, la référence et les détails.
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    <Box>
                      <Typography variant="body2" gutterBottom>Commandes reçues via WhatsApp</Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Paper sx={{ flex: 1, p: 2, bgcolor: 'action.hover' }} variant="outlined">
                          <Typography variant="h5">{whatsappOrders}</Typography>
                          <Typography variant="caption" color="text.secondary">Total des commandes</Typography>
                        </Paper>
                        <Chip
                          label={`${((whatsappOrders / totalOrders) * 100).toFixed(0)}%`}
                          color="success"
                        />
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Box>

      {/* View Product Dialog */}
      <Dialog open={isViewProductOpen} onClose={() => setIsViewProductOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails du produit</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                <ImageWithFallback
                  src={selectedProduct?.image || ''}
                  alt={selectedProduct?.name || 'Produit'}
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              {selectedProduct?.images && (selectedProduct?.images?.length || 0) > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {selectedProduct?.images?.map((img: any, idx: number) => (
                    <Box key={idx} sx={{ width: 60, height: 60, borderRadius: 1, overflow: 'hidden' }}>
                      <ImageWithFallback
                        src={img}
                        alt={`${selectedProduct?.name || 'Produit'} ${idx + 1}`}
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nom</Typography>
                  <Typography variant="body1">{selectedProduct?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Catégorie</Typography>
                  <Typography variant="body1">{categories.find((c) => c.id === selectedProduct?.category)?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Prix détail</Typography>
                  <Typography variant="body1">{selectedProduct?.price.toLocaleString('fr-FR')} FCFA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Prix gros</Typography>
                  <Typography variant="body1">{selectedProduct?.wholesalePrice?.toLocaleString('fr-FR') || 'N/A'} FCFA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pièces</Typography>
                  <Typography variant="body1">{selectedProduct?.pieces || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Stock</Typography>
                  <Typography variant="body1">{selectedProduct?.stock} unités</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body2">{selectedProduct?.description || 'Aucune description'}</Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewProductOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog - Placeholder, actual logic should be in ProductManagement or similar */}
      <Dialog open={isEditProductOpen} onClose={() => setIsEditProductOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le produit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modifiez les informations du produit
          </DialogContentText>
          {/* Form fields would go here, similar to AddProductDialog but populated */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditProductOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveProduct} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Product Alert Dialog */}
      <Dialog open={isDeleteProductOpen} onClose={() => setIsDeleteProductOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteProductOpen(false)}>Annuler</Button>
          <Button onClick={confirmDeleteProduct} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onClose={() => setIsViewOrderOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la commande</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">ID Commande</Typography>
                  <Typography variant="body1">{selectedOrder?.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Client</Typography>
                  <Typography variant="body1">{(selectedOrder as any)?.customer || `Client ${selectedOrder?.customerId}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body1">
                    {(selectedOrder as any).date ? new Date((selectedOrder as any).date).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Montant total</Typography>
                  <Typography variant="body1">{selectedOrder?.total.toLocaleString('fr-FR')} FCFA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Statut</Typography>
                  <Chip label={selectedOrder?.status} color={getStatusColor(selectedOrder?.status || '')} size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Paiement</Typography>
                  <Typography variant="body1">{(selectedOrder as any)?.payment || 'Non spécifié'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Source</Typography>
                  <Typography variant="body1">
                    {(selectedOrder as any)?.source === 'whatsapp' ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chat sx={{ fontSize: 16, color: 'success.main' }} />
                        WhatsApp
                      </Box>
                    ) : (
                      'Site web'
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewOrderOpen(false)}>Fermer</Button>
          <Button onClick={() => setIsViewOrderOpen(false)} variant="contained">Envoyer suivi</Button>
        </DialogActions>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewCustomerOpen} onClose={() => setIsViewCustomerOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Détails du client</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nom complet</Typography>
                  <Typography variant="body2">{selectedCustomer?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Type de client</Typography>
                  <Chip
                    label={(selectedCustomer as any)?.type === 'wholesale' ? 'Grossiste' : 'Détail'}
                    color={(selectedCustomer as any)?.type === 'wholesale' ? 'primary' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{selectedCustomer?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                  <Typography variant="body2">{selectedCustomer?.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nombre de commandes</Typography>
                  <Typography variant="body2">{(selectedCustomer as any)?.orders || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total dépensé</Typography>
                  <Typography variant="body2" color="primary">
                    {selectedCustomer?.totalSpent?.toLocaleString('fr-FR') || '0'} FCFA
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewCustomerOpen(false)}>Fermer</Button>
          <Button onClick={() => setIsViewCustomerOpen(false)} variant="contained">Contacter</Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
}