import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const COLORS = {
  primary: '#185FA5',
  dark: '#042C53',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#16A34A',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  info: '#2563EB',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
};

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

// Création du thème de base
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          marginBottom: '1rem',
        },
      },
    },
    MuiAlert: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.875rem',
          alignItems: 'center',
          boxShadow: 'none',
          lineHeight: 1.5,
        },
        standardError: {
          bgcolor: COLORS.errorBg,
          color: COLORS.error,
          border: `1px solid ${COLORS.errorBorder}`,
          '& .MuiAlert-icon': { color: COLORS.error },
        },
        filledError: {
          bgcolor: COLORS.error,
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
        },
        outlinedError: {
          color: COLORS.error,
          border: `1.5px solid ${COLORS.error}`,
          bgcolor: COLORS.errorBg,
          '& .MuiAlert-icon': { color: COLORS.error },
        },
        standardSuccess: {
          bgcolor: COLORS.successBg,
          color: COLORS.success,
          border: `1px solid ${COLORS.successBorder}`,
          '& .MuiAlert-icon': { color: COLORS.success },
        },
        filledSuccess: {
          bgcolor: COLORS.success,
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
        },
        outlinedSuccess: {
          color: COLORS.success,
          border: `1.5px solid ${COLORS.success}`,
          bgcolor: COLORS.successBg,
          '& .MuiAlert-icon': { color: COLORS.success },
        },
        standardWarning: {
          bgcolor: COLORS.warningBg,
          color: COLORS.warning,
          border: `1px solid ${COLORS.warningBorder}`,
          '& .MuiAlert-icon': { color: COLORS.warning },
        },
        filledWarning: {
          bgcolor: COLORS.warning,
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
        },
        outlinedWarning: {
          color: COLORS.warning,
          border: `1.5px solid ${COLORS.warning}`,
          bgcolor: COLORS.warningBg,
          '& .MuiAlert-icon': { color: COLORS.warning },
        },
        standardInfo: {
          bgcolor: COLORS.infoBg,
          color: COLORS.info,
          border: `1px solid ${COLORS.infoBorder}`,
          '& .MuiAlert-icon': { color: COLORS.info },
        },
        filledInfo: {
          bgcolor: COLORS.info,
          color: '#fff',
          '& .MuiAlert-icon': { color: '#fff' },
        },
        outlinedInfo: {
          color: COLORS.info,
          border: `1.5px solid ${COLORS.info}`,
          bgcolor: COLORS.infoBg,
          '& .MuiAlert-icon': { color: COLORS.info },
        },
        message: {
          py: 0.5,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.78rem',
          marginTop: 4,
          lineHeight: 1.4,
        },
        contained: {
          marginLeft: 0,
        },
      },
    },
  },
});

// Ajout de la réactivité des polices
// theme = responsiveFontSizes(theme);

export default theme;
