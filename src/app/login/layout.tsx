import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Connexion - Dame Sarr',
    description: 'Connectez-vous à votre compte Dame Sarr',
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
        </div>
    );
}
