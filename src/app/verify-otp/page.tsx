'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  IconButton,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { Refresh as RefreshIcon, ArrowBack, VerifiedUser } from '@mui/icons-material';
import NextLink from 'next/link';
import { OTPInput } from '@/components/auth/OTPInput';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'totp' | 'email'>('totp');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Veuillez entrer les 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,  // Format FastAPI: "email" au lieu de "email: method === 'email'"
          code: otp,    // Format FastAPI: "code" au lieu de "otp"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Réponse OTP complète:', data);
        console.log('Clés OTP disponibles:', Object.keys(data));
        setSuccess(true);
        
        // FastAPI retourne les données utilisateur et tokens
        if (data.user) {
          localStorage.setItem('user_fullname', data.user.name || data.user.fullname);
          localStorage.setItem('user_email', data.user.email);
        }
        
        // Stocker les tokens JWT si présents
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token OTP stocké:', data.token);
        }
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          console.log('Access token OTP stocké:', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
          console.log('Refresh token OTP stocké:', data.refresh_token);
        }
        
        // Redirection selon le rôle de l'utilisateur
        setTimeout(() => {
          if (data.user?.role === 'superadmin') {
            router.push('/dashboards');  // ✅ Dashboard SuperAdmin dans /(superadmin)/dashboards
          } else if (data.user?.role === 'admin') {
            router.push('/dashboard');     // ✅ Dashboard Admin dans /(admin)/dashboard
          } else if (data.user?.role === 'client') {
            router.push('/dashboard');     // ✅ Dashboard client
          } else {
            router.push('/');
          }
        }, 2000);
      } else {
        // Gérer les erreurs FastAPI (422 validation, etc.)
        if (data.detail && Array.isArray(data.detail)) {
          // Erreur de validation FastAPI
          const errorMessages = data.detail.map((err: any) => err.msg).join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || data.detail || 'Code OTP invalide');
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,  // Format FastAPI: seulement "email"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSuccessMessage('Code renvoyé avec succès');
      } else {
        // Gérer les erreurs FastAPI (422 validation, etc.)
        if (data.detail && Array.isArray(data.detail)) {
          // Erreur de validation FastAPI
          const errorMessages = data.detail.map((err: any) => err.msg).join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || data.detail || 'Erreur lors du renvoi du code');
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setResending(false);
      // Effacer le message de succès après 3 secondes
      if (successMessage) {
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  if (success) {
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
            right: '-10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
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
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        {/* Back to Home Button */}
        <IconButton
          component={NextLink}
          href="/"
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
                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                  Vérification réussie
                </Typography>
              </Box>
              
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  animation: 'slideUp 0.6s ease-out',
                }}
              >
                Vérification réussie ! Redirection en cours...
              </Alert>
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
          right: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)}, transparent)`,
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
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.3)}, transparent)`,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      {/* Back to Home Button */}
      <IconButton
        component={NextLink}
        href="/"
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
            {/* Logo/Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
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
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                Vérification en deux étapes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Entrez le code à 6 chiffres pour vérifier votre identité
              </Typography>
              {email && (
                <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
                  Code envoyé à: {email}
                </Typography>
              )}
            </Box>

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

            {successMessage && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {successMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {/* Method Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                  Méthode de vérification:
                </Typography>
                <ToggleButtonGroup
                  value={method}
                  exclusive
                  onChange={(_: React.MouseEvent<HTMLElement>, newMethod: "totp" | "email" | null) => newMethod && setMethod(newMethod)}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      borderRadius: 2,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: 'white',
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ToggleButton value="totp">
                    Application
                  </ToggleButton>
                  <ToggleButton value="email">
                    Email
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  disabled={loading}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || otp.length !== 6}
                startIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
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
                  '&.Mui-disabled': {
                    background: theme.palette.action.disabledBackground,
                  },
                }}
              >
                {loading ? 'Vérification en cours...' : 'Vérifier'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Button
              variant="text"
              fullWidth
              onClick={handleResend}
              disabled={resending}
              startIcon={resending ? <CircularProgress size={16} /> : <RefreshIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                color: theme.palette.primary.main,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {resending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
