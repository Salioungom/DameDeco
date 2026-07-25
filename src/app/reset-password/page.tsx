'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, LockReset } from '@mui/icons-material';
import NextLink from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const theme = useTheme();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Token de réinitialisation manquant');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
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
        <IconButton
          component={NextLink}
          href="/forgot-password"
          sx={{
            position: 'absolute',
            top: 24,
            left: 24,
            color: 'white',
            bgcolor: alpha('#fff', 0.1),
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: alpha('#fff', 0.2),
              transform: 'translateX(-4px)',
            },
            transition: 'all 0.3s',
            zIndex: 10,
          }}
        >
          <ArrowBack />
        </IconButton>
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 440,
                p: { xs: 3.5, sm: 5 },
                borderRadius: '16px',
                background: alpha('#fff', 0.97),
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(4, 44, 83, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              <Alert severity="error" variant="outlined" sx={{ mb: 3, animation: 'slideUp 0.35s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => router.push('/forgot-password')}
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
                }}
              >
                Demander un nouveau lien
              </Button>
            </Box>
          </Box>
        </Container>
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

      {/* Back Button */}
      <IconButton
        component={NextLink}
        href="/forgot-password"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: 'white',
          bgcolor: alpha('#fff', 0.1),
          backdropFilter: 'blur(10px)',
          '&:hover': {
            bgcolor: alpha('#fff', 0.2),
            transform: 'translateX(-4px)',
          },
          transition: 'all 0.3s',
          zIndex: 10,
        }}
      >
        <ArrowBack />
      </IconButton>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 440,
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
                <LockReset sx={{ fontSize: 26, color: '#fff' }} />
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
                Réinitialiser le mot de passe
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Entrez votre nouveau mot de passe sécurisé
              </Typography>
            </Box>

            {!success ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nouveau mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: '#888780',
                            '&:hover': {
                              color: '#185FA5',
                              bgcolor: 'rgba(24, 95, 165, 0.08)',
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
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
                        borderColor: '#185FA5',
                        boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                      '&.Mui-focused': {
                        color: '#185FA5',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
                              color: '#185FA5',
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
                        borderColor: '#185FA5',
                        boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                      '&.Mui-focused': {
                        color: '#185FA5',
                      },
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" variant="outlined" sx={{ mb: 3, animation: 'slideUp 0.35s ease-out', '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={!loading && <LockReset sx={{ fontSize: 18 }} />}
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
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </Button>
              </Box>
            ) : (
              <Box textAlign="center">
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: alpha('#22c55e', 0.1),
                    mb: 2.5,
                  }}
                >
                  <LockReset sx={{ fontSize: 32, color: '#22c55e' }} />
                </Box>
                <Alert
                  severity="success"
                  icon={false}
                  sx={{
                    mb: 3,
                    borderRadius: '10px',
                    animation: 'fadeIn 0.5s',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Mot de passe réinitialisé !
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </Typography>
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => router.push('/login')}
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
                  }}
                >
                  Se connecter
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
