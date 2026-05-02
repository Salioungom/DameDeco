'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperadminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to dashboards page
    router.push('/dashboards');
  }, [router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return null;
}
