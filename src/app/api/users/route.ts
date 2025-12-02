import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { getAllUsers } from '@/lib/db/users';

export async function GET(req: Request) {
    try {
        // Verify that the caller is a superadmin
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload || payload.role !== 'superadmin') {
            return NextResponse.json(
                { error: 'Forbidden: Only superadmin can list users' },
                { status: 403 }
            );
        }

        const users = await getAllUsers();
        return NextResponse.json({ users });
    } catch (error) {
        console.error('List users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
