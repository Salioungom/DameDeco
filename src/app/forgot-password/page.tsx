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
        background: `linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)`,
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
          background: `radial-gradient(circle, ${alpha('#E6F1FB', 0.2)}, transparent)`,
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
          background: `radial-gradient(circle, ${alpha('#85B7EB', 0.25)}, transparent)`,
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
              maxWidth: 460,
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                <Email sx={{ fontSize: 26, color: '#fff' }} />
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
                Mot de passe oublié
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                  startIcon={!loading && <MarkEmailRead sx={{ fontSize: 18 }} />}
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
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
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
                    py: 1.625,
                    borderRadius: '10px',
                    borderWidth: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: '#185FA5',
                    color: '#185FA5',
                    fontSize: '0.95rem',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderWidth: 1.5,
                      borderColor: '#0C447C',
                      bgcolor: 'rgba(24, 95, 165, 0.06)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(24, 95, 165, 0.2)',
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
