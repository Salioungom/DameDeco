import bcrypt from 'bcrypt';

// Mock Data Types
export interface User {
    id: string;
    email?: string;
    phone?: string;
    passwordHash: string;
    role: 'admin' | 'client' | 'superadmin';
    name: string;
}

export interface RefreshToken {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}

// In-memory storage (resets on server restart)
// In a real app, this would be a database connection
const users: User[] = [];
const refreshTokens: RefreshToken[] = [];

// Seed initial users
(async () => {
    const adminPass = await bcrypt.hash('admin123', 10);
    const clientPass = await bcrypt.hash('client123', 10);
    const superAdminPass = await bcrypt.hash('super123', 10);

    users.push({
        id: '1',
        email: 'admin@example.com',
        passwordHash: adminPass,
        role: 'admin',
        name: 'Admin User',
    });

    users.push({
        id: '2',
        email: 'client@example.com',
        passwordHash: clientPass,
        role: 'client',
        name: 'Client User',
    });

    users.push({
        id: '3',
        email: 'superadmin@example.com',
        passwordHash: superAdminPass,
        role: 'superadmin',
        name: 'Super Admin',
    });
})();

export async function getUserByEmail(email: string): Promise<User | undefined> {
    return users.find((u) => u.email === email);
}

export async function getUserByPhone(phone: string): Promise<User | undefined> {
    return users.find((u) => u.phone === phone);
}

export async function getUserByIdentifier(identifier: string): Promise<User | undefined> {
    return users.find((u) => u.email === identifier || u.phone === identifier);
}

export async function getUserById(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id);
}

export async function storeRefreshToken(userId: string, token: string) {
    // Hash the token before storing for security
    // In a real app, we might just store the token if we want to be able to look it up directly,
    // but hashing is safer if the DB is compromised.
    // However, for refresh rotation, we usually need to match the incoming token.
    // Here we'll store it as is for simplicity in this mock, or hash it if we want to verify it like a password.
    // Let's hash it to follow best practices mentioned in the prompt.

    // Note: To verify a hashed token, we need the original token.
    // When refreshing, we get the original token from the cookie.

    // Remove existing tokens for this user to enforce single session (optional, but good for security)
    // Or keep them to allow multiple devices. Let's allow multiple for now but clean up old ones.
    const index = refreshTokens.findIndex(rt => rt.userId === userId);
    if (index !== -1) {
        refreshTokens.splice(index, 1); // Simple single session for this mock
    }

    const tokenHash = await bcrypt.hash(token, 10);
    refreshTokens.push({
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
}

export async function verifyRevokedToken(userId: string, token: string): Promise<boolean> {
    const storedToken = refreshTokens.find((rt) => rt.userId === userId);
    if (!storedToken) return false;

    const isValid = await bcrypt.compare(token, storedToken.tokenHash);
    if (isValid && new Date() < storedToken.expiresAt) {
        return true;
    }
    return false;
}

export async function revokeRefreshToken(userId: string) {
    const index = refreshTokens.findIndex((rt) => rt.userId === userId);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }
}

export async function createUser(
    data: { email?: string; phone?: string; password: string; name: string; role: 'admin' | 'client' | 'superadmin' }
): Promise<User> {
    const { email, phone, password, name, role } = data;

    // Check if user already exists
    if (email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
    }

    if (phone) {
        const existingUser = await getUserByPhone(phone);
        if (existingUser) {
            throw new Error('Un utilisateur avec ce numéro de téléphone existe déjà');
        }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
        id: String(users.length + 1),
        email,
        phone,
        passwordHash,
        role,
        name,
    };

    users.push(newUser);
    return newUser;
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    return users.map(({ passwordHash, ...user }) => user);
}
