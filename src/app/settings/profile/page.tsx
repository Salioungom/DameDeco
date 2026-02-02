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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/v1/auth/me');
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
        });
      } else {
        setError(data.message || 'Erreur lors du chargement du profil');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
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
      const response = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profil mis à jour avec succès !');
        setProfile(prev => prev ? { ...prev, ...formData } : null);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
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
      <Typography variant="h4" component="h1" gutterBottom>
        Profil
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={profile?.avatar}
            sx={{ width: 64, height: 64, mr: 2 }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">{profile?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.role}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              ID Utilisateur
            </Typography>
            <Typography variant="body1">{profile?.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Date de création
            </Typography>
            <Typography variant="body1">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
          {profile?.lastLogin && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Dernière connexion
              </Typography>
              <Typography variant="body1">
                {new Date(profile.lastLogin).toLocaleDateString()}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations personnelles
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom complet"
            value={formData.name}
            onChange={handleChange('name')}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Adresse email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Numéro de téléphone"
            value={formData.phone}
            onChange={handleChange('phone')}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
