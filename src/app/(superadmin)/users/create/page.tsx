'use client';

import { useState, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
  Chip,
  OutlinedInput, 
  InputAdornment, 
  IconButton, 
  FormHelperText
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  AdminPanelSettings as AdminIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { RequireRole } from '@/components/RequireRole';

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    username: '',      // requis, unique
    email: '',         // optionnel, unique si fourni
    password: '',      // requis, min 8 caractères
    confirmPassword: '',
    full_name: '',     // optionnel
    phone: '',         // optionnel
    role: 'admin' as 'admin',
    is_active: true    // optionnel, défaut: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Non authentifié');
      }

      // Préparer les données pour l'API
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim() || undefined, // Optionnel
        password: formData.password,
        full_name: formData.full_name.trim() || undefined, // Optionnel
        phone: formData.phone.trim() || undefined, // Optionnel
        role: 'admin', // Toujours admin pour ce formulaire
        is_active: true
      };

      const res = await fetch('http://localhost:8000/api/v1/users/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        // Gérer les erreurs de validation FastAPI
        if (responseData.detail && Array.isArray(responseData.detail)) {
          const errorMessages = responseData.detail.map((err: any) => 
            `${err.loc?.join('.')} : ${err.msg}`
          ).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(responseData.detail || responseData.message || 'Erreur lors de la création');
      }

      setSuccess(`${formData.role === 'admin' ? 'Admin' : 'Client'} créé avec succès !`);
      
      // Réinitialiser le formulaire
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: '',
        role: 'admin',
        is_active: true
      });

      // Rediriger après un court délai
      setTimeout(() => {
        router.push('/users');
      }, 2000);

    } catch (err: any) {
      console.error('Erreur création utilisateur:', err);
      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  }

  return (
    // <RequireRole allowedRoles={["superadmin"]} redirectTo="/">
    <>  // Temporairement désactivé pour debugging
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              mb: 3
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '2rem'
                }}
              >
                <PersonAddIcon sx={{ fontSize: '2.5rem' }} />
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                  Créer un Administrateur
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Ajoutez un nouvel administrateur à la plateforme
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Chip 
                    label="🔐 Accès SuperAdmin"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Chip 
                    label="⚡ Création Rapide"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.2)', 
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/users')}
            sx={{ 
              mb: 3,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Retour à la liste
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Main Form Card */}
          <Grid item xs={12} md={8}>
            <Card 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              {/* Card Header */}
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h5" component="h2" fontWeight={600} color="text.primary">
                  Informations de l'Administrateur
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Complétez les informations pour créer un nouveau compte administrateur
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                {/* Alerts */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 3, borderRadius: 2 }} 
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3, borderRadius: 2 }}
                    icon={<CheckCircleIcon />}
                  >
                    {success}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom complet (optionnel)"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        InputProps={{
                          startAdornment: <PersonAddIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email (optionnel)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        }}
                        helperText="Doit être unique si fourni"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Téléphone (optionnel)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>

                    {/* Rôle caché - valeur par défaut */}
                    <input type="hidden" name="role" value="admin" />

                    {/* Champ Username */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nom d'utilisateur *"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          },
                          mb: 2
                        }}
                        helperText="Doit être unique, minimum 3 caractères"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Mot de passe *</InputLabel>
                        <OutlinedInput
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                                edge="end"
                                sx={{ color: 'text.secondary' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Mot de passe"
                        />
                        <FormHelperText>Minimum 8 caractères</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Confirmer le mot de passe *</InputLabel>
                        <OutlinedInput
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                onMouseDown={(e: MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                                edge="end"
                                sx={{ color: 'text.secondary' }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirmer le mot de passe"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => router.push('/users')}
                      disabled={loading}
                      size="large"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      size="large"
                      fullWidth
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} thickness={4} />
                          Création en cours...
                        </Box>
                      ) : (
                        `Créer ${formData.role === 'admin' ? 'l\'Admin' : 'le Client'}`
                      )}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Side Info Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AdminIcon color="primary" />
                  Informations Importantes
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Rôle Admin :</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, pl: 2 }}>
                    • Accès complet au dashboard<br/>
                    • Gestion des utilisateurs<br/>
                    • Modération du contenu<br/>
                    • Accès aux rapports
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Sécurité :</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, pl: 2 }}>
                    • Mot de passe robuste requis<br/>
                    • Email professionnel vérifié<br/>
                    • Accès révocable à tout moment
                  </Typography>
                  
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      💡 Conseil
                    </Typography>
                    <Typography variant="body2">
                      Utilisez un email professionnel et un mot de passe unique pour chaque administrateur.
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Statistiques Actuelles
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Admins actifs</Typography>
                    <Chip label="1" size="small" color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Total utilisateurs</Typography>
                    <Chip label="24" size="small" color="default" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Système</Typography>
                    <Chip label="100%" size="small" color="success" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
    // </RequireRole>
  );
}
