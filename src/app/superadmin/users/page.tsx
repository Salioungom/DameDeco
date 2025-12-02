'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { RequireRole } from '@/components/RequireRole';

type User = { id: string; email: string; role: string; name?: string };

export default function SuperadminUsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Impossible de charger les utilisateurs');
        const data = await res.json();
        setUsers(data.users || data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <RequireRole allowedRoles={["superadmin"]} redirectTo="/">
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }} elevation={1}>
          <Typography variant="h5" gutterBottom>
            Utilisateurs
          </Typography>

          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {users && (
            <List>
              {users.map((u) => (
                <ListItem key={u.id} divider>
                  <ListItemText primary={u.name || u.email} secondary={`${u.email} — ${u.role}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </RequireRole>
  );
}
