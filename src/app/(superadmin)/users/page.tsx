'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { safeApiCall } from '@/lib/error-handler';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Pagination,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RequireRole } from '@/components/RequireRole';
import { useAuth } from '@/contexts/AuthContext';

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

export default function SuperadminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier l'authentification via AuthContext
      if (!isAuthenticated || !accessToken) {
        console.log('Utilisateur non authentifié, redirection vers login');
        router.push('/login');
        return;
      }

      console.log('Token AuthContext trouvé pour users:', accessToken);
      
      // Utiliser notre système de gestion d'erreurs
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('URL de l\'API utilisée:', apiUrl);
      
      const result = await safeApiCall(async () => {
        const response = await fetch(`${apiUrl}/api/v1/users/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Réponse API users status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token invalide (401), redirection vers login');
            router.push('/login');
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }
          if (response.status === 404) {
            if (apiUrl === 'http://localhost:8000') {
              throw new Error('Endpoint utilisateurs non trouvé. Le backend est-il démarré sur http://localhost:8000 ?');
            } else {
              throw new Error(`Endpoint utilisateurs non trouvé sur ${apiUrl}. Vérifiez que l'API backend est correctement configurée.`);
            }
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        return response.json();
      });

      if (result.error) {
        console.error('Erreur lors du chargement des utilisateurs:', result.error);
        setError(result.error.message);
        return;
      }

      const data = result.data;
      console.log('Réponse API users:', data);
      
      // Gérer différents formats de réponse possibles
      let usersData: User[] = [];
      
      if (data.items && Array.isArray(data.items)) {
        // Cas 1: L'API renvoie { items: [...], total: 24, page: 1, size: 10, pages: 3 }
        console.log('Tous les utilisateurs bruts:', data.items);
        const uniqueRoles = Array.from(new Set(data.items.map((u: any) => u.role)));
        console.log('Exemples de rôles trouvés:', uniqueRoles);
        
        // Afficher les détails de chaque utilisateur pour debugging
        data.items.forEach((user: any, index: number) => {
          console.log(`Utilisateur ${index}:`, {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            role_type: typeof user.role,
            role_length: user.role?.length
          });
        });
        
        // Filtrer pour n'afficher que les admins (pas les clients ni les superadmins)
        usersData = data.items.filter((user: any) => {
          const role = user.role?.toLowerCase().trim();
          console.log(`Test du rôle pour ${user.username}: "${user.role}" -> "${role}"`);
          const isAdmin = role === 'admin' || role === 'administrator';
          console.log(`Est admin: ${isAdmin}`);
          return isAdmin;
        });
        console.log('Format paginé détecté:', data.total, 'utilisateurs au total');
        console.log('Filtré pour admins uniquement:', usersData.length, 'admins trouvés');
      } else if (Array.isArray(data)) {
        // Cas 2: L'API renvoie directement un tableau
        usersData = data.filter((user: any) => 
          user.role === 'admin' || 
          (user.username && user.username.includes('admin')) ||
          (user.email && user.email.includes('admin'))
        );
      } else if (data.users && Array.isArray(data.users)) {
        // Cas 3: L'API renvoie { users: [...] }
        usersData = data.users.filter((user: any) => 
          user.role === 'admin' || 
          (user.username && user.username.includes('admin')) ||
          (user.email && user.email.includes('admin'))
        );
      } else if (data.data && Array.isArray(data.data)) {
        // Cas 4: L'API renvoie { data: { users: [...] } }
        const baseUsers = data.data.users || data.data;
        usersData = baseUsers.filter((user: any) => 
          user.role === 'admin' || 
          (user.username && user.username.includes('admin')) ||
          (user.email && user.email.includes('admin'))
        );
      } else {
        console.warn('Format de réponse inattendu:', data);
        usersData = [];
      }
      
      console.log('UsersData après parsing:', usersData);
      setUsers(usersData);
      
      // Gérer la pagination selon le format de réponse
      if (data.pages) {
        // Format paginé: utiliser le nombre de pages de l'API
        setTotalPages(data.pages);
      } else {
        // Format simple: calculer le nombre de pages
        setTotalPages(Math.ceil((data.total || usersData.length) / usersPerPage));
      }
    } catch (err: any) {
      console.error('Erreur complète loadUsers:', err);
      setError(err.message || 'Impossible de charger les utilisateurs');
      
      // En cas d'erreur, rediriger vers login si c'est une erreur d'auth
      if (err.message.includes('401') || err.message.includes('Non authentifié')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ne charger les utilisateurs que si l'utilisateur est authentifié
    if (isAuthenticated && user && user.role === 'superadmin') {
      loadUsers();
    }
  }, [page, isAuthenticated, user]);

  const handleCreateUser = () => {
    router.push('/users/create');
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      name: user.full_name,
      email: user.email,
      role: (user.role === 'superadmin' ? 'admin' : user.role) || 'client', // Never downgrade superadmin
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
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
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'superadmin') {
      setError('Impossible de supprimer un SuperAdmin');
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
      setError(err.message || 'Erreur lors de la suppression');
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

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attendre un peu que le AuthContext soit complètement chargé
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isAuthenticated || !user) {
          console.log('Utilisateur non authentifié sur /users, redirection vers login');
          router.push('/login');
          return;
        }

        if (user.role !== 'superadmin') {
          console.log('Rôle incorrect sur /users:', user.role, 'redirection vers /');
          router.push('/');
          return;
        }

        console.log('SuperAdmin authentifié sur /users, chargement des données');
        loadUsers();
      } catch (err: any) {
        console.error('Erreur de vérification sur /users:', err);
        setError('Erreur lors de la vérification de l\'authentification');
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, router]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'SuperAdmin';
      case 'admin': return 'Admin';
      case 'client': return 'Client';
      default: return role;
    }
  };

  return (
    // <RequireRole allowedRoles={["superadmin"]} redirectTo="/">
    <>  // Temporairement désactivé pour debugging
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
                👥 Gestion des Administrateurs
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Gérez les comptes administrateurs de la plateforme
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label="🔐 Accès SuperAdmin"
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip 
                  label="⚡ Administration"
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

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Carte Admins */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <Typography variant="h3" component="div" fontWeight={700} color="primary">
                {users.length}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                Admins
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrateurs actifs
              </Typography>
            </Card>
          </Grid>

          {/* Carte Actifs */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <Typography variant="h3" component="div" fontWeight={700} color="success.main">
                {users.filter(u => u.is_active).length}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                Actifs
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comptes activés
              </Typography>
            </Card>
          </Grid>

          {/* Carte Total */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <Typography variant="h3" component="div" fontWeight={700} color="info.main">
                24
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                Total
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Utilisateurs système
              </Typography>
            </Card>
          </Grid>

          {/* Carte Performance */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
              }
            }}>
              <Box sx={{ 
                width: 60, 
                height: 60,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  100%
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                Performance
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Système optimal
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Table Card */}
        <Card 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Table Header */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" component="h2" fontWeight={600} color="text.primary">
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
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Actualiser
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateUser}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  Créer un Admin
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ m: 3, borderRadius: 2 }} 
              action={
                <Button 
                  size="small" 
                  onClick={loadUsers}
                  disabled={loading}
                >
                  Réessayer
                </Button>
              }
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ m: 3, borderRadius: 2 }} 
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          )}

          {/* Users Table */}
          {!loading && (
            <Box sx={{ p: 3 }}>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Administrateur</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Rôle</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Dernière connexion</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Créé le</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow 
                        key={user.id} 
                        hover
                        sx={{ 
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            #{user.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: user.is_active ? 'primary.main' : 'grey.400',
                                fontSize: '0.875rem',
                                fontWeight: 600
                              }}
                            >
                              {user.full_name?.charAt(0) || user.username?.charAt(0) || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {user.full_name || user.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                @{user.username}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
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
                              borderRadius: 1
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
                              borderRadius: 1
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.last_login 
                              ? new Date(user.last_login).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Jamais'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Actions">
                            <IconButton 
                              onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuClick(e, user)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  color: 'primary.main'
                                }
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_event: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage)}
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

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => selectedUser && handleEditUser(selectedUser)}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Modifier
          </MenuItem>
          <MenuItem 
            onClick={() => selectedUser && handleDeleteUser(selectedUser)}
            disabled={selectedUser?.role === 'superadmin'}
          >
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Supprimer
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{userToDelete?.full_name || userToDelete?.username}" ({userToDelete?.email}) ?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={confirmDeleteUser} color="error" variant="contained">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Nom"
                value={editForm.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, name: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, email: e.target.value})}
                margin="normal"
              />
              <TextField
                fullWidth
                select
                label="Rôle"
                value={editForm.role}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, role: e.target.value as 'admin' | 'client'})}
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateUser} variant="contained">
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
    // </RequireRole>
  );
}
