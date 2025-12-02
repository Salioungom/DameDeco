'use client';
import { createTheme, alpha } from '@mui/material/styles';
import { Inter, Poppins } from 'next/font/google';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      light: string;
      main: string;
      dark: string;
      contrastText: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      light?: string;
      main: string;
      dark?: string;
      contrastText?: string;
    };
  }
}

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const theme = createTheme({
  typography: {
    fontFamily: [inter.style.fontFamily, poppins.style.fontFamily, 'sans-serif'].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      fontFamily: poppins.style.fontFamily,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: poppins.style.fontFamily,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      fontFamily: poppins.style.fontFamily,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      fontFamily: poppins.style.fontFamily,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      fontFamily: poppins.style.fontFamily,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      fontFamily: poppins.style.fontFamily,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Blue 600
      light: '#3b82f6', // Blue 500
      dark: '#1d4ed8', // Blue 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Violet 600
      light: '#8b5cf6', // Violet 500
      dark: '#6d28d9', // Violet 700
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald 500
      light: '#34d399', // Emerald 400
      dark: '#059669', // Emerald 600
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Red 500
      light: '#f87171', // Red 400
      dark: '#dc2626', // Red 600
    },
    warning: {
      main: '#f59e0b', // Amber 500
      light: '#fbbf24', // Amber 400
      dark: '#d97706', // Amber 600
    },
    info: {
      main: '#3b82f6', // Blue 500
      light: '#60a5fa', // Blue 400
      dark: '#2563eb', // Blue 600
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#475569', // Slate 600
      disabled: '#94a3b8', // Slate 400
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    divider: '#e2e8f0', // Slate 200
    custom: {
      main: '#2563eb', // Same as primary
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          scrollBehavior: 'smooth',
        },
        a: {
          textDecoration: 'none',
          color: 'inherit',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.1)',
          },
          overflow: 'visible',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#64748b',
          '&.Mui-focused': {
            color: '#2563eb',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
          },
        },
        input: {
          padding: '12px 16px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          padding: '0 6px',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Add global styles
theme.components = {
  ...theme.components,
  MuiCssBaseline: {
    styleOverrides: {
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f5f9',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#cbd5e1',
        borderRadius: '4px',
        '&:hover': {
          background: '#94a3b8',
        },
      },
    },
  },
};

export default theme;
