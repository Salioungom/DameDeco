'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  alpha,
  CircularProgress,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { BRAND_BLUE } from '@/theme';

export default function ChangePasswordPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const router = useRouter();
  const { user, refetchUser } = useAuth();

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

  const validateForm = (): boolean => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }

    if (!newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 12) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 12 caractères';
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = 'Le mot de passe doit contenir au moins une lettre majuscule';
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      errors.newPassword = 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    if (!userId) {
      setError("Impossible de récupérer l'identifiant de l'utilisateur connecté.");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(`/api/v1/users/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess('Mot de passe modifié avec succès ! Redirection…');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFieldErrors({});

      await refetchUser();

      setTimeout(() => {
        if (user?.role === 'superadmin') {
          router.push('/dashboards');
        } else if (user?.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/account');
        }
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          'Erreur lors de la modification du mot de passe'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)`,
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

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
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
                <Lock sx={{ fontSize: 26, color: '#fff' }} />
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
                Changer le mot de passe
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Vous devez modifier votre mot de passe temporaire pour accéder à votre compte
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

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Mot de passe actuel"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPassword(e.target.value);
                  if (fieldErrors.currentPassword) setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }}
                error={!!fieldErrors.currentPassword}
                helperText={fieldErrors.currentPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                        sx={{
                          color: '#888780',
                          '&:hover': {
                            color: BRAND_BLUE,
                            bgcolor: 'rgba(24, 95, 165, 0.08)',
                          },
                        }}
                      >
                        {showCurrentPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.5,
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
                }}
              />

              <TextField
                fullWidth
                label="Nouveau mot de passe"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(e.target.value);
                  if (fieldErrors.newPassword) setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                error={!!fieldErrors.newPassword}
                helperText={fieldErrors.newPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        sx={{
                          color: '#888780',
                          '&:hover': {
                            color: BRAND_BLUE,
                            bgcolor: 'rgba(24, 95, 165, 0.08)',
                          },
                        }}
                      >
                        {showNewPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.5,
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
                }}
              />

              <TextField
                fullWidth
                label="Confirmer le nouveau mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{
                          color: '#888780',
                          '&:hover': {
                            color: BRAND_BLUE,
                            bgcolor: 'rgba(24, 95, 165, 0.08)',
                          },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
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
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                fullWidth
                sx={{
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
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Changer le mot de passe'
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
