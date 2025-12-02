import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
    title: 'Dame Sarr - Import & Commerce',
    description: 'Importation de produits de qualité depuis la Chine',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Providers>{children}</Providers>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
