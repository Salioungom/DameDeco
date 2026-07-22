'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
} from '@mui/material';
import { ArrowBack as ArrowLeft } from '@mui/icons-material';

const steps = ['Récapitulatif', 'Finalisation'];

interface CheckoutHeaderProps {
  activeStep: number;
  onBack: () => void;
}

export function CheckoutHeader({ activeStep, onBack }: CheckoutHeaderProps) {
  const theme = useTheme();
  const brandBlue = '#185FA5';

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(brandBlue, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
        borderBottom: `1px solid ${alpha(brandBlue, 0.1)}`,
        pt: { xs: 12, md: 14 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowLeft />}
          onClick={onBack}
          sx={{
            mb: 2,
            borderRadius: 2,
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {activeStep === 0 ? 'Retour au panier' : 'Retour au récapitulatif'}
        </Button>

        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: 26, md: 34 },
            letterSpacing: '-0.02em',
            mb: 3,
          }}
        >
          {activeStep === 0 ? 'Votre panier' : 'Finaliser la commande'}
        </Typography>

        <Stepper
          activeStep={activeStep}
          sx={{
            maxWidth: 500,
            '& .MuiStepLabel-label': {
              fontWeight: 600,
              fontSize: { xs: 13, md: 14 },
            },
            '& .MuiStepLabel-label.Mui-active': {
              color: brandBlue,
            },
            '& .MuiStepLabel-label.Mui-completed': {
              color: 'success.main',
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: brandBlue,
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: 'success.main',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Container>
    </Box>
  );
}
