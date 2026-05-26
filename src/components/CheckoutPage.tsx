'use client';

import * as React from 'react';
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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Smartphone,
  AttachMoney as DollarSign,
  ArrowBack as ArrowLeft,
  CheckCircle as CheckCircle2,
  LocationOn,
  Add,
  LocalShippingOutlined,
  StoreOutlined,
  PaymentOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ClientOnly } from './ClientOnly';
import { CartItemWithProduct } from '@/hooks/useCartWithProducts';
import { Address, AddressService } from '@/services/address.service';
import { AddressFormModal } from './AddressFormModal';

export interface OrderCheckoutData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: string;
  deliveryMethod: string;
}

interface CheckoutPageProps {
  items: CartItemWithProduct[];
  onBack: () => void;
  onPlaceOrder: (data: OrderCheckoutData) => void;
  isProcessing?: boolean;
  error?: string | null;
  orderData?: any;
}

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
};

export function CheckoutPage({ items, onBack, onPlaceOrder, isProcessing = false, error = null, orderData }: CheckoutPageProps) {
  const theme = useTheme();
  const brandBlue = '#185FA5';
  const brandDark = '#042C53';

  const [paymentMethod, setPaymentMethod] = useState<string>('wave');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('delivery');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [estimatedDays, setEstimatedDays] = useState<string>('');
  const [shippingSettings, setShippingSettings] = useState<any>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const subtotal = useMemo(() => orderData
    ? Number(orderData.subtotal || 0)
    : (items || []).reduce((sum, item) => {
        if (!item.product) return sum;
        const price =
          item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price;
        return sum + (price || 0) * item.quantity;
      }, 0),
  [orderData, items]);

  const total = subtotal + deliveryFee;

  const isDeliveryAddressValid = deliveryMethod === 'pickup' || (
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== ''
  );

  useEffect(() => {
    const loadShippingSettings = async () => {
      try {
        const result = await fetch('/api/v1/shipping/settings');
        const data = await result.json();
        setShippingSettings(data);
        if (data.deliveryModeEnabled === false && data.pickupModeEnabled !== false) {
          setDeliveryMethod('pickup');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des settings de livraison:', error);
      }
    };
    loadShippingSettings();
  }, []);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setAddressesLoading(true);
        const response = await AddressService.getUserAddresses(0, 100);
        setSavedAddresses(response.items);
        const defaultAddress = response.items.find(a => a.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setFirstName(defaultAddress.first_name || '');
          setLastName(defaultAddress.last_name || '');
          setPhone(defaultAddress.phone);
          setAddress(defaultAddress.address_line_1);
        }
      } catch (error) {
        console.error('Erreur chargement adresses:', error);
      } finally {
        setAddressesLoading(false);
      }
    };
    loadAddresses();
  }, []);

  useEffect(() => {
    if (orderData && orderData.delivery_mode) {
      setDeliveryMethod(orderData.delivery_mode);
      setDeliveryFee(Number(orderData.delivery_fee) || 0);
      if (orderData.customer) {
        setFirstName(orderData.customer.first_name || '');
        setLastName(orderData.customer.last_name || '');
        setPhone(orderData.customer.phone || '');
        setAddress(orderData.customer.address || '');
      }
    }
  }, [orderData]);

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
        console.error('Erreur lors du calcul des frais de livraison:', error);
        setDeliveryFee(deliveryMethod === 'pickup' ? 0 : 5000);
      } finally {
        setShippingLoading(false);
      }
    };
    calculateShipping();
  }, [subtotal, deliveryMethod, shippingSettings]);

  const handlePlaceOrder = () => {
    if (isProcessing) return;
    setOrderPlaced(true);
    onPlaceOrder({
      firstName,
      lastName,
      phone,
      address,
      city: selectedAddress?.city || '',
      country: 'Sénégal',
      paymentMethod,
      deliveryMethod,
    });
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPaymentMethod(['wave', 'Orange Money', 'cod'][newValue]);
  };

  const handleAddressSelect = (addr: Address) => {
    setSelectedAddress(addr);
    setShowNewAddressForm(false);
    setFirstName(addr.first_name || '');
    setLastName(addr.last_name || '');
    setPhone(addr.phone);
    setAddress(addr.address_line_1);
  };

  const handleAddNewAddress = () => setShowAddressModal(true);
  const handleAddressModalClose = () => setShowAddressModal(false);
  const handleAddressModalSuccess = async () => {
    try {
      const response = await AddressService.getUserAddresses(0, 100);
      setSavedAddresses(response.items);
    } catch (error) {
      console.error('Erreur rechargement adresses:', error);
    }
    setShowAddressModal(false);
  };

  const sectionSx = {
    p: { xs: 2.5, md: 3.5 },
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  };

  if (orderPlaced) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box
          sx={{
            maxWidth: 450,
            width: '100%',
            textAlign: 'center',
            py: 6,
            px: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(brandBlue, 0.04)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              bgcolor: alpha(theme.palette.success.main, 0.1),
            }}
          >
            <CheckCircle2 sx={{ fontSize: 36, color: 'success.main' }} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Commande confirmée !
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
            Votre commande a été enregistrée avec succès. Vous recevrez une confirmation par SMS.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Montant total :{' '}
            <Typography component="span" color="primary" fontWeight={700}>
              {total.toLocaleString('fr-FR')} FCFA
            </Typography>
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(brandBlue, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          borderBottom: `1px solid ${alpha(brandBlue, 0.1)}`,
          pt: { xs: 12, md: 14 },
          pb: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="xl">
          <Button startIcon={<ArrowLeft />} onClick={onBack} sx={{ mb: 2, borderRadius: 2, fontWeight: 500, color: 'text.secondary' }}>
            Retour au panier
          </Button>
          <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: 28, md: 36 }, letterSpacing: '-0.02em' }}>
            Finaliser la commande
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Stack spacing={3.5}>
              {/* Delivery Method */}
              <Box sx={sectionSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LocalShippingOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                  <Typography variant="h6" fontWeight={700}>Mode de réception</Typography>
                </Box>
                <RadioGroup value={deliveryMethod} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeliveryMethod(e.target.value)}>
                  {shippingSettings?.deliveryModeEnabled !== false && (
                    <Box
                      onClick={() => setDeliveryMethod('delivery')}
                      sx={{
                        mb: 2,
                        p: 2.5,
                        border: '1.5px solid',
                        borderColor: deliveryMethod === 'delivery' ? brandBlue : alpha(theme.palette.divider, 0.8),
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: deliveryMethod === 'delivery' ? alpha(brandBlue, 0.06) : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: alpha(brandBlue, 0.4), bgcolor: alpha(brandBlue, 0.03) },
                      }}
                    >
                      <ClientOnly>
                        <FormControlLabel
                          value="delivery"
                          control={<Radio sx={{ '&.Mui-checked': { color: brandBlue } }} />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>Livraison à domicile</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {estimatedDays || '2-5 jours ouvrables'}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </ClientOnly>
                    </Box>
                  )}
                  {shippingSettings?.pickupModeEnabled !== false && (
                    <Box
                      onClick={() => setDeliveryMethod('pickup')}
                      sx={{
                        p: 2.5,
                        border: '1.5px solid',
                        borderColor: deliveryMethod === 'pickup' ? brandBlue : alpha(theme.palette.divider, 0.8),
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: deliveryMethod === 'pickup' ? alpha(brandBlue, 0.06) : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: alpha(brandBlue, 0.4), bgcolor: alpha(brandBlue, 0.03) },
                      }}
                    >
                      <ClientOnly>
                        <FormControlLabel
                          value="pickup"
                          control={<Radio sx={{ '&.Mui-checked': { color: brandBlue } }} />}
                          label={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <StoreOutlined sx={{ color: brandBlue, fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={600}>Retrait en boutique</Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Gratuit — sous 24h
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </ClientOnly>
                    </Box>
                  )}
                </RadioGroup>
              </Box>

              {/* Delivery Info */}
              {deliveryMethod === 'delivery' && (
                <Box sx={sectionSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocationOn sx={{ color: brandBlue, fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>Adresse de livraison</Typography>
                  </Box>
                  {addressesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress size={32} />
                    </Box>
                  ) : savedAddresses.length > 0 && !showNewAddressForm ? (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                        Sélectionnez une adresse enregistrée :
                      </Typography>
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        {savedAddresses.map((addr) => (
                          <Paper
                            key={addr.id}
                            elevation={0}
                            onClick={() => handleAddressSelect(addr)}
                            sx={{
                              p: 2.5,
                              border: '1.5px solid',
                              borderColor: selectedAddress?.id === addr.id ? brandBlue : alpha(theme.palette.divider, 0.8),
                              borderRadius: 3,
                              cursor: 'pointer',
                              bgcolor: selectedAddress?.id === addr.id ? alpha(brandBlue, 0.06) : 'background.paper',
                              transition: 'all 0.2s ease',
                              '&:hover': { borderColor: alpha(brandBlue, 0.4) },
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <LocationOn sx={{ color: brandBlue, mt: 0.5, flexShrink: 0 }} />
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {addr.first_name} {addr.last_name}
                                  </Typography>
                                  {addr.is_default && (
                                    <Chip label="Défaut" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: alpha(brandBlue, 0.12), color: brandBlue, border: 'none' }} />
                                  )}
                                </Box>
                                <Typography variant="body2" color="text.secondary">{addr.phone}</Typography>
                                <Typography variant="body2" color="text.secondary">{addr.address_line_1}</Typography>
                                {addr.address_line_2 && <Typography variant="body2" color="text.secondary">{addr.address_line_2}</Typography>}
                                <Typography variant="body2" color="text.secondary">{addr.city}, {addr.state}</Typography>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setShowNewAddressForm(true)}
                        sx={{ borderRadius: 2, fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.8) }}
                      >
                        Utiliser une nouvelle adresse
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {savedAddresses.length > 0 && (
                        <Button
                          variant="text"
                          onClick={() => setShowNewAddressForm(false)}
                          sx={{ mb: 2, borderRadius: 2, color: 'text.secondary' }}
                        >
                          ← Retour aux adresses enregistrées
                        </Button>
                      )}
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2.5 }}>
                        {savedAddresses.length > 0 ? 'Nouvelle adresse' : 'Entrez votre adresse de livraison'}
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                        <ClientOnly>
                          <TextField fullWidth label="Prénom" placeholder="Votre prénom" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }} />
                        </ClientOnly>
                        <ClientOnly>
                          <TextField fullWidth label="Nom" placeholder="Votre nom" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }} />
                        </ClientOnly>
                        <ClientOnly>
                          <TextField fullWidth label="Téléphone" placeholder="+221 XX XXX XX XX" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }} />
                        </ClientOnly>
                        <ClientOnly>
                          <TextField fullWidth label="Adresse complète" placeholder="Rue, quartier, ville" value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} required
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }} />
                        </ClientOnly>
                        <Box sx={{ gridColumn: '1 / -1' }}>
                          <ClientOnly>
                            <TextField fullWidth label="Instructions spéciales (optionnel)" placeholder="Ex: Appeler en arrivant" value={specialInstructions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecialInstructions(e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }} />
                          </ClientOnly>
                        </Box>
                      </Box>
                      {savedAddresses.length > 0 && (
                        <Button variant="outlined" startIcon={<Add />} onClick={handleAddNewAddress}
                          sx={{ borderRadius: 2, mt: 2.5, fontWeight: 600, borderColor: alpha(theme.palette.divider, 0.8) }}>
                          Enregistrer cette adresse
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              )}

              {/* Payment Method */}
              <Box sx={sectionSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PaymentOutlined sx={{ color: brandBlue, fontSize: 22 }} />
                  <Typography variant="h6" fontWeight={700}>Méthode de paiement</Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
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
                  <RadioGroup value={paymentMethod} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}>
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
                      label="Numéro de téléphone"
                      placeholder="+221 XX XXX XX XX"
                      sx={{ mt: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.common.black, 0.02) } }}
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

          {/* Order Summary */}
          <Box>
            <Box
              sx={{
                ...sectionSx,
                position: 'sticky',
                top: 100,
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Récapitulatif</Typography>
              <Stack spacing={2.5}>
                {(orderData?.items || (Array.isArray(items) ? items.filter(i => i.product) : [])).map((item: any) => {
                  if (!item.product) return null;
                  const price = item.price_type === 'wholesale' ? item.product.wholesale_price : item.product.price;
                  const totalPrice = Number(item.total_price) || (price || 0) * item.quantity;
                  return (
                    <Box key={item.id || item.product.id} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ width: 64, height: 64, borderRadius: 2, overflow: 'hidden', bgcolor: 'action.hover', flexShrink: 0, border: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
                        <ImageWithFallback
                          src={item.product?.cover_image_url || item.product?.images?.[0]?.image_url || ''}
                          alt={item.product?.name || 'Produit'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{item.product?.name || `Produit #${item.product_id}`}</Typography>
                        <Typography variant="caption" color="text.secondary">Qté: {item.quantity}</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary">{totalPrice.toLocaleString('fr-FR')} FCFA</Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Sous-total</Typography>
                  <Typography variant="body2" fontWeight={600}>{subtotal.toLocaleString('fr-FR')} FCFA</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Livraison</Typography>
                  <Chip
                    label={deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-FR')} FCFA`}
                    size="small"
                    sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: deliveryFee === 0 ? alpha(theme.palette.success.main, 0.1) : alpha(brandBlue, 0.1), color: deliveryFee === 0 ? 'success.main' : brandBlue, border: 'none' }}
                  />
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="primary">{total.toLocaleString('fr-FR')} FCFA</Typography>
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
                    disabled={isProcessing || !isDeliveryAddressValid}
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
                    ) : !isDeliveryAddressValid ? (
                      'Remplissez les champs obligatoires'
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

      <AddressFormModal
        open={showAddressModal}
        onClose={handleAddressModalClose}
        onSuccess={handleAddressModalSuccess}
      />
    </Box>
  );
}
