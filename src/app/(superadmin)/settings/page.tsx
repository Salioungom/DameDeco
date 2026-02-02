'use client';

import { Container, Paper, Typography, Box } from '@mui/material';
import { RequireRole } from '@/components/RequireRole';

export default function SuperadminSettingsPage() {
  return (
    <RequireRole allowedRoles={["superadmin"]} redirectTo="/">
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }} elevation={1}>
          <Typography variant="h5" gutterBottom>
            Paramètres SuperAdmin
          </Typography>

          <Box>
            <Typography variant="body2">Ici vous pouvez gérer les paramètres globaux (placeholder).</Typography>
          </Box>
        </Paper>
      </Container>
    </RequireRole>
  );
}
