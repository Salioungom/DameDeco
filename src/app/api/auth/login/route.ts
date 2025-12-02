import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAuthCookies } from '@/lib/auth/cookies';
import { getUserByEmail, storeRefreshToken } from '@/lib/db/users';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            // Use generic error message to avoid enumeration
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const accessToken = await signAccessToken({ sub: user.id, role: user.role });
        const refreshToken = await signRefreshToken({ sub: user.id });

        await storeRefreshToken(user.id, refreshToken);

        const res = NextResponse.json({
            user: { id: user.id, email: user.email, role: user.role, name: user.name },
        });

        setAuthCookies(res, accessToken, refreshToken);

        return res;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
