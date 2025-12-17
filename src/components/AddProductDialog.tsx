'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Add,
  Close,
  Upload,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { categories as initialCategories, type Category, type Product } from '../lib/data';
import { ImageWithFallback } from './figma/ImageWithFallback';

const STORAGE_KEY = 'dame-sarr-categories';

interface AddProductDialogProps {
  onAddProduct: (product: Product) => void;
}

export function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') {
      return initialCategories;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCategories;
  });
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

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Category[]>;
      setCategories(customEvent.detail);
    };
    window.addEventListener('categoriesUpdated', handler);
    return () => window.removeEventListener('categoriesUpdated', handler);
  }, []);

  const resetForm = () => {
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
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageFromUrl = () => {
    if (!imageInput.trim()) {
      return;
    }
    setImages((prev) => [...prev, imageInput.trim()]);
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.wholesalePrice || !formData.stock) {
      enqueueSnackbar('Veuillez remplir tous les champs obligatoires', { variant: 'error' });
      return;
    }
    if (images.length === 0) {
      enqueueSnackbar('Ajoutez au moins une image', { variant: 'error' });
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
      images,
      category: formData.category,
      stock: parseInt(formData.stock, 10),
      pieces: formData.pieces ? parseInt(formData.pieces, 10) : undefined,
      popular: false,
    };

    onAddProduct(newProduct);
    enqueueSnackbar('Produit ajouté avec succès', { variant: 'success' });
    setOpen(false);
    resetForm();
  };

  const reduction =
    formData.price &&
      formData.originalPrice &&
      parseFloat(formData.originalPrice) > parseFloat(formData.price)
      ? Math.round(
        ((parseFloat(formData.originalPrice) - parseFloat(formData.price)) /
          parseFloat(formData.originalPrice)) *
        100,
      )
      : 0;

  return (
    <>
      <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
        Ajouter un produit
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ajouter un nouveau produit</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Nom du produit *"
                value={formData.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Ex: Ensemble draps luxe 6 pièces"
              />
              <TextField
                label="Description"
                multiline
                minRows={3}
                value={formData.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, description: event.target.value }))
                }
                placeholder="Décrivez le produit, ses matériaux, son origine..."
              />
              <TextField
                label="Catégorie *"
                select
                value={formData.category}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, category: event.target.value }))
                }
                SelectProps={{ native: true }}
              >
                <option value="" />
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prix détail (FCFA) *"
                    type="number"
                    value={formData.price}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, price: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prix avant promo"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, originalPrice: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prix grossiste (FCFA) *"
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, wholesalePrice: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stock disponible *"
                    type="number"
                    value={formData.stock}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, stock: event.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre de pièces (optionnel)"
                    type="number"
                    value={formData.pieces}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, pieces: event.target.value }))
                    }
                  />
                </Grid>
              </Grid>

              {reduction > 0 && (
                <Alert severity="success">
                  Réduction appliquée : -{reduction}% (vous économisez{' '}
                  {(
                    parseFloat(formData.originalPrice) - parseFloat(formData.price)
                  ).toLocaleString('fr-FR')}{' '}
                  FCFA)
                </Alert>
              )}

              <Stack spacing={2}>
                <Typography variant="subtitle1">Images du produit *</Typography>
                <Button component="label" variant="outlined" startIcon={<Upload />}>
                  Importer des images
                  <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                </Button>
                <TextField
                  label="Ou collez une URL d'image"
                  value={imageInput}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImageInput(event.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleAddImageFromUrl}>Ajouter</Button>
                      </InputAdornment>
                    ),
                  }}
                />

                {images.length > 0 && (
                  <Grid container spacing={2}>
                    {images.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={`${image}-${index}`}>
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: 1,
                            borderColor: 'divider',
                            height: 120,
                          }}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'background.paper',
                              boxShadow: 1,
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                          {index === 0 && (
                            <Chip
                              label="Principale"
                              color="primary"
                              size="small"
                              sx={{ position: 'absolute', bottom: 8, left: 8 }}
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Stack>
            </Stack>

            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={<Add />}>
                Ajouter le produit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

