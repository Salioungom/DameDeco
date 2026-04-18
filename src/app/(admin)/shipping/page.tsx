import { AdminRoute } from '@/lib/guards';
import ShippingManagement from '@/components/shipping/ShippingManagement';

export default function ShippingPage() {
  return (
    <AdminRoute>
      <ShippingManagement />
    </AdminRoute>
  );
}
