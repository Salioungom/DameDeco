'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  alpha,
} from '@mui/material';
import { Security } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { BRAND_BLUE } from '@/theme';

interface TOTPSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

interface TwoFAStatus {
  totpEnabled: boolean;
  emailEnabled: boolean;
  email: string;
}

export default function Setup2FAPage() {
  const [status, setStatus] = useState<TwoFAStatus | null>(null);
  const [totpSetup, setTotpSetup] = useState<TOTPSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingUpTOTP, setSettingUpTOTP] = useState(false);
  const [enablingTOTP, setEnablingTOTP] = useState(false);
  const [disablingTOTP, setDisablingTOTP] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/2fa/status`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.message || 'Erreur lors du chargement du statut');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTOTP = async () => {
    setSettingUpTOTP(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/2fa/totp/setup`);
      const data = await response.json();
      
      if (response.ok) {
        setTotpSetup(data);
        setVerifyDialogOpen(true);
      } else {
        setError(data.message || 'Erreur lors de la configuration TOTP');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setSettingUpTOTP(false);
    }
  };

  const handleEnableTOTP = async () => {
    if (!verificationCode || !totpSetup) return;

    setEnablingTOTP(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/2fa/totp/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          secret: totpSetup.secret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('2FA TOTP activé avec succès !');
        setVerifyDialogOpen(false);
        setTotpSetup(null);
        setVerificationCode('');
        fetchStatus();
      } else {
        setError(data.message || 'Code de vérification invalide');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setEnablingTOTP(false);
    }
  };

  const handleDisableTOTP = async () => {
    setDisablingTOTP(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/2fa/totp/disable`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('2FA TOTP désactivé avec succès !');
        fetchStatus();
      } else {
        setError(data.message || 'Erreur lors de la désactivation');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setDisablingTOTP(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)`,
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, #042C53 0%, #185FA5 50%, #0C447C 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#85B7EB', 0.25)}, transparent)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '50%': { transform: 'translateY(-20px) translateX(20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha('#E6F1FB', 0.2)}, transparent)`,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
          <Box
            sx={{
              p: { xs: 3.5, sm: 5 },
              borderRadius: '16px',
              background: alpha('#fff', 0.97),
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(4, 44, 83, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              animation: 'slideUp 0.6s ease-out',
              '@keyframes slideUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4.5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
                  mb: 2.5,
                  boxShadow: '0 4px 16px rgba(24, 95, 165, 0.3)',
                }}
              >
                <Security sx={{ fontSize: 26, color: '#fff' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#042C53',
                  mb: 0.75,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                Authentification à deux facteurs
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
                {success}
              </Alert>
            )}

            {status && (
              <Box
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '12px',
                  background: alpha('#fff', 0.5),
                  border: '1px solid rgba(24, 95, 165, 0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#042C53' }}>
                  Application d'authentification (TOTP)
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  Utilisez une application comme Google Authenticator, Authy ou Microsoft Authenticator
                  pour générer des codes de vérification.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={status.totpEnabled}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          handleSetupTOTP();
                        } else {
                          handleDisableTOTP();
                        }
                      }}
                      disabled={settingUpTOTP || enablingTOTP || disablingTOTP}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: BRAND_BLUE,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: BRAND_BLUE,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {status.totpEnabled 
                        ? "TOTP activé" 
                        : settingUpTOTP 
                          ? "Configuration en cours..." 
                          : "Activer TOTP"}
                    </Typography>
                  }
                />

                {status.totpEnabled && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleSetupTOTP}
                      disabled={settingUpTOTP}
                      size="small"
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: BRAND_BLUE,
                        color: BRAND_BLUE,
                        '&:hover': {
                          borderColor: '#0C447C',
                          bgcolor: 'rgba(24, 95, 165, 0.06)',
                        },
                      }}
                    >
                      Afficher les codes de secours
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: alpha('#fff', 0.5),
                border: '1px solid rgba(24, 95, 165, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#042C53' }}>
                Email OTP
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                Recevez des codes de vérification par email.
              </Typography>

              {status && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={status.emailEnabled}
                      onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          try {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/2fa/email/send`);
                            const data = await response.json();
                            
                            if (response.ok) {
                              setSuccess('Code envoyé par email');
                            } else {
                              setError(data.message || 'Erreur lors de l\'envoi du code');
                            }
                          } catch (err) {
                            setError('Erreur de connexion au serveur');
                          }
                        }
                      }}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: BRAND_BLUE,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: BRAND_BLUE,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {status.emailEnabled ? "Email OTP activé" : "Activer Email OTP"}
                    </Typography>
                  }
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Dialog TOTP Setup */}
        <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(4, 44, 83, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
          },
        }}>
          <DialogTitle sx={{ fontWeight: 700, color: '#042C53' }}>Configurer l'authentification TOTP</DialogTitle>
        <DialogContent>
          {totpSetup && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                1. Scannez ce QR code avec votre application d'authentification :
              </Typography>
              
              <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <QRCodeSVG value={totpSetup.qrCode} size={200} />
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                Ou entrez manuellement cette clé secrète :
              </Typography>
              
              <TextField
                fullWidth
                value={totpSetup.secret}
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderRadius: '10px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                  },
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />

              <Typography variant="body2" sx={{ mb: 2 }}>
                2. Entrez le code à 6 chiffres généré par votre application :
              </Typography>
              
              <TextField
                fullWidth
                label="Code de vérification"
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                placeholder="000000"
                inputProps={{ maxLength: 6, style: { fontFamily: 'monospace' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover': {
                      borderColor: '#85B7EB',
                    },
                    '&.Mui-focused': {
                      borderColor: BRAND_BLUE,
                      boxShadow: '0 0 0 3px rgba(24, 95, 165, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    '&.Mui-focused': {
                      color: BRAND_BLUE,
                    },
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setVerifyDialogOpen(false)}
            sx={{
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              color: BRAND_BLUE,
              '&:hover': {
                bgcolor: 'rgba(24, 95, 165, 0.06)',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleEnableTOTP}
            variant="contained"
            disabled={!verificationCode || verificationCode.length !== 6 || enablingTOTP}
            sx={{
              py: 1.25,
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)',
              boxShadow: '0 4px 16px rgba(24, 95, 165, 0.35)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #0C447C 0%, #185FA5 100%)',
                boxShadow: '0 6px 20px rgba(24, 95, 165, 0.45)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: '#E6F1FB',
                color: '#888780',
              },
            }}
          >
            {enablingTOTP ? <CircularProgress size={20} color="inherit" /> : 'Activer TOTP'}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
}
