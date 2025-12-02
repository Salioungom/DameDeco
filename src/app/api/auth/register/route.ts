import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';

export async function POST(req: Request) {
    try {
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

        // Create new client user
        const newUser = await createUser(email, password, name, 'client');

        return NextResponse.json(
            {
                message: 'Registration successful',
                user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        if (error.message === 'User with this email already exists') {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
