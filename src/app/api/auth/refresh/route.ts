import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signAccessToken, verifyRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/cookies';
import { getUserById, verifyRevokedToken } from '@/lib/db/users';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
        }

        const payload = await verifyRefreshToken(refreshToken);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
        }

        // Verify if token is in DB (and not revoked)
        const isValid = await verifyRevokedToken(payload.sub, refreshToken);
        if (!isValid) {
            return NextResponse.json({ error: 'Token revoked or invalid' }, { status: 401 });
        }

        const user = await getUserById(payload.sub);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const newAccessToken = await signAccessToken({ sub: user.id, role: user.role });
        // Ideally we rotate refresh token here too, but for simplicity we keep the same one until expiry
        // or we can re-issue a new one. Let's re-issue to be safe and extend session.
        // const newRefreshToken = await signRefreshToken({ sub: user.id });
        // await storeRefreshToken(user.id, newRefreshToken);

        const res = NextResponse.json({ ok: true });

        // If rotating: setAuthCookies(res, newAccessToken, newRefreshToken);
        // If just refreshing access:
        // We need to set the access token cookie. The refresh token cookie remains valid.
        // However, our setAuthCookies helper sets both.
        // Let's just re-set both with the existing refresh token to keep it simple, 
        // or we can create a specific helper for just access token.
        // For now, let's just re-set the access token manually or update the helper.
        // Actually, re-setting the refresh token with the same value resets its max-age, which is fine (sliding window).

        setAuthCookies(res, newAccessToken, refreshToken);

        return res;
    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
