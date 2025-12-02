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
  WhatsApp as MessageCircle,
  FolderOpen,
  Star,
  Close as CloseIcon,
  Logout,
} from '@mui/icons-material';
import { products, orders, customers, categories, Product, Order } from '../lib/data';
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
  const whatsappOrders = orders.filter(order => order.source === 'whatsapp').length;

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
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'background.default', width: '100%' }}>
      <Box sx={{ px: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>Dashboard Administrateur</Typography>
            <Typography variant="body1" color="text.secondary">Gérez votre boutique en ligne</Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Déconnexion
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<LayoutDashboard />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<Package />} iconPosition="start" label="Produits" />
            <Tab icon={<ShoppingCart />} iconPosition="start" label="Commandes" />
            <Tab icon={<Star />} iconPosition="start" label="Avis Clients" />
            <Tab icon={<Users />} iconPosition="start" label="Clients" />
            <Tab icon={<Settings />} iconPosition="start" label="Paramètres" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <CustomTabPanel value={activeTab} index={0}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card>
                <CardHeader
                  title="Revenu Total"
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  action={<DollarSign fontSize="small" color="action" />}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{totalRevenue.toLocaleString('fr-FR')} FCFA</Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Typography component="span" variant="caption" color="success.main">+12.5%</Typography> ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card>
                <CardHeader
                  title="Commandes"
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  action={<ShoppingCart fontSize="small" color="action" />}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{totalOrders}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Typography component="span" variant="caption" color="success.main">+5</Typography> cette semaine
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card>
                <CardHeader
                  title="Produits"
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  action={<Package fontSize="small" color="action" />}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{totalProducts}</Typography>
                  <Typography variant="caption" color="text.secondary">En catalogue</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card>
                <CardHeader
                  title="Clients"
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  action={<Users fontSize="small" color="action" />}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{totalCustomers}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    <Typography component="span" variant="caption" color="success.main">+2</Typography> nouveaux ce mois
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={2.4}>
              <Card>
                <CardHeader
                  title="WhatsApp"
                  titleTypographyProps={{ variant: 'subtitle2' }}
                  action={<MessageCircle fontSize="small" color="success" />}
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Typography variant="h5" component="div">{whatsappOrders}</Typography>
                  <Typography variant="caption" color="text.secondary">Commandes WhatsApp</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader title="Commandes récentes" />
                <CardContent>
                  <Stack spacing={2}>
                    {orders.slice(0, 5).map((order) => (
                      <Box key={order.id} display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">{order.customer}</Typography>
                            {order.source === 'whatsapp' && (
                              <MessageCircle sx={{ fontSize: 14, color: 'success.main' }} />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">{order.id}</Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2">{order.total.toLocaleString('fr-FR')} FCFA</Typography>
                          <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card>
                <CardHeader title="Produits populaires" />
                <CardContent>
                  <Stack spacing={2}>
                    {products
                      .filter((p) => p.popular)
                      .slice(0, 5)
                      .map((product) => (
                        <Box key={product.id} display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="body2" noWrap>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">Stock: {product.stock}</Typography>
                          </Box>
                          <Typography variant="body2" color="primary">
                            {product.price.toLocaleString('fr-FR')} FCFA
                          </Typography>
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
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Chip label={order.payment} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        {order.source === 'whatsapp' ? (
                          <Chip icon={<MessageCircle sx={{ fontSize: 14 }} />} label="WhatsApp" color="success" size="small" />
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
                          label={customer.type === 'wholesale' ? 'Grossiste' : 'Détail'}
                          color={customer.type === 'wholesale' ? 'primary' : 'default'}
                          variant={customer.type === 'wholesale' ? 'filled' : 'outlined'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.totalSpent.toLocaleString('fr-FR')} FCFA</TableCell>
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
                      <MessageCircle sx={{ color: 'success.main' }} />
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
                        <MessageCircle sx={{ color: 'success.main', mt: 0.5 }} fontSize="small" />
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
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              {selectedProduct.images.length > 1 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Galerie d'images ({selectedProduct.images.length})</Typography>
                  <Grid container spacing={1}>
                    {selectedProduct.images.map((img, idx) => (
                      <Grid item xs={3} key={idx}>
                        <Box sx={{ position: 'relative', paddingTop: '100%', bgcolor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                          <ImageWithFallback
                            src={img}
                            alt={`${selectedProduct.name} ${idx + 1}`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nom</Typography>
                  <Typography variant="body1">{selectedProduct.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Catégorie</Typography>
                  <Typography variant="body1">{categories.find((c) => c.id === selectedProduct.category)?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Prix détail</Typography>
                  <Typography variant="body1">{selectedProduct.price.toLocaleString('fr-FR')} FCFA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Prix grossiste</Typography>
                  <Typography variant="body1">{selectedProduct.wholesalePrice.toLocaleString('fr-FR')} FCFA</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Stock</Typography>
                  <Typography variant="body1">{selectedProduct.stock} unités</Typography>
                </Grid>
                {selectedProduct.pieces && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Nombre de pièces</Typography>
                    <Typography variant="body1">{selectedProduct.pieces}</Typography>
                  </Grid>
                )}
              </Grid>
              <Box>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2" color="text.secondary">{selectedProduct.description}</Typography>
              </Box>
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
      <Dialog open={isViewOrderOpen} onClose={() => setIsViewOrderOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de la commande</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Numéro de commande</Typography>
                  <Typography variant="body2">{selectedOrder.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Client</Typography>
                  <Typography variant="body2">{selectedOrder.customer}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">{new Date(selectedOrder.date).toLocaleDateString('fr-FR')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Statut</Typography>
                  <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Méthode de paiement</Typography>
                  <Typography variant="body2">{selectedOrder.payment}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nombre d'articles</Typography>
                  <Typography variant="body2">{selectedOrder.items}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Source de commande</Typography>
                  <Box>
                    {selectedOrder.source === 'whatsapp' ? (
                      <Chip icon={<MessageCircle sx={{ fontSize: 14 }} />} label="WhatsApp" color="success" size="small" />
                    ) : (
                      <Chip label="Site Web" variant="outlined" size="small" />
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="h6" color="primary">
                  {selectedOrder.total.toLocaleString('fr-FR')} FCFA
                </Typography>
              </Box>
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
                  <Typography variant="body2">{selectedCustomer.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Type de client</Typography>
                  <Chip
                    label={selectedCustomer.type === 'wholesale' ? 'Grossiste' : 'Détail'}
                    color={selectedCustomer.type === 'wholesale' ? 'primary' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{selectedCustomer.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                  <Typography variant="body2">{selectedCustomer.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nombre de commandes</Typography>
                  <Typography variant="body2">{selectedCustomer.orders}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total dépensé</Typography>
                  <Typography variant="body2" color="primary">
                    {selectedCustomer.totalSpent.toLocaleString('fr-FR')} FCFA
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
    </Box>
  );
}