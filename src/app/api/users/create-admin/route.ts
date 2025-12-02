import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { createUser } from '@/lib/db/users';

export async function POST(req: Request) {
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
                { error: 'Forbidden: Only superadmin can create admin users' },
                { status: 403 }
            );
        }

        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Password strength validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Create new admin user
        const newUser = await createUser(email, password, name, 'admin');

        return NextResponse.json(
            {
                message: 'Admin user created successfully',
                user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create admin error:', error);
        if (error.message === 'User with this email already exists') {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
