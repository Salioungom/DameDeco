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

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export function CategoriesManagement() {
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
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [createImageFile, setCreateImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await categoryService.getCategories({
        skip: state.pagination.skip,
        limit: state.pagination.limit,
        search: state.filters.search || undefined,
        is_active: state.filters.is_active !== null ? state.filters.is_active : undefined,
      });
      setState(prev => ({
        ...prev,
        categories: response.items || [],
        pagination: { ...prev.pagination, total: response.total || 0 },
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [state.pagination.skip, state.pagination.limit, state.filters.search, state.filters.is_active]);

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        skip: (value - 1) * prev.pagination.limit,
      },
    }));
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, search: event.target.value },
      pagination: { ...prev.pagination, skip: 0 },
    }));
  };

  // Handle filter
  const handleFilter = (is_active: boolean | null) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, is_active },
      pagination: { ...prev.pagination, skip: 0 },
    }));
  };

  // Handle create
  const handleCreate = async () => {
    try {
      // Créer la catégorie d'abord
      const newCategory = await categoryService.createCategory(formData);
      
      // Si une image a été sélectionnée, l'uploader
      if (createImageFile) {
        try {
          await categoryService.uploadCategoryImage(newCategory.id, createImageFile);
        } catch (imageError) {
          console.warn('Image upload failed:', imageError);
          setSnackbar({
            open: true,
            message: 'Catégorie créée mais erreur lors du téléchargement de l\'image',
            severity: 'warning',
          });
        }
      }
      
      setCreateDialogOpen(false);
      setCreateImageFile(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        sort_order: 0,
      });
      fetchCategories();
      setSnackbar({
        open: true,
        message: 'Catégorie créée avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la création',
        severity: 'error',
      });
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!selectedCategory) return;
    try {
      // Mettre à jour la catégorie d'abord
      await categoryService.updateCategory(selectedCategory.id, formData);
      
      // Si une nouvelle image a été sélectionnée, l'uploader
      if (editImageFile) {
        try {
          await categoryService.uploadCategoryImage(selectedCategory.id, editImageFile);
        } catch (imageError) {
          console.warn('Image upload failed:', imageError);
          setSnackbar({
            open: true,
            message: 'Catégorie mise à jour mais erreur lors du téléchargement de l\'image',
            severity: 'warning',
          });
        }
      }
      
      setEditDialogOpen(false);
      setSelectedCategory(null);
      setEditImageFile(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        sort_order: 0,
      });
      fetchCategories();
      setSnackbar({
        open: true,
        message: 'Catégorie mise à jour avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
        severity: 'error',
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
      setSnackbar({
        open: true,
        message: 'Catégorie supprimée avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        severity: 'error',
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (category: Category) => {
    try {
      // Mettre à jour l'état localement d'abord pour une réponse immédiate
      setState(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === category.id 
            ? { ...cat, is_active: !cat.is_active }
            : cat
        )
      }));
      
      // Puis appeler l'API pour persister le changement
      await categoryService.toggleCategoryStatus(category.id);
      
      setSnackbar({
        open: true,
        message: `Catégorie ${category.is_active ? 'désactivée' : 'activée'} avec succès`,
        severity: 'success',
      });
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      setState(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === category.id 
            ? { ...cat, is_active: cat.is_active }
            : cat
        )
      }));
      
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors du changement de statut',
        severity: 'error',
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedCategory || !selectedImageFile) return;
    try {
      await categoryService.uploadCategoryImage(selectedCategory.id, selectedImageFile);
      setImageUploadDialogOpen(false);
      setSelectedImageFile(null);
      setSelectedCategory(null);
      fetchCategories();
      setSnackbar({
        open: true,
        message: 'Image téléchargée avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors du téléchargement',
        severity: 'error',
      });
    }
  };

  // Handle image delete
  const handleImageDelete = async (category: Category) => {
    try {
      await categoryService.deleteCategoryImage(category.id);
      fetchCategories();
      setSnackbar({
        open: true,
        message: 'Image supprimée avec succès',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        severity: 'error',
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditImageFile(null);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setEditDialogOpen(true);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Gestion des Catégories
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ px: 3 }}
          >
            Nouvelle Catégorie
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Rechercher..."
            value={state.filters.search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant={state.filters.is_active === null ? 'contained' : 'outlined'}
            onClick={() => handleFilter(null)}
          >
            Tous
          </Button>
          <Button
            variant={state.filters.is_active === true ? 'contained' : 'outlined'}
            onClick={() => handleFilter(true)}
            color="success"
          >
            Actifs
          </Button>
          <Button
            variant={state.filters.is_active === false ? 'contained' : 'outlined'}
            onClick={() => handleFilter(false)}
            color="error"
          >
            Inactifs
          </Button>
        </Box>

        {/* Error */}
        {state.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Ordre</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : state.categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                state.categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          bgcolor: 'grey.100',
                        }}
                      >
                        {category.cover_image_url ? (
                          <Box
                            component="img"
                            src={category.cover_image_url.startsWith('http') 
                              ? category.cover_image_url 
                              : `${process.env.NEXT_PUBLIC_API_URL}${category.cover_image_url}`}
                            alt={category.name}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.style.width = '100%';
                                fallback.style.height = '100%';
                                fallback.style.display = 'flex';
                                fallback.style.alignItems = 'center';
                                fallback.style.justifyContent = 'center';
                                fallback.style.backgroundColor = '#f5f5f5';
                                fallback.style.color = '#9e9e9e';
                                fallback.style.fontSize = '0.75rem';
                                fallback.textContent = 'Image non disponible';
                                parent.appendChild(fallback);
                              }
                            }}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                              textAlign: 'center',
                              p: 1
                            }}
                          >
                            Aucune image
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.is_active ? 'Actif' : 'Inactif'}
                        color={category.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{category.sort_order}</TableCell>
                    <TableCell align="right">
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
                          sx={{
                            color: category.is_active ? 'success.main' : 'error.main',
                            '&:hover': {
                              backgroundColor: category.is_active ? 'success.light' : 'error.light',
                            }
                          }}
                        >
                          {category.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger une image">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCategory(category);
                            setImageUploadDialogOpen(true);
                          }}
                        >
                          <UploadIcon />
                        </IconButton>
                      </Tooltip>
                      {category.cover_image_url && (
                        <Tooltip title="Supprimer l'image">
                          <IconButton
                            size="small"
                            onClick={() => handleImageDelete(category)}
                          >
                            <DeleteImageIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedCategory(category);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {state.pagination.total > state.pagination.limit && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(state.pagination.total / state.pagination.limit)}
              page={Math.floor(state.pagination.skip / state.pagination.limit) + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Nouvelle Catégorie</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nom"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                label="Slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
              <TextField
                label="Ordre de tri"
                type="number"
                value={formData.sort_order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Actif"
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Image de la catégorie (optionnel)
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateImageFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="create-image-upload"
                />
                <label htmlFor="create-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: createImageFile ? 1 : 0 }}
                  >
                    {createImageFile ? createImageFile.name : 'Choisir une image'}
                  </Button>
                </label>
                {createImageFile && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="success.main">
                      ✓ Image sélectionnée
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} variant="contained">
              Créer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Modifier la Catégorie</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nom"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                label="Slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
              <TextField
                label="Ordre de tri"
                type="number"
                value={formData.sort_order}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Actif"
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Image de la catégorie (optionnel)
                </Typography>
                {selectedCategory?.cover_image_url && (
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={selectedCategory.cover_image_url}
                      alt={selectedCategory.name}
                      sx={{ width: 60, height: 60 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Image actuelle
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="edit-image-upload"
                />
                <label htmlFor="edit-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: editImageFile ? 1 : 0 }}
                  >
                    {editImageFile ? editImageFile.name : 'Choisir une nouvelle image'}
                  </Button>
                </label>
                {editImageFile && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="success.main">
                      ✓ Nouvelle image sélectionnée
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEdit} variant="contained">
              Modifier
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Supprimer la Catégorie</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.name}" ?
              Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Image Upload Dialog */}
        <Dialog open={imageUploadDialogOpen} onClose={() => setImageUploadDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Télécharger une Image</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Typography>
                Sélectionnez une image pour la catégorie "{selectedCategory?.name}"
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImageUploadDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleImageUpload} variant="contained" disabled={!selectedImageFile}>
              Télécharger
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
