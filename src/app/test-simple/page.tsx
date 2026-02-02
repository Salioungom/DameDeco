'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';

export default function TestSimplePage() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si on est authentifié
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Simple vérification
    console.log('Token trouvé:', token);
    console.log('Page test-simple atteinte sans boucle !');
  }, [router]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎉 PAGE TEST SIMPLE - PLUS DE BOUCLE !
      </Typography>
      
      <Typography variant="body1" paragraph>
        Si vous voyez cette page, la connexion a fonctionné et il n'y a plus de boucle de redirection !
      </Typography>

      <Typography variant="body2" color="success.main">
        ✅ Login réussi<br/>
        ✅ Token stocké<br/>
        ✅ Redirection fonctionnelle<br/>
        ✅ Middleware désactivé
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Actions possibles :</Typography>
        <ul>
          <li>Aller au dashboard admin</li>
          <li>Tester les appels API</li>
          <li>Vérifier les tokens</li>
        </ul>
      </Box>
    </Container>
  );
}
