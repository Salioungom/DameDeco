'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Tabs,
  Tab,
  Stack,
  Paper,
} from '@mui/material';
import {
  CreditCard,
  Smartphone,
  AttachMoney as DollarSign,
  ArrowBack as ArrowLeft,
  CheckCircle as CheckCircle2,
} from '@mui/icons-material';
import { CartItem } from '@/lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onPlaceOrder: () => void;
}

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
  style?: React.CSSProperties;
};

const CustomTabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, className, style } = props;

  if (value !== index) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={className}
      style={style}
    >
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
};

export function CheckoutPage({ items, onBack, onPlaceOrder }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('wave');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee = deliveryMethod === 'delivery' ? 3000 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      onPlaceOrder();
    }, 3000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const methods = ['wave', 'paypal', 'cod'];
    setPaymentMethod(methods[newValue]);
  };

  if (orderPlaced) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ pt: 6 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'success.main',
              }}
            >
              <CheckCircle2 sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Commande confirmée !
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Votre commande a été enregistrée avec succès. Vous recevrez une confirmation par SMS.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Montant total:{' '}
              <Typography component="span" color="primary" fontWeight="bold">
                {total.toLocaleString('fr-FR')} FCFA
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Button startIcon={<ArrowLeft />} onClick={onBack} sx={{ mb: 4, color: 'text.secondary' }}>
          Retour au panier
        </Button>

        <Typography variant="h3" gutterBottom>
          Finaliser la commande
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Stack spacing={4}>
              {/* Delivery Method */}
              <Card>
                <CardHeader title="Mode de réception" />
                <CardContent>
                  <RadioGroup value={deliveryMethod} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryMethod(e.target.value)}>
                    <Paper
                      variant="outlined"
                      sx={{
                        mb: 2,
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: deliveryMethod === 'delivery' ? 'action.selected' : 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => setDeliveryMethod('delivery')}
                    >
                      <FormControlLabel
                        value="delivery"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="subtitle1">Livraison à domicile</Typography>
                            <Typography variant="body2" color="text.secondary">
                              2-3 jours ouvrables - 3,000 FCFA
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        bgcolor: deliveryMethod === 'pickup' ? 'action.selected' : 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => setDeliveryMethod('pickup')}
                    >
                      <FormControlLabel
                        value="pickup"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="subtitle1">Retrait en boutique</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Gratuit - Disponible sous 24h
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              {deliveryMethod === 'delivery' && (
                <Card>
                  <CardHeader title="Adresse de livraison" />
                  <CardContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <TextField fullWidth label="Prénom" placeholder="Votre prénom" />
                      </Box>
                      <Box>
                        <TextField fullWidth label="Nom" placeholder="Votre nom" />
                      </Box>
                      <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
                        <TextField fullWidth label="Téléphone" placeholder="+221 XX XXX XX XX" />
                      </Box>
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField fullWidth label="Adresse complète" placeholder="Rue, quartier, ville" />
                      </Box>
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField fullWidth label="Instructions spéciales (optionnel)" placeholder="Ex: Appeler en arrivant" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader title="Méthode de paiement" />
                <CardContent>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="payment tabs"
                      variant="fullWidth"
                    >
                      <Tab icon={<Smartphone />} iconPosition="start" label="Mobile Money" />
                      <Tab icon={<CreditCard />} iconPosition="start" label="PayPal" />
                      <Tab icon={<DollarSign />} iconPosition="start" label="À la livraison" />
                    </Tabs>
                  </Box>

                  <CustomTabPanel value={tabValue} index={0}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sélectionner votre opérateur
                    </Typography>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value as string)}
                    >
                      <Paper variant="outlined" sx={{ mb: 2, p: 1 }}>
                        <FormControlLabel value="wave" control={<Radio />} label="Wave" sx={{ width: '100%', m: 0 }} />
                      </Paper>
                      <Paper variant="outlined" sx={{ mb: 2, p: 1 }}>
                        <FormControlLabel value="orange" control={<Radio />} label="Orange Money" sx={{ width: '100%', m: 0 }} />
                      </Paper>
                    </RadioGroup>

                    <TextField fullWidth label="Numéro de téléphone" placeholder="+221 XX XXX XX XX" sx={{ mt: 2 }} />
                  </CustomTabPanel>

                  <CustomTabPanel value={tabValue} index={1}>
                    <Typography variant="body2" color="text.secondary">
                      Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
                    </Typography>
                  </CustomTabPanel>

                  <CustomTabPanel value={tabValue} index={2}>
                    <Typography variant="body2" color="text.secondary">
                      Vous paierez en espèces lors de la réception de votre commande.
                    </Typography>
                  </CustomTabPanel>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Order Summary */}
          <Box>
            <Card sx={{ position: 'sticky', top: 100 }}>
              <CardHeader title="Récapitulatif" />
              <CardContent>
                <Stack spacing={3}>
                  <Stack spacing={2}>
                    {items.map((item) => {
                      const price = item.priceType === 'wholesale' ? item.product.wholesalePrice : item.product.price;
                      return (
                        <Box key={item.product.id} display="flex" gap={2}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: 'action.hover',
                              flexShrink: 0,
                            }}
                          >
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          </Box>

                          <Box flex={1} minWidth={0}>
                            <Typography variant="body2" noWrap>
                              {item.product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Qté: {item.quantity}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {(price * item.quantity).toLocaleString('fr-FR')} FCFA
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>

                  <Divider />

                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Sous-total
                      </Typography>
                      <Typography variant="body2">{subtotal.toLocaleString('fr-FR')} FCFA</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Livraison
                      </Typography>
                      <Typography variant="body2">
                        {deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">
                      {total.toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </Box>

                  <Button variant="contained" size="large" fullWidth onClick={handlePlaceOrder}>
                    Confirmer la commande
                  </Button>

                  <Typography variant="caption" align="center" color="text.secondary" display="block">
                    En passant commande, vous acceptez nos conditions de vente
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
