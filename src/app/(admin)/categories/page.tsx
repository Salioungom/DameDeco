'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  InputAdornment,
  Alert,
  Snackbar,
  Grid,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  CloudOff as DeleteImageIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import { categoryService, type Category } from '@/services/category.service';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    skip: number;
    limit: number;
  };
  filters: {
    search: string;
    is_active: boolean | null;
  };
}

export default function AdminCategoriesPage() {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    loading: true,
    error: null,
    pagination: {
      total: 0,
      skip: 0,
      limit: 10,
    },
    filters: {
      search: '',
      is_active: null,
    },
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const fetchCategories = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params: any = {
        skip: state.pagination.skip,
        limit: state.pagination.limit,
      };

      if (state.filters.search) {
        params.search = state.filters.search;
      }

      if (state.filters.is_active !== null) {
        params.is_active = state.filters.is_active;
      }

      const response = await categoryService.getCategories(params);
      
      setState(prev => ({
        ...prev,
        categories: response.items,
        pagination: {
          ...prev.pagination,
          total: response.total,
        },
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des catégories',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [state.pagination.skip, state.pagination.limit, state.filters]);

  const handleCreateCategory = async () => {
    try {
      const newCategory = await categoryService.createCategory(formData);
      setSnackbar({
        open: true,
        message: 'Catégorie créée avec succès',
        severity: 'success',
      });
      setCreateDialogOpen(false);
      resetFormData();
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la création',
        severity: 'error',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      const updatedCategory = await categoryService.updateCategory(selectedCategory.id, formData);
      setSnackbar({
        open: true,
        message: 'Catégorie mise à jour avec succès',
        severity: 'success',
      });
      setEditDialogOpen(false);
      setSelectedCategory(null);
      resetFormData();
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        severity: 'error',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      setSnackbar({
        open: true,
        message: 'Catégorie supprimée avec succès',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        severity: 'error',
      });
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const updatedCategory = await categoryService.toggleCategoryStatus(category.id);
      setSnackbar({
        open: true,
        message: `Catégorie ${updatedCategory.is_active ? 'activée' : 'désactivée'} avec succès`,
        severity: 'success',
      });
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors du changement de statut',
        severity: 'error',
      });
    }
  };

  const handleUploadImage = async (categoryId: number, file: File) => {
    try {
      await categoryService.uploadCategoryImage(categoryId, file);
      setSnackbar({
        open: true,
        message: 'Image téléchargée avec succès',
        severity: 'success',
      });
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors du téléchargement',
        severity: 'error',
      });
    }
  };

  const handleDeleteImage = async (categoryId: number) => {
    try {
      await categoryService.deleteCategoryImage(categoryId);
      setSnackbar({
        open: true,
        message: 'Image supprimée avec succès',
        severity: 'success',
      });
      fetchCategories();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'image',
        severity: 'error',
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true,
      sort_order: 0,
    });
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadImage(categoryId, file);
    }
  };

  const totalPages = Math.ceil(state.pagination.total / state.pagination.limit);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Gestion des catégories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetFormData();
            setCreateDialogOpen(true);
          }}
        >
          Nouvelle catégorie
        </Button>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, slug ou description..."
              value={state.filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(prev => ({
                ...prev,
                filters: { ...prev.filters, search: e.target.value },
                pagination: { ...prev.pagination, skip: 0 },
              }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.filters.is_active === true}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(prev => ({
                    ...prev,
                    filters: { 
                      ...prev.filters, 
                      is_active: e.target.checked ? true : (prev.filters.is_active === true ? null : false)
                    },
                    pagination: { ...prev.pagination, skip: 0 },
                  }))}
                />
              }
              label="Actives uniquement"
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Ordre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>Chargement...</Typography>
                </TableCell>
              </TableRow>
            ) : state.categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>Aucune catégorie trouvée</Typography>
                </TableCell>
              </TableRow>
            ) : (
              state.categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Avatar
                      src={category.cover_image_url || undefined}
                      alt={category.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{category.name}</Typography>
                    {category.description && (
                      <Typography variant="body2" color="text.secondary">
                        {category.description.length > 50 
                          ? `${category.description.substring(0, 50)}...`
                          : category.description
                        }
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.is_active ? 'Active' : 'Inactive'}
                      color={category.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={category.is_active ? 'Désactiver' : 'Activer'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(category)}
                        >
                          {category.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger une image">
                        <IconButton
                          size="small"
                          component="label"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleImageUpload(e, category.id)}
                          />
                          <UploadIcon />
                        </IconButton>
                      </Tooltip>
                      {category.cover_image_url && (
                        <Tooltip title="Supprimer l'image">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImage(category.id)}
                          >
                            <DeleteImageIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={Math.floor(state.pagination.skip / state.pagination.limit) + 1}
            onChange={(event: React.ChangeEvent<unknown>, page: number) => setState(prev => ({
              ...prev,
              pagination: {
                ...prev.pagination,
                skip: (page - 1) * prev.pagination.limit,
              },
            }))}
          />
        </Box>
      )}

      {/* Formulaire de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom *"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                helperText="Laisser vide pour générer automatiquement"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ordre de tri"
                type="number"
                value={formData.sort_order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Catégorie active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateCategory} variant="contained" disabled={!formData.name.trim()}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulaire d'édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la catégorie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nom *"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ordre de tri"
                type="number"
                value={formData.sort_order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Catégorie active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleUpdateCategory} variant="contained" disabled={!formData.name.trim()}>
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.name}" ?
            {selectedCategory && (
              <Box component="span" color="error.main" display="block" mt={1}>
                Attention : cette action est irréversible et échouera si des produits sont associés à cette catégorie.
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
