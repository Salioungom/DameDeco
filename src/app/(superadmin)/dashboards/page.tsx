'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Button, Grid, Paper, CircularProgress, Card, CardContent, Avatar, Chip, Stack, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Pagination, Tooltip, Alert, FormControlLabel, Switch } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreVertIcon, Refresh as RefreshIcon, People as PeopleIcon, Security as SecurityIcon, Analytics as AnalyticsIcon, Speed as SpeedIcon, Settings as SettingsIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon, Dashboard as DashboardIcon, ManageAccounts as ManageAccountsIcon } from '@mui/icons-material';
import { safeApiCall } from '@/lib/error-handler';

type User = {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role?: 'admin' | 'client' | 'superadmin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
};

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated, logout, accessToken } = useAuth();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Form states for editing
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'client',
    is_active: true,
  });

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      if (!isAuthenticated || !accessToken) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const result = await safeApiCall(async () => {
        const response = await fetch(`${apiUrl}/api/v1/users/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }
          if (response.status === 404) {
            throw new Error('Endpoint utilisateurs non trouvé. Le backend est-il démarré ?');
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return response.json();
      });

      if (result.error) {
        setUsersError(result.error.message);
        return;
      }

      const data = result.data;
      let usersData: User[] = [];
      
      if (data.items && Array.isArray(data.items)) {
        usersData = data.items.filter((user: any) => {
          const role = user.role?.toLowerCase().trim();
          return role === 'admin' || role === 'administrator';
        });
      } else if (Array.isArray(data)) {
        usersData = data.filter((user: any) => 
          user.role === 'admin' || 
          (user.username && user.username.includes('admin')) ||
          (user.email && user.email.includes('admin'))
        );
      }
      
      setUsers(usersData);
      setTotalPages(data.pages || Math.ceil((data.total || usersData.length) / usersPerPage));
    } catch (err: any) {
      setUsersError(err.message || 'Impossible de charger les utilisateurs');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      name: user.full_name,
      email: user.email,
      role: (user.role === 'superadmin' ? 'admin' : user.role) || 'client',
      is_active: user.is_active,
    });
    setEditDialogOpen(true);
    handleCloseMenu();
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;

    try {
      if (!isAuthenticated || !accessToken) {
        throw new Error('Non authentifié');
      }

      const updateData = {
        full_name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        is_active: editForm.is_active,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Erreur ${res.status}`);
      }

      setSuccess('Utilisateur mis à jour avec succès');
      setEditDialogOpen(false);
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setUsersError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'superadmin') {
      setUsersError('Impossible de supprimer un SuperAdmin');
      return;
    }
    setUserToDelete(user);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      if (!isAuthenticated || !accessToken) {
        throw new Error('Non authentifié');
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      setSuccess('Utilisateur supprimé avec succès');
      setDeleteDialogOpen(false);
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setUsersError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'error';
      case 'admin': return 'primary';
      case 'client': return 'default';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'SuperAdmin';
      case 'admin': return 'Admin';
      case 'client': return 'Client';
      default: return role;
    }
  };

  // Load users when switching to users tab
  useEffect(() => {
    if (tabValue === 1 && isAuthenticated && user?.role === 'superadmin') {
      loadUsers();
    }
  }, [tabValue, isAuthenticated, user]);

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
    <Box sx={{ mt: 4, mb: 6, px: { xs: 2, sm: 3 }, width: '100%' }}>
      {/* Header Welcome */}
      <Paper 
        sx={{ 
          p: { xs: 3, sm: 4, md: 5 }, 
          mb: 4,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }} 
        elevation={0}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} />
            <Typography variant="h3" component="h1" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' } }}>
              Tableau de Bord SuperAdmin
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.95, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
            Bienvenue, <strong>{user?.full_name || 'SuperAdmin'}</strong>
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip 
              icon={<SecurityIcon sx={{ fontSize: 18 }} />}
              label="Authentification Active"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                color: 'white',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Chip 
              icon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
              label="Rôle SuperAdmin"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                color: 'white',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Chip 
              icon={<SpeedIcon sx={{ fontSize: 18 }} />}
              label="Système Opérationnel"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.15)', 
                color: 'white',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-label': { px: 1 }
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(_e: React.SyntheticEvent, newValue: number) => setTabValue(newValue)}
          sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 56,
              px: 3,
            },
            '& .Mui-selected': {
              color: 'primary.main',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              borderRadius: 2,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            }
          }}
        >
          <Tab icon={<DashboardIcon sx={{ mr: 1 }} />} label="Vue d'ensemble" />
          <Tab icon={<ManageAccountsIcon sx={{ mr: 1 }} />} label="Gestion des Administrateurs" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ width: '100%' }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              borderColor: 'primary.main'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                Utilisateurs
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total administrateurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              borderColor: 'success.main'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%',
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}>
                <SecurityIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                Sécurité
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                OK
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Système sécurisé
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              borderColor: 'warning.main'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%',
                bgcolor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
              }}>
                <AnalyticsIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                Analytics
              </Typography>
              <Typography variant="h4" color="warning.main" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                --
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Statistiques
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              borderColor: 'info.main'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%',
                bgcolor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
              }}>
                <SpeedIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
                Performance
              </Typography>
              <Typography variant="h4" color="info.main" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
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
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <DashboardIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                Actions Rapides
              </Typography>
              
              <Stack spacing={2}>
                <Button 
                  onClick={() => setTabValue(1)}
                  variant="contained" 
                  size="large"
                  startIcon={<ManageAccountsIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Gérer les Administrateurs
                </Button>
                
                <Button 
                  component={Link} 
                  href="/settings" 
                  variant="outlined" 
                  size="large"
                  startIcon={<SettingsIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Paramètres Système
                </Button>
                
                <Button 
                  component={Link} 
                  href="/admin/security/summary" 
                  variant="outlined" 
                  size="large"
                  startIcon={<SecurityIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: 'success.main',
                      bgcolor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Sécurité & Monitoring
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2.5,
            border: '1px solid rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  bgcolor: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                Informations Système
              </Typography>
              
              <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.02)', 
                p: 2.5, 
                borderRadius: 2, 
                fontFamily: 'monospace', 
                fontSize: '0.875rem',
                border: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Utilisateur:</strong></Box>
                  <Box>{user?.full_name || 'SuperAdmin'}</Box>
                </Box>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Email:</strong></Box>
                  <Box sx={{ textAlign: 'right', maxWidth: '60%' }}>{user?.email}</Box>
                </Box>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Rôle:</strong></Box>
                  <Box sx={{ textTransform: 'capitalize' }}>{user?.role}</Box>
                </Box>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>ID:</strong></Box>
                  <Box>#{user?.id}</Box>
                </Box>
                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Token:</strong></Box>
                  <Box sx={{ color: (localStorage.getItem('token') || localStorage.getItem('accessToken')) ? 'success.main' : 'error.main' }}>
                    {(localStorage.getItem('token') || localStorage.getItem('accessToken')) ? '✓ Valide' : '✗ Absent'}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box><strong>Backend:</strong></Box>
                  <Box sx={{ color: 'success.main' }}>Connecté</Box>
                </Box>
              </Box>
              
              <Button 
                onClick={async () => {
                  await logout();
                }}
                variant="outlined" 
                color="error"
                size="large"
                startIcon={<LogoutIcon />}
                sx={{ 
                  mt: 3, 
                  width: '100%',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    borderColor: 'error.main',
                    bgcolor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Déconnexion
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Card sx={{ 
          borderRadius: 2.5, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)'
        }}>
          <Box sx={{ 
            p: { xs: 2.5, sm: 3 }, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
            borderBottom: '1px solid rgba(0,0,0,0.06)' 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" component="h2" fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  Liste des Administrateurs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {users.length} administrateur(s) trouvé(s)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />} 
                  onClick={loadUsers} 
                  disabled={usersLoading} 
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    borderColor: 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  Actualiser
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => router.push('/users/create')} 
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Créer un Admin
                </Button>
              </Box>
            </Box>
          </Box>

          {usersError && <Alert severity="error" sx={{ m: 3, borderRadius: 2 }} onClose={() => setUsersError(null)}>{usersError}</Alert>}
          {success && <Alert severity="success" sx={{ m: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

          {usersLoading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress size={60} thickness={4} /></Box>}

          {!usersLoading && (
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <TableContainer sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      '& th': {
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Administrateur</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Rôle</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user.id} 
                        hover 
                        sx={{ 
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="text.primary">
                            #{user.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: user.is_active ? 'primary.main' : 'grey.400', 
                              fontSize: '0.875rem', 
                              fontWeight: 600,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                              {user.full_name?.charAt(0) || user.username?.charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600} color="text.primary">{user.full_name || user.username}</Typography>
                              <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }} color="text.secondary">
                            {user.email || 'Non renseigné'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getRoleLabel(user.role || 'client')} 
                            color={getRoleColor(user.role || 'client') as any} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600, 
                              borderRadius: 1.5,
                              fontSize: '0.75rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.is_active ? 'Actif' : 'Inactif'} 
                            color={user.is_active ? 'success' : 'default'} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600, 
                              borderRadius: 1.5,
                              fontSize: '0.75rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Actions">
                            <IconButton 
                              onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuClick(e, user)} 
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)', 
                                  color: 'primary.main' 
                                },
                                borderRadius: 1.5
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage)} 
                    color="primary" 
                    size="large" 
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Card>
      )}

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.06)',
            minWidth: 180
          }
        }}
      >
        <MenuItem 
          onClick={() => selectedUser && handleEditUser(selectedUser)}
          sx={{ 
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.08)'
            }
          }}
        >
          <EditIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight={500}>Modifier</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleDeleteUser(selectedUser)} 
          disabled={selectedUser?.role === 'superadmin'}
          sx={{ 
            borderRadius: 1,
            mx: 1,
            my: 0.5,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.08)'
            },
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          <DeleteIcon sx={{ mr: 1.5, fontSize: 18 }} />
          <Typography variant="body2" fontWeight={500}>Supprimer</Typography>
        </MenuItem>
      </Menu>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            maxWidth: 500
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer l'administrateur <strong>"{userToDelete?.full_name || userToDelete?.username}"</strong> ({userToDelete?.email}) ?
          </Typography>
          <Box sx={{ 
            bgcolor: 'rgba(211, 47, 47, 0.05)',
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(211, 47, 47, 0.2)'
          }}>
            <Typography variant="body2" color="error.main" fontWeight={500}>
              ⚠️ Cette action est irréversible.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmDeleteUser} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Modifier l'administrateur
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label="Nom complet" 
              value={editForm.name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, name: e.target.value})} 
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={editForm.email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, email: e.target.value})} 
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={editForm.is_active} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, is_active: e.target.checked})}
                    sx={{ mr: 1 }}
                  />
                } 
                label={<Typography variant="body2" fontWeight={500}>Compte actif</Typography>}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateUser} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
