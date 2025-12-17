import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inscription - Dame Sarr',
    description: 'Créez votre compte Dame Sarr',
};

export default function RegisterLayout({
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
