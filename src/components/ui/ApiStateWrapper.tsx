import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  AlertTitle, 
  Button,
  Paper,
  Chip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
  WifiOff as WifiOffIcon,
  AccessTime as TimeoutIcon
} from '@mui/icons-material';
import { ApiError } from '@/lib/error-handler';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  height?: number | string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  message = 'Chargement...', 
  height = 200 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      gap={2}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

interface ErrorDisplayProps {
  error: ApiError | string | null;
  onRetry?: () => void;
  title?: string;
  showIcon?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  title = 'Erreur',
  showIcon = true,
  variant = 'default'
}) => {
  if (!error) return null;

  const getErrorIcon = (error: ApiError | string) => {
    if (typeof error === 'string') return <ErrorIcon />;
    
    if (error.isNetworkError) return <WifiOffIcon />;
    if (error.isTimeout) return <TimeoutIcon />;
    if (error.isServerError) return <ErrorIcon />;
    return <ErrorIcon />;
  };

  const getErrorSeverity = (error: ApiError | string) => {
    if (typeof error === 'string') return 'error';
    
    if (error.isNetworkError || error.isTimeout) return 'warning';
    if (error.isServerError) return 'error';
    if (error.isClientError) return 'error';
    return 'error';
  };

  const getErrorMessage = (error: ApiError | string) => {
    if (typeof error === 'string') return error;
    return error.message;
  };

  const getErrorDetails = (error: ApiError | string) => {
    if (typeof error === 'string') return null;
    
    const details = [];
    if (error.status) details.push(`Status: ${error.status}`);
    if (error.code) details.push(`Code: ${error.code}`);
    if (error.isNetworkError) details.push('Erreur réseau');
    if (error.isTimeout) details.push('Délai d\'attente dépassé');
    if (error.isServerError) details.push('Erreur serveur');
    if (error.isClientError) details.push('Erreur client');
    
    return details.length > 0 ? details.join(' • ') : null;
  };

  const message = getErrorMessage(error);
  const severity = getErrorSeverity(error) as 'error' | 'warning' | 'info';
  const icon = showIcon ? getErrorIcon(error) : undefined;

  if (variant === 'compact') {
    return (
      <Alert 
        severity={severity} 
        icon={icon}
        action={onRetry && (
          <Button size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
            Réessayer
          </Button>
        )}
      >
        {message}
      </Alert>
    );
  }

  if (variant === 'detailed') {
    const details = getErrorDetails(error);
    return (
      <Paper elevation={1} sx={{ p: 3, mt: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {icon}
          <Typography variant="h6" color={severity === 'warning' ? 'warning.main' : 'error.main'}>
            {title}
          </Typography>
        </Box>
        
        <Alert severity={severity} sx={{ mb: 2 }}>
          <AlertTitle>{message}</AlertTitle>
          {details && (
            <Typography variant="caption" display="block" mt={1}>
              Détails: {details}
            </Typography>
          )}
        </Alert>

        {onRetry && (
          <Button 
            variant="contained" 
            onClick={onRetry} 
            startIcon={<RefreshIcon />}
            fullWidth
          >
            Réessayer
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Alert 
      severity={severity} 
      icon={icon}
      action={onRetry && (
        <Button size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
          Réessayer
        </Button>
      )}
      sx={{ mt: 2 }}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

interface ApiStateWrapperProps<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  children: (data: T) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onRetry?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  showLoadingSpinner?: boolean;
  showErrorDisplay?: boolean;
}

export function ApiStateWrapper<T>({
  data,
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  onRetry,
  loadingMessage,
  errorTitle,
  showLoadingSpinner = true,
  showErrorDisplay = true,
}: ApiStateWrapperProps<T>) {
  if (loading) {
    if (loadingComponent) return <>{loadingComponent}</>;
    if (showLoadingSpinner) return <LoadingSpinner message={loadingMessage} />;
    return null;
  }

  if (error && showErrorDisplay) {
    if (errorComponent) return <>{errorComponent}</>;
    return <ErrorDisplay error={error} onRetry={onRetry} title={errorTitle} />;
  }

  if (!data) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">
          Aucune donnée disponible
        </Typography>
      </Box>
    );
  }

  return <>{children(data)}</>;
}

// Status chips for different error types
export const ErrorStatusChip: React.FC<{ error: ApiError | string | null }> = ({ error }) => {
  if (!error) return null;

  const getChipProps = (error: ApiError | string) => {
    if (typeof error === 'string') {
      return { label: 'Erreur', color: 'error' as const };
    }

    if (error.isNetworkError) return { label: 'Réseau', color: 'warning' as const };
    if (error.isTimeout) return { label: 'Timeout', color: 'warning' as const };
    if (error.isServerError) return { label: 'Serveur', color: 'error' as const };
    if (error.isClientError) return { label: 'Client', color: 'error' as const };
    
    return { label: 'Erreur', color: 'error' as const };
  };

  const { label, color } = getChipProps(error);

  return <Chip label={label} color={color} size="small" variant="outlined" />;
};
