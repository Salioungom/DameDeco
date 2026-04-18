'use client';

import ShippingSettingsForm from './ShippingSettingsForm';

export default function ShippingManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Frais de Livraison</h1>
      <ShippingSettingsForm />
    </div>
  );
}
