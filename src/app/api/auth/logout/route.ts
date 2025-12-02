import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearAuthCookies } from '@/lib/auth/cookies';
import { verifyRefreshToken } from '@/lib/auth/jwt';
import { revokeRefreshToken } from '@/lib/db/users';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (refreshToken) {
            const payload = await verifyRefreshToken(refreshToken);
            if (payload) {
                await revokeRefreshToken(payload.sub);
            }
        }

        const res = NextResponse.json({ ok: true });
        clearAuthCookies(res);
        return res;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
