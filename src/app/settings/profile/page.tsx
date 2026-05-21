'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import apiClient from '@/lib/api-client';

interface UserProfile {
  id: number;
  name?: string;
  full_name?: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    username: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const parseErrorMessage = (err: any): string => {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
    }
    return err.response?.data?.message || err.message || 'Une erreur est survenue';
  };

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/api/v1/users/me');
      const data = response.data;
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        full_name: data.full_name || '',
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (err: any) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.patch('/api/v1/users/me', formData);
      setSuccess('Profil mis à jour avec succès !');
      setProfile(response.data);
    } catch (err: any) {
      setError(parseErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, my: 3 }}>
        Profil
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={profile?.avatar}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile?.full_name || profile?.name || profile?.username}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              Rôle : {profile?.role}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              ID Utilisateur
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{profile?.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Date de création
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Informations personnelles
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom complet"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange('username')}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom d'affichage"
                value={formData.name}
                onChange={handleChange('name')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de téléphone"
                value={formData.phone}
                onChange={handleChange('phone')}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1, borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
