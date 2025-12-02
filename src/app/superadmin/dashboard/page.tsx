'use client';

import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import Link from 'next/link';
import { RequireRole } from '@/components/RequireRole';

export default function SuperAdminDashboardPage() {
  return (
    <RequireRole allowedRoles={["superadmin"]} redirectTo="/">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: 4 }} elevation={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            SuperAdmin — Tableau de bord
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Bienvenue dans le panneau SuperAdmin. Ici vous pouvez gérer les administrateurs, utilisateurs et paramètres globaux.
          </Typography>

          <Grid container spacing={2}>
            <Grid item>
              <Button component={Link} href="/superadmin/users" variant="contained">
                Gérer les utilisateurs
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} href="/superadmin/users/create" variant="outlined">
                Créer un admin
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} href="/superadmin/settings" variant="outlined">
                Paramètres
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </RequireRole>
  );
}
