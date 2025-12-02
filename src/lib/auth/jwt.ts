import { SignJWT, jwtVerify } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '900'; // 15m
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export async function signAccessToken(payload: { sub: string; role: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_EXPIRES}s`)
        .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: { sub: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(REFRESH_EXPIRES)
        .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, ACCESS_SECRET);
        return payload as { sub: string; role: string };
    } catch (error) {
        return null;
    }
}

export async function verifyRefreshToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, REFRESH_SECRET);
        return payload as { sub: string };
    } catch (error) {
        return null;
    }
}
