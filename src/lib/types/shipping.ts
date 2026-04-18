// Settings
export interface ShippingSettings {
  id: number;
  freeShippingThreshold: number;
  standardShippingCost: number;
  currency: string;
  freeShippingEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingSettingsCreate {
  freeShippingThreshold: number;
  standardShippingCost: number;
  currency?: string;
  freeShippingEnabled?: boolean;
}

export interface ShippingSettingsUpdate {
  freeShippingThreshold?: number;
  standardShippingCost?: number;
  currency?: string;
  freeShippingEnabled?: boolean;
}

// Calculate
export interface ShippingCalculateRequest {
  subtotal: number;
  deliveryZone?: string;
  method?: string;
  itemsCount?: number;
  weight?: number;
}

export interface ShippingCalculateResponse {
  shippingCost: number;
  estimatedDays: string;
  freeShipping: boolean;
  availableMethods: any[];
  zoneInfo: any;
}

// Zones
export interface ShippingZone {
  id: number;
  name: string;
  code: string;
  description: string | null;
  costMultiplier: number;
  baseCost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  deliveryTimeDescription: string | null;
  countries: string[] | null;
  regions: string[] | null;
  postalCodes: string[] | null;
  displayOrder: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZoneCreate {
  name: string;
  code: string;
  description?: string;
  costMultiplier?: number;
  baseCost?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  deliveryTimeDescription?: string;
  displayOrder?: number;
  isDefault?: boolean;
}

export interface ShippingZoneUpdate {
  name?: string;
  code?: string;
  description?: string | null;
  costMultiplier?: number;
  baseCost?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  deliveryTimeDescription?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

// Methods
export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string | null;
  baseCost: number;
  costMultiplier: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  deliveryTimeDescription: string | null;
  maxWeight: number | null;
  maxValue: number | null;
  minOrderValue: number | null;
  zoneId: number | null;
  displayOrder: number;
  icon: string | null;
  color: string | null;
  isPickup: boolean;
  isExpress: boolean;
  requiresSignature: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethodCreate {
  name: string;
  code: string;
  description?: string;
  baseCost?: number;
  costMultiplier?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  deliveryTimeDescription?: string;
  displayOrder?: number;
  icon?: string;
  color?: string;
  isPickup?: boolean;
  isExpress?: boolean;
  requiresSignature?: boolean;
  zoneId?: number;
}

export interface ShippingMethodUpdate {
  name?: string;
  code?: string;
  description?: string | null;
  baseCost?: number;
  costMultiplier?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  deliveryTimeDescription?: string | null;
  displayOrder?: number;
  icon?: string | null;
  color?: string | null;
  isPickup?: boolean;
  isExpress?: boolean;
  requiresSignature?: boolean;
  isActive?: boolean;
  zoneId?: number | null;
}
