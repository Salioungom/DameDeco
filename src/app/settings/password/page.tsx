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
} from '@mui/material';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import apiClient from '@/lib/api-client';

export default function PasswordPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/api/v1/users/me');
        setUserId(response.data.id);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!userId) {
      setError('Impossible de récupérer l\'identifiant de l\'utilisateur connecté.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post(`/api/v1/users/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess('Mot de passe modifié avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = async (password: string) => {
    try {
      const response = await apiClient.post('/api/v1/auth/password/strength', { password });
      return response.data;
    } catch (err) {
      // Ignore errors for strength check
    }
    return null;
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, my: 3 }}>
        Mot de passe
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Changer le mot de passe
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <PasswordStrengthMeter
            password={newPassword}
            onStrengthCheck={checkPasswordStrength}
          />

          <TextField
            fullWidth
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

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
            disabled={loading || !currentPassword || !newPassword || !confirmPassword || !userId}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1, borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? 'Modification...' : 'Changer le mot de passe'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
