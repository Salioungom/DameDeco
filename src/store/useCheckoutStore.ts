import { create } from 'zustand';

interface CheckoutState {
  deliveryMethod: 'delivery' | 'pickup';
  deliveryFee: number;
  estimatedDays: string;
  selectedAddressId: number | null;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  specialInstructions: string;
  paymentMethod: string;

  setDeliveryMethod: (method: 'delivery' | 'pickup') => void;
  setDeliveryFee: (fee: number) => void;
  setEstimatedDays: (days: string) => void;
  setSelectedAddressId: (id: number | null) => void;
  setShippingInfo: (info: Partial<Pick<CheckoutState, 'firstName' | 'lastName' | 'phone' | 'address' | 'city' | 'specialInstructions'>>) => void;
  setPaymentMethod: (method: string) => void;
  resetCheckout: () => void;
}

const initialState = {
  deliveryMethod: 'delivery' as const,
  deliveryFee: 0,
  estimatedDays: '',
  selectedAddressId: null,
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  specialInstructions: '',
  paymentMethod: 'wave',
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...initialState,

  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setDeliveryFee: (fee) => set({ deliveryFee: fee }),
  setEstimatedDays: (days) => set({ estimatedDays: days }),
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setShippingInfo: (info) => set((state) => ({ ...state, ...info })),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  resetCheckout: () => set(initialState),
}));
