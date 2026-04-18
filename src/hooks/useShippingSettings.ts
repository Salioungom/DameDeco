'use client';

import { useState, useEffect } from 'react';
import { shippingAPI } from '@/lib/shipping';
import type { ShippingSettings } from '@/lib/types/shipping';

export function useShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres de livraison publics au montage
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Essayer d'abord l'endpoint public
        let result = await shippingAPI.getPublicSettings();
        
        if (result.data) {
          setSettings(result.data);
          console.log('Public shipping settings loaded:', result.data);
        } else {
          // Si l'endpoint public échoue, essayer l'endpoint admin (pour utilisateurs connectés)
          console.log('Public settings endpoint failed, trying admin endpoint');
          result = await shippingAPI.getSettings();
          if (result.data) {
            setSettings(result.data);
            console.log('Admin shipping settings loaded:', result.data);
          } else {
            // Fallback avec les valeurs configurées dans l'admin (25 000 seuil, 2 500 coût)
            console.log('Both endpoints failed, using fallback values from admin config');
            const fallbackSettings: Partial<ShippingSettings> = {
              freeShippingThreshold: 25000,
              standardShippingCost: 2500,
              currency: 'XOF',
              freeShippingEnabled: true,
            };
            setSettings(fallbackSettings as ShippingSettings);
          }
        }
      } catch (err) {
        console.log('Error fetching settings:', err);
        // Fallback avec les valeurs configurées dans l'admin
        const fallbackSettings: Partial<ShippingSettings> = {
          freeShippingThreshold: 25000,
          standardShippingCost: 2500,
          currency: 'XOF',
          freeShippingEnabled: true,
        };
        setSettings(fallbackSettings as ShippingSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Calculer les frais de livraison localement (sans appel API)
  const calculateShippingCost = (subtotal: number): number => {
    if (!settings) {
      console.warn('Shipping settings not loaded');
      return 0;
    }

    const threshold = Number(settings.freeShippingThreshold);
    const standardCost = Number(settings.standardShippingCost);
    
    // Appliquer la logique de seuil de livraison gratuite
    const isFree = threshold > 0 && subtotal >= threshold;
    return isFree ? 0 : standardCost;
  };

  return { settings, loading, error, calculateShippingCost };
}
