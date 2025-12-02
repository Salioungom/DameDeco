import { useState, useEffect } from 'react';
import { 
  Add as Plus, 
  Edit, 
  Delete as Trash2, 
  Visibility as Eye, 
  CloudUpload as Upload, 
  Close as X, 
  Image as ImageIcon, 
  Inventory as Package 
} from '@mui/icons-material';
import { 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogContentText,
  IconButton,
  Chip,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  InputAdornment,
  Select as MuiSelect,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
// Suppression de l'import inutile de Theme
import { enqueueSnackbar } from 'notistack';
import { products as initialProducts, categories as initialCategories, Product, Category } from '../lib/data';
import { ImageWithFallback } from './figma/ImageWithFallback';


// Styles personnalisés

// Type pour les propriétés des composants stylisés

const StyledCard = styled(Card)(({ theme }: { theme: any }) => ({
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
    transition: 'all 0.3s ease-in-out',
  },
}));

const StyledBadge = styled(Chip)(({ theme }: { theme: any }) => ({
  '& .MuiChip-label': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const StyledButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 500,
});

const STORAGE_KEY = 'dame-sarr-categories';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    wholesalePrice: '',
    stock: '',
    category: '',
    pieces: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');

  // Écouter les changements de catégories
  useEffect(() => {
    const handleCategoriesUpdate = (event: any) => {
      setCategories(event.detail);
    };
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
  }, []);

  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      wholesalePrice: '',
      stock: '',
      category: '',
      pieces: '',
    });
    setImages([]);
    setImageInput('');
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      wholesalePrice: product.wholesalePrice.toString(),
      stock: product.stock.toString(),
      category: product.category,
      pieces: product.pieces?.toString() || '',
    });
    setImages(product.images || [product.image]);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages([...images, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.wholesalePrice || !formData.stock) {
      enqueueSnackbar('Veuillez remplir tous les champs obligatoires', { variant: 'error' });
      return;
    }

    if (images.length === 0) {
      enqueueSnackbar('Veuillez ajouter au moins une image', { variant: 'error' });
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      wholesalePrice: parseFloat(formData.wholesalePrice),
      image: images[0],
      images: images,
      category: formData.category,
      stock: parseInt(formData.stock),
      pieces: formData.pieces ? parseInt(formData.pieces) : undefined,
      popular: false,
    };

    setProducts([...products, newProduct]);
    enqueueSnackbar('Produit ajouté avec succès', { variant: 'success' });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    if (!formData.name || !formData.category || !formData.price || !formData.wholesalePrice || !formData.stock) {
      enqueueSnackbar('Veuillez remplir tous les champs obligatoires', { variant: 'error' });
      return;
    }

    if (images.length === 0) {
      enqueueSnackbar('Veuillez ajouter au moins une image', { variant: 'error' });
      return;
    }

    const updatedProduct: Product = {
      ...selectedProduct,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      wholesalePrice: parseFloat(formData.wholesalePrice),
      image: images[0],
      images: images,
      category: formData.category,
      stock: parseInt(formData.stock),
      pieces: formData.pieces ? parseInt(formData.pieces) : undefined,
    };

    setProducts(products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p)));
    enqueueSnackbar('Produit modifié avec succès', { variant: 'success' });
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    setProducts(products.filter((p) => p.id !== productToDelete.id));
    enqueueSnackbar('Produit supprimé avec succès', { variant: 'success' });
    setProductToDelete(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const discountPercentage = (product: Product) => {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCategoryChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (e.target) {
    setFormData({ ...formData, category: e.target.value });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des Produits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez votre catalogue de produits avec galeries d'images
          </Typography>
        </Box>
        <Button 
          onClick={openAddDialog} 
          variant="contained" 
          color="primary"
          startIcon={<Plus />}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          Ajouter un produit
        </Button>
      </Box>

      {/* Liste des produits */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 2,
        width: '100%'
      }}>
        {products.map((product) => (
          <Box key={product.id} sx={{ width: '100%' }}>
            <StyledCard>
              <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', bgcolor: 'action.hover' }}>
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                  }}
                />
                <Box sx={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {product.popular && (
                      <Chip 
                        label="Populaire" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          color: 'primary.contrastText',
                          fontWeight: 'bold',
                          alignSelf: 'flex-start'
                        }} 
                      />
                    )}
                    {discountPercentage(product) > 0 && (
                      <Chip 
                        label={`-${discountPercentage(product)}%`} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'error.main', 
                          color: 'white',
                          fontWeight: 'bold',
                          alignSelf: 'flex-start',
                          '&:hover': { bgcolor: 'error.dark' }
                        }} 
                      />
                    )}
                  </Box>
                  <Box>
                    {product.images && product.images.length > 1 && (
                      <Chip 
                        icon={<ImageIcon fontSize="small" />}
                        label={product.images.length}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(0, 0, 0, 0.6)', 
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              <CardContent sx={{ pb: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={getCategoryName(product.category)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography 
                    variant="subtitle1" 
                    component="h3"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '3em',
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                  <Typography color="primary" variant="h6">
                    {product.price.toLocaleString('fr-FR')} FCFA
                  </Typography>
                  {product.originalPrice && (
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      {product.originalPrice.toLocaleString()} XOF
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">Stock: {product.stock}</Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <StyledButton
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Eye fontSize="small" />}
                  onClick={() => openViewDialog(product)}
                >
                  Voir
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Edit fontSize="small" />}
                  onClick={() => openEditDialog(product)}
                >
                  Modifier
                </StyledButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setProductToDelete(product)}
                  sx={{ ml: 'auto' }}
                >
                  <Trash2 fontSize="small" />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Box>
        ))}

        {products.length === 0 && (
          <Box sx={{ gridRow: '1 / -1', gridColumn: '1 / -1' }}>
            <Card>
              <CardContent sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Package sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary" gutterBottom>
                  Aucun produit disponible
                </Typography>
                <Button 
                  onClick={openAddDialog} 
                  variant="contained"
                  startIcon={<Plus />}
                  sx={{ mt: 2 }}
                >
                  Ajouter votre premier produit
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Dialog Ajouter/Modifier */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedProduct(null);
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isAddDialogOpen ? 'Ajouter un produit' : 'Modifier le produit'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Remplissez les informations du produit et ajoutez des images
          </DialogContentText>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 3,
            mt: 1
          }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="Nom du produit *"
                id="name"
                placeholder="Ex: Ensemble draps luxe 6 pièces"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                variant="outlined"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                id="description"
                placeholder="Description détaillée du produit..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / 7' }}>
              <TextField
                fullWidth
                label="Prix détail *"
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                margin="normal"
                variant="outlined"
              />
            </Box>
            <Box sx={{ gridColumn: '7 / -1' }}>
              <TextField
                fullWidth
                label="Prix grossiste *"
                id="wholesalePrice"
                type="number"
                value={formData.wholesalePrice}
                onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                margin="normal"
                variant="outlined"
              />
            </Box>
            <Box sx={{ gridColumn: '1 / 7' }}>
              <TextField
                fullWidth
                label="Stock *"
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                margin="normal"
                variant="outlined"
              />
            </Box>
            <Box sx={{ gridColumn: '7 / -1' }}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Catégorie *</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Catégorie *"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category: Category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  component="span"
                  startIcon={<Upload />}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Téléverser
                </Button>
                <TextField
                  fullWidth
                  label="Ajouter une image"
                  id="image"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          color="primary"
                          variant="contained"
                          onClick={handleAddImage}
                        >
                          Ajouter
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {images.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 1, mt: 2, pb: 1 }}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`Image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'error.main',
                          color: 'error.contrastText',
                          '&:hover': {
                            bgcolor: 'error.dark',
                          },
                        }}
                      >
                        <X fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedProduct(null);
            }}
            variant="outlined"
            color="inherit"
            sx={{ mr: 1 }}
          >
            Annuler
          </Button>
          <Button
            onClick={isAddDialogOpen ? handleAddProduct : handleEditProduct}
            variant="contained"
            color="primary"
            startIcon={isAddDialogOpen ? <Plus /> : <Edit />}
          >
            {isAddDialogOpen ? 'Ajouter le produit' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Voir */}
      <Dialog 
        open={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Détails du produit</DialogTitle>
        {selectedProduct && (
          <DialogContent>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              width: '100%'
            }}>
              <Box>
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 400, 
                  bgcolor: 'action.hover', 
                  borderRadius: 1, 
                  overflow: 'hidden' 
                }}>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                    gap: 1,
                    mt: 2,
                    pb: 1
                  }}>
                    {selectedProduct.images.map((img, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: '2px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    {selectedProduct.price.toLocaleString()} XOF
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Prix détail
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      {selectedProduct.price.toLocaleString('fr-FR')} FCFA
                      {selectedProduct.originalPrice && (
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {selectedProduct.originalPrice.toLocaleString('fr-FR')} FCFA
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Prix grossiste
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedProduct.wholesalePrice.toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Stock
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedProduct.stock} unités
                    </Typography>
                  </Box>
                  {selectedProduct?.pieces && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Pièces
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedProduct.pieces} pièces
                      </Typography>
                    </Box>
                  )}
                  {selectedProduct?.description && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {selectedProduct.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation de suppression */}
      <Dialog
        open={!!productToDelete}
        onClose={() => setProductToDelete(null)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductToDelete(null)} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={() => {
              if (productToDelete) {
                handleDeleteProduct();
                setProductToDelete(null);
              }
            }}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;
