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
    Link as MuiLink,
} from '@mui/material';
import NextLink from 'next/link';

export default function LoginPage() {
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
                router.push('/');
            }

            // Force a router refresh to update server components/middleware state if needed
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
                        Connexion
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

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Pas encore de compte ?{' '}
                                <MuiLink component={NextLink} href="/register">
                                    S'inscrire
                                </MuiLink>
                            </Typography>
                        </Box>

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
                            <Typography variant="caption" display="block">
                                Client: client@example.com / client123
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
