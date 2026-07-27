'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  alpha,
  Chip,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { BRAND_BLUE } from '@/theme';

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
  const router = useRouter();
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
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) return detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
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
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#85B7EB', 0.25)}, transparent)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-20px) translateX(20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#E6F1FB', 0.2)}, transparent)`,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
          {/* Navigation Tabs */}
          <Box
            sx={{
              display: 'inline-flex',
              mb: 3,
              p: 0.5,
              borderRadius: '12px',
              background: alpha('#fff', 0.1),
              backdropFilter: 'blur(10px)',
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                background: alpha('#fff', 0.95),
                color: '#042C53',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                userSelect: 'none',
              }}
            >
              Profil
            </Box>
            <Box
              onClick={() => router.push('/settings/password')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                userSelect: 'none',
                '&:hover': {
                  background: alpha('#fff', 0.1),
                },
              }}
            >
              Mot de passe
            </Box>
          </Box>

          {/* Main Card */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 5 },
              borderRadius: '16px',
              background: alpha('#fff', 0.97),
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(4, 44, 83, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              animation: 'slideUp 0.6s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4.5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                  mb: 2.5,
                  boxShadow: '0 4px 16px rgba(24, 95, 165, 0.3)',
                }}
              >
                <PersonIcon sx={{ fontSize: 26, color: '#fff' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#042C53',
                  mb: 0.75,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                Profil
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Gérez vos informations personnelles
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" variant="outlined" sx={{ mb: 3, animation: 'slideUp 0.35s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" variant="outlined" sx={{ mb: 3, animation: 'slideUp 0.35s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                {success}
              </Alert>
            )}

            {/* Avatar & Info Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                p: 2.5,
                mb: 4,
                borderRadius: '12px',
                background: alpha('#E6F1FB', 0.5),
              }}
            >
              <Avatar
                src={profile?.avatar}
                sx={{
                  width: 64,
                  height: 64,
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#042C53' }}>
                  {profile?.full_name || profile?.name || profile?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.email}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={profile?.role || 'Utilisateur'}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Membre depuis le {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                </Typography>
              </Box>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom complet"
                    value={formData.full_name}
                    onChange={handleChange('full_name')}
                    required
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange('username')}
                    required
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom d'affichage"
                    value={formData.name}
                    onChange={handleChange('name')}
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Numéro de téléphone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Adresse email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                fullWidth
                startIcon={!saving && <PersonIcon sx={{ fontSize: 18 }} />}
                sx={{
                  mt: 3.5,
                  py: 1.625,
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                  boxShadow: '0 4px 16px rgba(24, 95, 165, 0.35)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0C447C 0%, #185FA5 100%)',
                    boxShadow: '0 6px 20px rgba(24, 95, 165, 0.45)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    background: '#E6F1FB',
                    color: '#888780',
                  },
                }}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#85B7EB',
    },
    '&.Mui-focused': {
      borderColor: BRAND_BLUE,
      boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: BRAND_BLUE,
    },
  },
};
