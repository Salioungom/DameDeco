'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/auth';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  CheckCircle,
  MarkEmailRead,
} from '@mui/icons-material';
import NextLink from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue lors de l\'envoi de l\'email.');
      console.error(err);
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
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.dark} 0%, 
          ${theme.palette.primary.main} 50%, 
          ${theme.palette.secondary.main} 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '45%',
          height: '45%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
          animation: 'float 7s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(20px) translateX(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '55%',
          height: '55%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
          animation: 'float 9s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      />

      {/* Back to Login Button */}
      <IconButton
        component={NextLink}
        href="/login"
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

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 500,
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: alpha('#fff', 0.95),
              backdropFilter: 'blur(20px)',
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`,
              border: `1px solid ${alpha('#fff', 0.3)}`,
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mb: 2,
                }}
              >
                <Email sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Dame Sarr
              </Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={600}>
                Mot de passe oublié
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
              </Typography>
            </Box>

            {!success ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                      '&.Mui-focused': {
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                      },
                    },
                  }}
                />

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      animation: 'shake 0.5s',
                      '@keyframes shake': {
                        '0%, 100%': { transform: 'translateX(0)' },
                        '25%': { transform: 'translateX(-10px)' },
                        '75%': { transform: 'translateX(10px)' },
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MarkEmailRead />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </Button>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography
                    component={NextLink}
                    href="/login"
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <ArrowBack sx={{ mr: 1, fontSize: 16 }} />
                    Retour à la connexion
                  </Typography>
                </Box>
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
                    background: alpha(theme.palette.success.main, 0.1),
                    mb: 2,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 32, color: theme.palette.success.main }} />
                </Box>
                <Alert
                  severity="success"
                  icon={false}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    animation: 'fadeIn 0.5s',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Email envoyé avec succès !
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                  </Typography>
                </Alert>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="/login"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    borderWidth: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: theme.palette.primary.dark,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Retour à la connexion
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
