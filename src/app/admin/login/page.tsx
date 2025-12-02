'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    TextField,
    Button,
    Alert,
    Typography,
    Paper,
    Container,
} from '@mui/material';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json?.error || 'Échec de la connexion');
            }

            const { user } = await res.json();

            // Verify auth was set by fetching /api/auth/me
            const meRes = await fetch('/api/auth/me', { credentials: 'include' });
            if (!meRes.ok) {
                throw new Error('Impossible de vérifier l´authentification');
            }

            const meData = await meRes.json();
            const authenticatedUser = meData.user;

            // Redirect based on role
            if (authenticatedUser?.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else if (authenticatedUser?.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                // Client trying to access admin login
                setError('Accès non autorisé. Veuillez utiliser la page de connexion client.');
                return;
            }

            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Connexion Admin
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Comptes de démo :
                            </Typography>
                            <Typography variant="caption" display="block">
                                SuperAdmin: superadmin@example.com / super123
                            </Typography>
                            <Typography variant="caption" display="block">
                                Admin: admin@example.com / admin123
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
