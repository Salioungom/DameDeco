'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
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
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

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
      const response = await fetch('/api/v1/auth/2fa/status');
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
      const response = await fetch('/api/v1/auth/2fa/totp/setup');
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
      const response = await fetch('/api/v1/auth/2fa/totp/enable', {
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
      const response = await fetch('/api/v1/auth/2fa/totp/disable', {
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
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Authentification à deux facteurs
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {status && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Application d'authentification (TOTP)
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                />
              }
              label={
                status.totpEnabled 
                  ? "TOTP activé" 
                  : settingUpTOTP 
                    ? "Configuration en cours..." 
                    : "Activer TOTP"
              }
            />

            {status.totpEnabled && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleSetupTOTP}
                  disabled={settingUpTOTP}
                  size="small"
                >
                  Afficher les codes de secours
                </Button>
              </Box>
            )}
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Email OTP
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                        const response = await fetch('/api/v1/auth/2fa/email/send');
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
                />
              }
              label={status.emailEnabled ? "Email OTP activé" : "Activer Email OTP"}
            />
          )}
        </Paper>
      </Box>

      {/* Dialog TOTP Setup */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configurer l'authentification TOTP</DialogTitle>
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
                }}
                sx={{ mb: 3, fontFamily: 'monospace' }}
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
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleEnableTOTP}
            variant="contained"
            disabled={!verificationCode || verificationCode.length !== 6 || enablingTOTP}
          >
            {enablingTOTP ? <CircularProgress size={20} /> : 'Activer TOTP'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
