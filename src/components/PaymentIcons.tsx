import { Box, Tooltip, Typography } from '@mui/material';

interface PaymentIconsProps {
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function PaymentIcons({ size = 'md', showLabels = false }: PaymentIconsProps) {
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
  const containerSize = size === 'sm' ? 56 : size === 'md' ? 72 : 96;

  const paymentMethods = [
    {
      name: 'Wave',
      logo: '/payment/wave.png',
      color: '#00D4AA',
      textColor: 'primary.main',
    },
    {
      name: 'Orange Money',
      logo: '/payment/om.jpg',
      color: '#FF7900',
      textColor: 'warning.main',
    },
    {
      name: 'PayPal',
      logo: '/payment/paypal.png',
      color: '#003087',
      textColor: 'primary.dark',
    },
    {
      name: 'Cash on Delivery',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMlpNMTIgMjBDNy41OSAyMCA0IDE2LjQxIDQgMTJTNy41OSA0IDEyIDRTMjAgNy41OSAyMCAxMlMxNi40MSAyMCAxMiAyMFoiIGZpbGw9IiMxNmEzNGEiLz4KPHBhdGggZD0iTTEyIDdWMTJMMTUuNSAxNS41TTEyIDEyTDguNSA4LjUiIHN0cm9rZT0iIzE2YTM0YSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
      color: '#16a34a',
      textColor: 'success.main',
    },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      {paymentMethods.map((method) => (
        <Tooltip title={method.name} key={method.name}>
          <Box
            sx={{
              width: containerSize,
              height: containerSize,
              bgcolor: 'white',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1.5,
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              '& img': {
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                imageRendering: 'auto',
              },
            }}
          >
            <img
              src={method.logo}
              alt={method.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                imageRendering: 'auto',
              }}
            />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}
