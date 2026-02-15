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
  Card,
  CardContent,
  alpha,
  useTheme,
  Fade,
  Skeleton,
  Zoom,
  Backdrop,
  CircularProgress,
  Divider,
  Stack,
  LinearProgress,
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
  Image as ImageIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
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

interface CategoriesManagementProps {
  showStats?: boolean;
}

export function CategoriesManagement({ showStats = false }: CategoriesManagementProps) {
  const theme = useTheme();
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      if (selectedImage) {
        await categoryService.uploadCategoryImage(newCategory.id, selectedImage);
      }

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

  const handleUploadImage = async (category: Category, file: File) => {
    try {
      if (category.cover_image_url) {
        await categoryService.updateCategoryImage(category.id, file);
      } else {
        await categoryService.uploadCategoryImage(category.id, file);
      }

      setSnackbar({
        open: true,
        message: 'Image mise à jour avec succès',
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
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, category: Category) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadImage(category, file);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const totalPages = Math.ceil(state.pagination.total / state.pagination.limit);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderRadius: 3,
          p: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight={800} color="primary.main" mb={1}>
              Gestion des catégories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez votre catalogue de catégories de produits
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetFormData();
              setCreateDialogOpen(true);
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          >
            Nouvelle catégorie
          </Button>
        </Box>

        {/* Stats Cards - Conditionally rendered */}
        {showStats && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {state.pagination.total}
                  </Typography>
                  <Typography variant="body2" opacity={0.9}>
                    Total catégories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {state.categories.filter(c => c.is_active).length}
                  </Typography>
                  <Typography variant="body2" opacity={0.9}>
                    Catégories actives
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {state.categories.filter(c => !c.is_active).length}
                  </Typography>
                  <Typography variant="body2" opacity={0.9}>
                    Catégories inactives
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" fontWeight={700}>
                    {state.categories.filter(c => c.cover_image_url).length}
                  </Typography>
                  <Typography variant="body2" opacity={0.9}>
                    Avec images
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* Filters Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FilterIcon color="action" />
            <Typography variant="h6" fontWeight={600}>
              Filtres et recherche
            </Typography>
            <Box flexGrow={1} />
            <IconButton
              onClick={() => setState(prev => ({ ...prev, filters: { search: '', is_active: null }, pagination: { ...prev.pagination, skip: 0 } }))}
              title="Réinitialiser les filtres"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
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
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'background.paper',
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  },
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
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>Actives uniquement</Typography>
                    <Typography variant="caption" color="text.secondary">Afficher seulement les catégories actives</Typography>
                  </Box>
                }
                sx={{ ml: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={state.filters.is_active === null ? "contained" : "outlined"}
                  onClick={() => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, is_active: null },
                    pagination: { ...prev.pagination, skip: 0 },
                  }))}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Toutes
                </Button>
                <Button
                  variant={state.filters.is_active === true ? "contained" : "outlined"}
                  onClick={() => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, is_active: true },
                    pagination: { ...prev.pagination, skip: 0 },
                  }))}
                  color="success"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Actives
                </Button>
                <Button
                  variant={state.filters.is_active === false ? "contained" : "outlined"}
                  onClick={() => setState(prev => ({
                    ...prev,
                    filters: { ...prev.filters, is_active: false },
                    pagination: { ...prev.pagination, skip: 0 },
                  }))}
                  color="error"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Inactives
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }}
      >
        {state.loading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderBottom: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  py: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Image
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderBottom: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  py: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CategoryIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Nom
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderBottom: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  py: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.info.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SortIcon fontSize="small" sx={{ color: theme.palette.info.main }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: theme.palette.info.main }}>
                      Slug
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderBottom: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  py: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.success.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <VisibilityIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: theme.palette.success.main }}>
                      Statut
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderBottom: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  py: 2,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  textAlign: 'right',
                }}>
                  <Box display="flex" alignItems="center" gap={1.5} justifyContent="flex-end">
                    <Typography variant="subtitle2" fontWeight={700}>
                      Actions
                    </Typography>
                    <Box
                      sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MoreVertIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="circular" width={56} height={56} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={24} rx={12} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={200} height={32} rx={4} /></TableCell>
                  </TableRow>
                ))
              ) : state.categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box>
                      <CategoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" mb={1}>
                        Aucune catégorie trouvée
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {state.filters.search || state.filters.is_active !== null
                          ? 'Essayez de modifier vos filtres de recherche'
                          : 'Commencez par créer votre première catégorie'
                        }
                      </Typography>
                      {!state.filters.search && state.filters.is_active === null && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            resetFormData();
                            setCreateDialogOpen(true);
                          }}
                          sx={{ mt: 2 }}
                        >
                          Créer une catégorie
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                state.categories.map((category, index) => (
                  <TableRow
                    key={category.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell>
                      <Zoom in timeout={300 + index * 50}>
                        <Avatar
                          src={category.cover_image_url || undefined}
                          alt={category.name}
                          variant="rounded"
                          sx={{
                            width: 56,
                            height: 56,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: category.cover_image_url ? 'none' : `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                          }}
                        >
                          {!category.cover_image_url && <CategoryIcon />}
                        </Avatar>
                      </Zoom>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography fontWeight={600} color="text.primary">
                          {category.name}
                        </Typography>
                        {category.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {category.description.length > 60
                              ? `${category.description.substring(0, 60)}...`
                              : category.description
                            }
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.slug}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          backgroundColor: alpha(theme.palette.info.main, 0.05),
                          borderColor: alpha(theme.palette.info.main, 0.2),
                          color: theme.palette.info.main,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.is_active ? 'Active' : 'Inactive'}
                        color={category.is_active ? 'success' : 'default'}
                        size="small"
                        icon={category.is_active ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                        sx={{
                          fontWeight: 500,
                          '&.MuiChip-colorSuccess': {
                            backgroundColor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={0.5} justifyContent="flex-end">
                        <Tooltip title="Modifier" arrow>
                          <IconButton
                            size="small"
                            onClick={() => openEditDialog(category)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={category.is_active ? 'Désactiver' : 'Activer'} arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(category)}
                            sx={{
                              color: category.is_active ? theme.palette.success.main : theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: category.is_active
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            {category.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Télécharger une image" arrow>
                          <IconButton
                            size="small"
                            component="label"
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.info.main, 0.1),
                              },
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => handleImageUpload(e, category)}
                            />
                            <UploadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {category.cover_image_url && (
                          <Tooltip title="Supprimer l'image" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteImage(category.id)}
                              sx={{
                                color: theme.palette.warning.main,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                },
                              }}
                            >
                              <DeleteImageIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Supprimer" arrow>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openDeleteDialog(category)}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
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
      </Card>

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
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    mb: 2,
                    position: 'relative',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  {previewUrl ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 40, color: alpha(theme.palette.text.secondary, 0.4) }} />
                  )}
                </Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  size="small"
                >
                  Sélectionner une image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </Button>
                {selectedImage && (
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    {selectedImage.name}
                  </Typography>
                )}
              </Box>
            </Grid>
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
