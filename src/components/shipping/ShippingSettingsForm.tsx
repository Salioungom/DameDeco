'use client';

import { useState, useEffect } from 'react';
import { shippingAPI } from '@/lib/shipping';
import type { ShippingSettings, ShippingSettingsUpdate } from '@/lib/types/shipping';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ShippingSettingsForm() {
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ShippingSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    const result = await shippingAPI.getSettings();
    
    if (result.error) {
      setError(result.error.message || 'Erreur lors du chargement des paramètres');
    } else if (result.data) {
      setSettings(result.data);
      setFormData(result.data);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const result = settings 
        ? await shippingAPI.updateSettings(formData)
        : await shippingAPI.createSettings(formData as any);
      
      if (result.error) {
        setError(result.error.message || 'Erreur lors de la sauvegarde');
      } else {
        await loadSettings();
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de livraison</h3>
          
          <div className="space-y-5">
            <div>
              <Label htmlFor="freeShippingThreshold" className="text-sm font-medium text-gray-700 mb-2 block">
                Seuil livraison gratuite
              </Label>
              <div className="relative">
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={formData.freeShippingThreshold || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                  className="pr-16 text-lg"
                  placeholder="60000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  CFA
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Montant minimum du panier pour bénéficier de la livraison gratuite
              </p>
            </div>
            
            <div>
              <Label htmlFor="standardShippingCost" className="text-sm font-medium text-gray-700 mb-2 block">
                Coût livraison standard
              </Label>
              <div className="relative">
                <Input
                  id="standardShippingCost"
                  type="number"
                  value={formData.standardShippingCost || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, standardShippingCost: Number(e.target.value) })}
                  className="pr-16 text-lg"
                  placeholder="3000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  CFA
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Frais de livraison appliqués aux commandes sous le seuil gratuit
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={saving}
            loading={saving}
          >
            Sauvegarder les modifications
          </Button>
        </div>
      </form>

      {settings && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Récapitulatif actuel</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Seuil gratuit:</span>
              <span className="ml-2 font-semibold text-blue-900">
                {Number(settings.freeShippingThreshold).toLocaleString('fr-FR')} CFA
              </span>
            </div>
            <div>
              <span className="text-blue-700">Coût standard:</span>
              <span className="ml-2 font-semibold text-blue-900">
                {Number(settings.standardShippingCost).toLocaleString('fr-FR')} CFA
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
