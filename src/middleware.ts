import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth/jwt';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('accessToken')?.value;

    // Define protected paths
    const isAdminPath = url.pathname.startsWith('/admin');
    const isSuperAdminPath = url.pathname.startsWith('/superadmin');
    const isAccountPath = url.pathname.startsWith('/account');
    const isProtectedPath = isAdminPath || isSuperAdminPath || isAccountPath;

    if (isProtectedPath) {
        if (!token) {
            // Redirect to appropriate login page
            if (isAdminPath) {
                url.pathname = '/admin/login';
            } else {
                url.pathname = '/login';
            }
            return NextResponse.redirect(url);
        }

        const payload = await verifyAccessToken(token);

        if (!payload) {
            // Token invalid or expired, redirect to login
            if (isAdminPath) {
                url.pathname = '/admin/login';
            } else {
                url.pathname = '/login';
            }
            return NextResponse.redirect(url);
        }

        // Role-based access control
        if (isSuperAdminPath && payload.role !== 'superadmin') {
            // Only superadmin can access superadmin area
            url.pathname = '/';
            return NextResponse.redirect(url);
        }

        if (isAdminPath && payload.role !== 'admin' && payload.role !== 'superadmin') {
            // Only admin or superadmin can access admin area
            url.pathname = '/';
            return NextResponse.redirect(url);
        }

        if (isAccountPath && !['client', 'admin', 'superadmin'].includes(payload.role)) {
            // Account pages accessible to authenticated users
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // If user is logged in and tries to access login page, redirect based on role
    if (url.pathname === '/login' && token) {
        const payload = await verifyAccessToken(token);
        if (payload) {
            if (payload.role === 'superadmin') {
                url.pathname = '/superadmin/dashboard';
            } else if (payload.role === 'admin') {
                url.pathname = '/admin/dashboard';
            } else {
                url.pathname = '/';
            }
            return NextResponse.redirect(url);
        }
    }

    // If user is logged in and tries to access admin login, redirect based on role
    if (url.pathname === '/admin/login' && token) {
        const payload = await verifyAccessToken(token);
        if (payload) {
            if (payload.role === 'superadmin') {
                url.pathname = '/superadmin/dashboard';
            } else if (payload.role === 'admin') {
                url.pathname = '/admin/dashboard';
            } else {
                url.pathname = '/';
            }
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/superadmin/:path*', '/account/:path*', '/login', '/admin/login'],
};
