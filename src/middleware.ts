import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    // DÉSACTIVATION COMPLÈTE du middleware
    // Pour arrêter la boucle de redirection infernale
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
