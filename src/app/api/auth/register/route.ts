import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db/users';

export async function POST(req: Request) {
    try {
        const { email, phone, password, name } = await req.json();

        if ((!email && !phone) || !password || !name) {
            return NextResponse.json(
                { error: 'Email ou Téléphone, mot de passe et nom sont requis' },
                { status: 400 }
            );
        }

        // Basic validation
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: 'Format email invalide' }, { status: 400 });
            }
        }

        if (phone) {
            // Basic phone validation (at least 9 digits)
            const phoneRegex = /^\+?[0-9]{9,}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                return NextResponse.json({ error: 'Format téléphone invalide' }, { status: 400 });
            }
        }

        // Password strength validation
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 6 caractères' },
                { status: 400 }
            );
        }

        // Create new client user
        const newUser = await createUser({
            email,
            phone,
            password,
            name,
            role: 'client'
        });

        return NextResponse.json(
            {
                message: 'Inscription réussie',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    phone: newUser.phone,
                    role: newUser.role,
                    name: newUser.name
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        if (error.message.includes('existe déjà')) {
            return NextResponse.json({ error: error.message }, { status: 409 });
        }
        return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
    }
}
