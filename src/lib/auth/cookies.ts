import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '900', 10);
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7; // 7 days
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60;

export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
    res.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ACCESS_TOKEN_EXPIRES_IN,
    });

    res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    });
}

export function clearAuthCookies(res: NextResponse) {
    res.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
    });

    res.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
    });
}
