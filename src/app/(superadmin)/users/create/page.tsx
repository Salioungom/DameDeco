'use client';

import { useState, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  FormHelperText,
  alpha,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminIcon,
  Visibility,
  VisibilityOff,
  PersonOutline,
  BadgeOutlined,
} from '@mui/icons-material';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/contexts/AuthContext';

const BRAND = {
  primary: '#185FA5',
  dark: '#042C53',
  white: '#FFFFFF',
  light: '#E6F1FB',
  surface: '#F5F9FE',
  border: '#D4E8F7',
  muted: '#5F6B7A',
} as const;

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: BRAND.white,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: BRAND.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: BRAND.primary,
      borderWidth: 2,
    },
  },
};

export default function CreateAdminPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'admin' as const,
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = accessToken || localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim() || undefined,
        password: formData.password,
        full_name: formData.full_name.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        role: 'admin',
        is_active: true,
      };

      const res = await fetch(`${apiUrl}/api/v1/users/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (res.status === 404) {
          throw new Error(`Endpoint non trouvé sur ${apiUrl}. Le backend est-il démarré ?`);
        }
        if (res.status === 400) {
          const errorData = await res.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const errorMessages = errorData.detail
              .map((err: { loc?: string[]; msg: string }) => `${err.loc?.join('.')} : ${err.msg}`)
              .join(', ');
            throw new Error(errorMessages);
          }
          throw new Error(errorData.detail || errorData.message || 'Données invalides');
        }
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      setSuccess('Administrateur créé avec succès !');

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: '',
        role: 'admin',
        is_active: true,
      });

      setTimeout(() => {
        router.push('/dashboards');
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création de l'utilisateur";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireRole allowedRoles={['superadmin']} redirectTo="/">
      <Box sx={{ bgcolor: BRAND.surface, minHeight: '100vh', pb: 6 }}>
        {/* Hero */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primary} 100%)`,
            color: BRAND.white,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3.5, md: 4.5 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              bgcolor: alpha(BRAND.white, 0.06),
            }}
          />
          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 720, mx: 'auto' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboards')}
              sx={{
                mb: 2,
                color: alpha(BRAND.white, 0.9),
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                px: 0,
                '&:hover': { bgcolor: alpha(BRAND.white, 0.08) },
              }}
            >
              Retour au tableau de bord
            </Button>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '14px',
                  bgcolor: alpha(BRAND.white, 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonAddIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Créer un administrateur
                </Typography>
                <Typography sx={{ fontSize: 14, opacity: 0.9, mt: 0.5 }}>
                  Ajoutez un nouveau compte admin à la plateforme Dame Sarr
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Formulaire */}
        <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3 }, mt: -2, position: 'relative', zIndex: 2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: `1px solid ${BRAND.border}`,
              bgcolor: BRAND.white,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: { xs: 2.5, sm: 3 },
                py: 2.5,
                bgcolor: BRAND.light,
                borderBottom: `1px solid ${BRAND.border}`,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AdminIcon sx={{ color: BRAND.primary }} />
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: BRAND.dark }}>
                    Informations du compte
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: BRAND.muted }}>
                    Les champs marqués * sont obligatoires
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px' }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mb: 2.5, borderRadius: '12px' }}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={loading}
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline sx={{ color: BRAND.muted, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      sx={fieldSx}
                      helperText="Optionnel — doit être unique"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: BRAND.muted, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: BRAND.muted, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Nom d'utilisateur *"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      sx={fieldSx}
                      helperText="Unique, minimum 3 caractères"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlined sx={{ color: BRAND.muted, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>Mot de passe *</InputLabel>
                      <OutlinedInput
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        label="Mot de passe *"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Afficher le mot de passe"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText>Minimum 8 caractères</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>Confirmer le mot de passe *</InputLabel>
                      <OutlinedInput
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        label="Confirmer le mot de passe *"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Afficher la confirmation"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: 'column-reverse', sm: 'row' }}
                  spacing={1.5}
                  sx={{ mt: 3.5 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/dashboards')}
                    disabled={loading}
                    size="large"
                    sx={{
                      flex: { sm: 1 },
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: BRAND.border,
                      color: BRAND.dark,
                      py: 1.25,
                      '&:hover': { borderColor: BRAND.primary, bgcolor: alpha(BRAND.primary, 0.04) },
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    sx={{
                      flex: { sm: 2 },
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.25,
                      bgcolor: BRAND.primary,
                      boxShadow: 'none',
                      '&:hover': { bgcolor: BRAND.dark, boxShadow: 'none' },
                    }}
                  >
                    {loading ? (
                      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                        <CircularProgress size={20} sx={{ color: BRAND.white }} />
                        <span>Création en cours…</span>
                      </Stack>
                    ) : (
                      "Créer l'administrateur"
                    )}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </RequireRole>
  );
}
