import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getUserById } from '@/lib/db/users';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json({ user: null });
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload) {
            return NextResponse.json({ user: null });
        }

        const user = await getUserById(payload.sub);
        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({
            user: { id: user.id, email: user.email, role: user.role, name: user.name },
        });
    } catch (error) {
        console.error('Me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
