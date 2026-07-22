'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Tabs,
  Tab,
  Stack,
  Paper,
  Chip,
  CircularProgress,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Smartphone,
  AttachMoney as DollarSign,
  LocationOn,
  LocalShippingOutlined,
  StoreOutlined,
  PaymentOutlined,
  ArrowForward,
  CheckCircle as CheckCircle2,
} from '@mui/icons-material';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ClientOnly } from '@/components/ClientOnly';
import { CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { getImageUrl } from '@/lib/imageUtils';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
};

export interface OrderCheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: string;
  deliveryMethod: string;
  instructions?: string;
}

interface CheckoutFinalizeProps {
  items: CartItemWithProduct[];
  onPlaceOrder: (data: OrderCheckoutData) => void;
  isProcessing?: boolean;
  error?: string | null;
}

export function CheckoutFinalize({ items, onPlaceOrder, isProcessing = false, error = null }: CheckoutFinalizeProps) {
  const theme = useTheme();
  const brandBlue = '#185FA5';

  const {
    deliveryMethod,
    deliveryFee,
    estimatedDays,
    paymentMethod,
    setDeliveryMethod,
    setDeliveryFee,
    setEstimatedDays,
    setPaymentMethod,
    setShippingInfo,
  } = useCheckoutStore();

  const [tabValue, setTabValue] = useState(0);
  const [shippingSettings, setShippingSettings] = useState<any>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (!item.product) return sum;
        const price =
          item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price;
        return sum + (price || 0) * item.quantity;
      }, 0),
    [items]
  );

  const total = subtotal + deliveryFee;

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Le nom complet est obligatoire';
        else if (value.trim().length < 2) error = 'Minimum 2 caractères';
        break;
      case 'phone':
        if (!value.trim()) error = 'Le téléphone est obligatoire';
        else if (!isPhoneValid(value)) {
          error = 'Ex: 77 123 45 67 ou +221 77 123 45 67';
        }
        break;
      case 'city':
        if (!value.trim()) error = 'La ville est obligatoire';
        break;
      case 'address':
        if (!value.trim()) error = "L'adresse est obligatoire";
        else if (value.trim().length < 10) error = 'Minimum 10 caractères';
        break;
    }
    return error;
  };

  const isPhoneValid = (val: string) => {
    const digits = val.replace(/\s/g, '');
    return /^(\+?221)?[73]\d{8}$/.test(digits);
  };

  const isPaymentMethodMobile = paymentMethod === 'wave' || paymentMethod === 'orange';

  const isFormValid = (() => {
    if (deliveryMethod === 'delivery') {
      if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) return false;
    }
    if (isPaymentMethodMobile && !isPhoneValid(paymentPhone)) return false;
    return true;
  })();

  // Load shipping settings
  useEffect(() => {
    const loadShippingSettings = async () => {
      try {
        const result = await fetch('/api/v1/shipping/settings');
        const data = await result.json();
        setShippingSettings(data);
      } catch (error) {
        console.error('Erreur chargement settings livraison:', error);
      }
    };
    loadShippingSettings();
  }, []);

  // Calculate shipping
  useEffect(() => {
    const calculateShipping = async () => {
      if (!shippingSettings || subtotal === 0) return;
      setShippingLoading(true);
      try {
        const result = await fetch('/api/v1/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subtotal, deliveryMode: deliveryMethod }),
        });
        const data = await result.json();
        setDeliveryFee(Number(data.shippingCost) || 0);
        setEstimatedDays(data.estimatedDays || '');
      } catch (error) {
        console.error('Erreur calcul frais livraison:', error);
        setDeliveryFee(deliveryMethod === 'pickup' ? 0 : 5000);
      } finally {
        setShippingLoading(false);
      }
    };
    calculateShipping();
  }, [subtotal, deliveryMethod, shippingSettings, setDeliveryFee, setEstimatedDays]);

  const handlePlaceOrder = () => {
    if (isProcessing) return;

    // Validate all fields for delivery mode
    if (deliveryMethod === 'delivery') {
      const newErrors: Record<string, string> = {};
      newErrors.fullName = validateField('fullName', fullName);
      newErrors.phone = validateField('phone', phone);
      newErrors.city = validateField('city', city);
      newErrors.address = validateField('address', address);
      setErrors(newErrors);

      if (Object.values(newErrors).some((e) => e)) return;
    }

    // Split full name into first/last
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

    setShippingInfo({ firstName, lastName, phone, address, city });

    onPlaceOrder({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country: 'Sénégal',
      paymentMethod,
      deliveryMethod,
      instructions,
    });
  };

  const sectionSx = {
    p: { xs: 2.5, md: 3.5 },
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) },
  };

  const deliveryCities = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Mbour', 'Touba', 'Rufisque', 'Louga', 'Fatick', 'Kolda', 'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Stack spacing={3.5}>
              {/* Section 1: Mode de livraison */}
              <Box sx={sectionSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LocalShippingOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                  <Typography variant="h6" fontWeight={700}>Mode de livraison</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box
                    onClick={() => setDeliveryMethod('delivery')}
                    sx={{
                      p: 2.5,
                      border: '2px solid',
                      borderColor: deliveryMethod === 'delivery' ? brandBlue : alpha(theme.palette.divider, 0.8),
                      borderRadius: 3,
                      cursor: 'pointer',
                      bgcolor: deliveryMethod === 'delivery' ? alpha(brandBlue, 0.06) : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: alpha(brandBlue, 0.4), bgcolor: alpha(brandBlue, 0.03) },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <LocalShippingOutlined sx={{ color: deliveryMethod === 'delivery' ? brandBlue : 'text.secondary', fontSize: 24 }} />
                      <Typography variant="subtitle1" fontWeight={700} color={deliveryMethod === 'delivery' ? 'text.primary' : 'text.secondary'}>
                        Livraison à la maison
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {estimatedDays || '2-5 jours ouvrables'}
                    </Typography>
                    {deliveryMethod === 'delivery' && (
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle2 sx={{ color: brandBlue, fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={600} color={brandBlue}>Sélectionné</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box
                    onClick={() => setDeliveryMethod('pickup')}
                    sx={{
                      p: 2.5,
                      border: '2px solid',
                      borderColor: deliveryMethod === 'pickup' ? brandBlue : alpha(theme.palette.divider, 0.8),
                      borderRadius: 3,
                      cursor: 'pointer',
                      bgcolor: deliveryMethod === 'pickup' ? alpha(brandBlue, 0.06) : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: alpha(brandBlue, 0.4), bgcolor: alpha(brandBlue, 0.03) },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <StoreOutlined sx={{ color: deliveryMethod === 'pickup' ? brandBlue : 'text.secondary', fontSize: 24 }} />
                      <Typography variant="subtitle1" fontWeight={700} color={deliveryMethod === 'pickup' ? 'text.primary' : 'text.secondary'}>
                        Retrait en boutique
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Gratuit — sous 24h
                    </Typography>
                    {deliveryMethod === 'pickup' && (
                      <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle2 sx={{ color: brandBlue, fontSize: 18 }} />
                        <Typography variant="caption" fontWeight={600} color={brandBlue}>Sélectionné</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              {deliveryMethod === 'pickup' && (
                <Box sx={{ ...sectionSx, bgcolor: alpha(brandBlue, 0.04) }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StoreOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>Retrait en boutique</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Vous pourrez récupérer votre commande directement en boutique, sans frais de livraison.
                    Vous serez notifié dès que votre commande sera prête.
                  </Typography>
                </Box>
              )}

              {/* Section 2: Informations de livraison (uniquement si livraison à la maison) */}
              {deliveryMethod === 'delivery' && (
                <Box sx={sectionSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocationOn sx={{ color: brandBlue, fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>Informations de livraison</Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <ClientOnly>
                      <TextField
                        fullWidth
                        label="Nom complet"
                        placeholder="Votre nom complet"
                        value={fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFullName(e.target.value);
                          setErrors((prev) => ({ ...prev, fullName: validateField('fullName', e.target.value) }));
                        }}
                        required
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={inputSx}
                      />
                    </ClientOnly>

                    <ClientOnly>
                      <TextField
                        fullWidth
                        label="Email"
                        placeholder="exemple@email.com"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        sx={inputSx}
                      />
                    </ClientOnly>

                    <ClientOnly>
                      <TextField
                        fullWidth
                        label="Téléphone"
                        placeholder="+221 77 123 45 67"
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setPhone(e.target.value);
                          setErrors((prev) => ({ ...prev, phone: validateField('phone', e.target.value) }));
                        }}
                        required
                        error={!!errors.phone}
                        helperText={errors.phone || 'Ex: 77 123 45 67 ou +221 77 123 45 67'}
                        sx={inputSx}
                      />
                    </ClientOnly>

                    <ClientOnly>
                      <TextField
                        select
                        fullWidth
                        label="Ville"
                        value={city}
                        onChange={(e: { target: { value: string } }) => {
                          setCity(e.target.value);
                          setErrors((prev) => ({ ...prev, city: validateField('city', e.target.value) }));
                        }}
                        required
                        error={!!errors.city}
                        helperText={errors.city}
                        sx={inputSx}
                      >
                        {deliveryCities.map((c) => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </TextField>
                    </ClientOnly>

                    <ClientOnly>
                      <TextField
                        fullWidth
                        label="Adresse complète"
                        placeholder="Rue, quartier, repères..."
                        value={address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAddress(e.target.value);
                          setErrors((prev) => ({ ...prev, address: validateField('address', e.target.value) }));
                        }}
                        required
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{ ...inputSx, gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                      />
                    </ClientOnly>

                    <ClientOnly>
                      <TextField
                        fullWidth
                        label="Instructions (optionnel)"
                        placeholder="Instructions de livraison, repères, étage..."
                        multiline
                        minRows={2}
                        maxRows={4}
                        value={instructions}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstructions(e.target.value)}
                        sx={{ ...inputSx, gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                      />
                    </ClientOnly>
                  </Box>
                </Box>
              )}

              {/* Section 3: Méthode de paiement */}
              <Box sx={sectionSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PaymentOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                  <Typography variant="h6" fontWeight={700}>Méthode de paiement</Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={(_: React.SyntheticEvent, newValue: number) => {
                      setTabValue(newValue);
                      setPaymentMethod(['wave', 'cod'][newValue]);
                    }}
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: 14 },
                      '& .Mui-selected': { color: `${brandBlue} !important` },
                      '& .MuiTabs-indicator': { bgcolor: brandBlue },
                    }}
                  >
                    <Tab icon={<Smartphone />} iconPosition="start" label="Mobile Money" />
                    <Tab icon={<DollarSign />} iconPosition="start" label="À la livraison" />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Sélectionnez votre opérateur
                  </Typography>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                  >
                    {['wave', 'orange'].map((method) => (
                      <Paper
                        key={method}
                        variant="outlined"
                        onClick={() => setPaymentMethod(method)}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          borderColor: paymentMethod === method ? brandBlue : alpha(theme.palette.divider, 0.8),
                          cursor: 'pointer',
                          bgcolor: paymentMethod === method ? alpha(brandBlue, 0.06) : 'background.paper',
                          transition: 'all 0.2s ease',
                          '&:hover': { borderColor: alpha(brandBlue, 0.4) },
                        }}
                      >
                        <ClientOnly>
                          <FormControlLabel
                            value={method}
                            control={<Radio sx={{ '&.Mui-checked': { color: brandBlue } }} />}
                            label={method === 'wave' ? 'Wave' : 'Orange Money'}
                            sx={{ width: '100%', m: 0, '& .MuiTypography-root': { fontWeight: 600, fontSize: 14 } }}
                          />
                        </ClientOnly>
                      </Paper>
                    ))}
                  </RadioGroup>
                  <ClientOnly>
                    <TextField
                      fullWidth
                      label="Numéro de téléphone pour le paiement"
                      placeholder="77 123 45 67"
                      value={paymentPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentPhone(e.target.value)}
                      required
                      error={isPaymentMethodMobile && paymentPhone.length > 0 && !isPhoneValid(paymentPhone)}
                      helperText={
                        isPaymentMethodMobile && paymentPhone.length > 0 && !isPhoneValid(paymentPhone)
                          ? 'Ex: 77 123 45 67 ou +221 77 123 45 67'
                          : `Numéro ${paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} utilisé pour le paiement`
                      }
                      sx={{ mt: 2.5, ...inputSx }}
                    />
                  </ClientOnly>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Vous paierez en espèces lors de la réception de votre commande.
                  </Typography>
                </TabPanel>
              </Box>
            </Stack>
          </Box>

          {/* Récapitulatif sticky */}
          <Box>
            <Box
              sx={{
                ...sectionSx,
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Récapitulatif
              </Typography>
              <Stack spacing={2.5}>
                {items.filter((i) => i.product).map((item) => {
                  if (!item.product) return null;
                  const price =
                    item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price;
                  const totalPrice = (price || 0) * item.quantity;
                  return (
                    <Box key={item.id || item.product.id} sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: 'action.hover',
                          flexShrink: 0,
                          border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                        }}
                      >
                        <ImageWithFallback
                          src={getImageUrl(item.product.cover_image_url || item.product.images?.[0]?.image_url)}
                          alt={item.product.name || 'Produit'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {item.product.name || `Produit #${item.product_id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.quantity} x {(price || 0).toLocaleString('fr-FR')} FCFA
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="primary">
                          {totalPrice.toLocaleString('fr-FR')} FCFA
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Sous-total</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {subtotal.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {deliveryMethod === 'pickup' ? 'Retrait' : 'Livraison'}
                  </Typography>
                  {shippingLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Chip
                      label={deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: deliveryFee === 0 ? alpha(theme.palette.success.main, 0.1) : alpha(brandBlue, 0.1),
                        color: deliveryFee === 0 ? 'success.main' : brandBlue,
                        border: 'none',
                      }}
                    />
                  )}
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary">
                    {total.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>

                <Box>
                  {error && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.error.main, 0.08), borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.15)}` }}>
                      <Typography variant="body2" color="error" fontWeight={500}>{error}</Typography>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !isFormValid}
                    endIcon={isProcessing ? undefined : <ArrowForward />}
                    sx={{
                      borderRadius: 2,
                      py: 1.6,
                      fontWeight: 700,
                      fontSize: 15,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    {isProcessing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Traitement...
                      </Box>
                    ) : !isFormValid ? (
                      isPaymentMethodMobile && !isPhoneValid(paymentPhone)
                        ? 'Saisissez un numéro valide pour le paiement'
                        : 'Remplissez les champs obligatoires'
                    ) : (
                      'Confirmer la commande'
                    )}
                  </Button>
                </Box>

                <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                  En passant commande, vous acceptez nos conditions de vente
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
