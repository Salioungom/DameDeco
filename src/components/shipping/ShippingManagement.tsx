'use client';

import { Box, Paper, Typography } from '@mui/material';
import { LocalShippingOutlined } from '@mui/icons-material';
import ShippingSettingsForm from './ShippingSettingsForm';

const BRAND = {
  primary: '#185FA5',
  dark: '#042C53',
  light: '#E6F1FB',
  border: '#D4E8F7',
  muted: '#5F6B7A',
} as const;

export default function ShippingManagement() {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          p: { xs: 2, sm: 2.5 },
          borderRadius: '16px',
          border: `1px solid ${BRAND.border}`,
          bgcolor: BRAND.light,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: 'rgba(24, 95, 165, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: BRAND.primary,
          }}
        >
          <LocalShippingOutlined />
        </Box>
        <Box>
          <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color: BRAND.dark }}>
            Frais de livraison
          </Typography>
          <Typography sx={{ fontSize: 14, color: BRAND.muted }}>
            Configurez le seuil de livraison gratuite et les tarifs standard
          </Typography>
        </Box>
      </Paper>
      <ShippingSettingsForm />
    </Box>
  );
}
