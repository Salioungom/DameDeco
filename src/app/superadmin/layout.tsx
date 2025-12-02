import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SuperAdmin - Dame Sarr',
  description: 'Panneau SuperAdmin',
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
