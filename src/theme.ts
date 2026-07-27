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
    golden: {
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
    golden?: {
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

export const BRAND_BLUE = '#185FA5';

const theme = createTheme({
  spacing: 10,
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
      main: '#185FA5',
      light: '#2a7bc4',
      dark: '#0f3d6e',
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
      main: '#185FA5',
      light: '#2a7bc4',
      dark: '#0f3d6e',
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
      main: '#185FA5',
      light: '#2a7bc4',
      dark: '#0f3d6e',
      contrastText: '#ffffff',
    },
    golden: {
      main: '#C6A75E', // Premium golden
      light: '#D4B76E',
      dark: '#B8965E',
      contrastText: '#ffffff',
    },
  },
  shape: {
    borderRadius: 15,
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
          borderRadius: 10,
          fontWeight: 600,
          padding: '12.5px 30px',
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1.25px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        sizeLarge: {
          padding: '15px 40px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '7.5px 20px',
          fontSize: '0.875rem',
        },
        containedPrimary: {
          background: `linear-gradient(90deg, ${BRAND_BLUE} 0%, #2a7bc4 100%)`,
          '&:hover': {
            background: `linear-gradient(90deg, #0f3d6e 0%, ${BRAND_BLUE} 100%)`,
          },
        },
        outlined: {
          borderWidth: '2.5px',
          '&:hover': {
            borderWidth: '2.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 5px 25px 0 rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 31px 0 rgba(0, 0, 0, 0.1)',
          },
          overflow: 'visible',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12.5px)',
          WebkitBackdropFilter: 'blur(12.5px)',
          boxShadow: '0 2.5px 37.5px 0 rgba(0, 0, 0, 0.05)',
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
            borderRadius: 15,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2.5px',
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
            color: BRAND_BLUE,
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
            borderColor: BRAND_BLUE,
          },
        },
        input: {
          padding: '15px 20px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2.5px 0 25px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          padding: '0 7.5px',
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
      xl: 1800,
    },
  },
});

// Add global styles
theme.components = {
  ...theme.components,
  MuiCssBaseline: {
    styleOverrides: {
      '::-webkit-scrollbar': {
        width: '10px',
        height: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f5f9',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#cbd5e1',
        borderRadius: '5px',
        '&:hover': {
          background: '#94a3b8',
        },
      },
    },
  },
};

export default theme;
