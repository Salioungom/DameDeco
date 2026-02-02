'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress, Container } from '@mui/material';

interface RequireRoleProps {
    children: React.ReactNode;
    allowedRoles: Array<'admin' | 'client' | 'superadmin'>;
    redirectTo?: string;
}

export function RequireRole({ children, allowedRoles, redirectTo = '/' }: RequireRoleProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('RequireRole - user:', user);
        console.log('RequireRole - loading:', loading);
        console.log('RequireRole - allowedRoles:', allowedRoles);
        
        if (!loading && !user) {
            // Not authenticated, redirect to login
            console.log('RequireRole - Not authenticated, redirecting to login');
            router.push('/login');
        } else if (!loading && user && !allowedRoles.includes(user.role)) {
            // Authenticated but wrong role, redirect to specified path
            console.log('RequireRole - Wrong role:', user.role, 'allowed:', allowedRoles, 'redirecting to', redirectTo);
            router.push(redirectTo);
        } else if (!loading && user && allowedRoles.includes(user.role)) {
            console.log('RequireRole - Access granted for role:', user.role);
        }
    }, [user, loading, router, allowedRoles, redirectTo]);

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
