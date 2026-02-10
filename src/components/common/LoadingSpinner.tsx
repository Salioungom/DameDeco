import { CircularProgress, Box } from '@mui/material';

export function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
}
