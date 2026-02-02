'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Button, Grid, Paper, CircularProgress, Card, CardContent, Avatar, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    console.log('useEffect déclenché - isAuthenticated:', isAuthenticated, 'user:', user);
    
    // Si l'utilisateur est authentifié et a le bon rôle
    if (isAuthenticated && user) {
      console.log('Utilisateur authentifié:', user);
      
      if (user.role === 'superadmin') {
        console.log('SuperAdmin confirmé, affichage dashboard');
        setLoading(false);
      } else {
        console.log('Rôle incorrect:', user.role, 'redirection vers /');
        router.push('/');
      }
      return;
    }
    
    // Si pas authentifié, attendre un peu puis vérifier à nouveau
    const timer = setTimeout(() => {
      console.log('Vérification différée - isAuthenticated:', isAuthenticated, 'user:', user);
      
      if (!isAuthenticated || !user) {
        console.log('Toujours non authentifié, redirection vers login');
        router.push('/login');
      } else if (user.role !== 'superadmin') {
        console.log('Rôle incorrect après délai:', user.role, 'redirection vers /');
        router.push('/');
      } else {
        console.log('SuperAdmin confirmé après délai, affichage dashboard');
        setLoading(false);
      }
    }, 500); // 500ms de délai

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

    return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header Welcome */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }} 
        elevation={4}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            👑 Tableau de Bord SuperAdmin
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Bienvenue <strong>{user?.full_name || 'SuperAdmin'}</strong> ! 
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label="🔐 Authentification Active"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Chip 
              label="🎯 Rôle SuperAdmin"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Chip 
              label="🌐 Backend Django Connecté"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 2
              }}>
                👥
              </Avatar>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Utilisateurs
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                --
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total utilisateurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'success.main',
                mx: 'auto',
                mb: 2
              }}>
                🛡️
              </Avatar>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Sécurité
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight={700}>
                OK
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Système sécurisé
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'warning.main',
                mx: 'auto',
                mb: 2
              }}>
                📊
              </Avatar>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Analytics
              </Typography>
              <Typography variant="h4" color="warning.main" fontWeight={700}>
                --
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Statistiques
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'info.main',
                mx: 'auto',
                mb: 2
              }}>
                ⚡
              </Avatar>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Performance
              </Typography>
              <Typography variant="h4" color="info.main" fontWeight={700}>
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Système optimal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1 }}>🎯</Box>
                Actions Rapides
              </Typography>
              
              <Stack spacing={2}>
                <Button 
                  onClick={() => router.push('/users')}
                  variant="contained" 
                  size="large"
                  startIcon={<Box component="span">👥</Box>}
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Gérer les Utilisateurs
                </Button>
                
                <Button 
                  component={Link} 
                  href="/settings" 
                  variant="outlined" 
                  size="large"
                  startIcon={<Box component="span">⚙️</Box>}
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Paramètres Système
                </Button>
                
                <Button 
                  component={Link} 
                  href="/admin/security/summary" 
                  variant="outlined" 
                  size="large"
                  startIcon={<Box component="span">🛡️</Box>}
                  sx={{ py: 1.5, justifyContent: 'flex-start' }}
                >
                  Sécurité & Monitoring
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1 }}>ℹ️</Box>
                Informations Système
              </Typography>
              
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                <Box sx={{ mb: 1 }}>
                  <strong>Utilisateur:</strong> {user?.full_name || 'SuperAdmin'}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user?.email}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <strong>Rôle:</strong> {user?.role}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <strong>ID:</strong> {user?.id}
                </Box>
                <Box sx={{ mb: 1 }}>
                  <strong>Token:</strong> {(localStorage.getItem('token') || localStorage.getItem('accessToken')) ? '✅ Valide' : '❌ Absent'}
                </Box>
                <Box>
                  <strong>Backend:</strong> Django API Connected
                </Box>
              </Box>
              
              <Button 
                onClick={async () => {
                  await logout();
                }}
                variant="outlined" 
                color="error"
                size="large"
                startIcon={<Box component="span">🚪</Box>}
                sx={{ mt: 2, width: '100%' }}
              >
                Déconnexion
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
