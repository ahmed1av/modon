/**
 * MODON Platform - JWT Authentication (Server Layer)
 * ===================================================
 * Secure token generation and verification
 */

// ============================================
// TYPES
// ============================================

export type UserRole = 'buyer' | 'agent' | 'admin' | 'super_admin';

export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    permissions: string[];
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

// ============================================
// CONFIGURATION (Lazy Initialization)
// ============================================

// SECURITY: Secrets are validated at call time, NOT at import time.
// This prevents the Next.js build from crashing when JWT env vars
// are not set (e.g., during static page generation or client builds).

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            'FATAL: JWT_SECRET environment variable is not set. ' +
            'This is required for secure authentication. ' +
            'Please set JWT_SECRET in your environment configuration.'
        );
    }
    return secret;
}

function getJwtRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error(
            'FATAL: JWT_REFRESH_SECRET environment variable is not set. ' +
            'This is required for secure authentication. ' +
            'Please set JWT_REFRESH_SECRET in your environment configuration.'
        );
    }
    return secret;
}

// ============================================
// SIMPLE JWT IMPLEMENTATION
// (Production should use 'jose' library)
// ============================================

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64').toString();
}

/**
 * Create HMAC signature
 */
async function createSignature(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify HMAC signature
 */
async function verifySignature(
    data: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const expectedSignature = await createSignature(data, secret);

    // Constant-time comparison
    if (expectedSignature.length !== signature.length) return false;

    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
        result |= expectedSignature.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return result === 0;
}

// ============================================
// TOKEN GENERATION
// ============================================

/**
 * Generate Access Token (Short-lived)
 */
export async function generateAccessToken(payload: TokenPayload): Promise<string> {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const claims = {
        ...payload,
        iat: now,
        exp: now + ACCESS_TOKEN_EXPIRY,
        iss: 'modon-platform',
        aud: 'modon-api',
        jti: crypto.randomUUID(),
    };

    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(claims));
    const data = `${headerB64}.${payloadB64}`;
    const signature = await createSignature(data, getJwtSecret());

    return `${data}.${signature}`;
}

/**
 * Generate Refresh Token (Long-lived)
 */
export async function generateRefreshToken(userId: string): Promise<string> {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const claims = {
        userId,
        type: 'refresh',
        iat: now,
        exp: now + REFRESH_TOKEN_EXPIRY,
        iss: 'modon-platform',
        jti: crypto.randomUUID(),
    };

    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(claims));
    const data = `${headerB64}.${payloadB64}`;
    const signature = await createSignature(data, getJwtRefreshSecret());

    return `${data}.${signature}`;
}

/**
 * Generate Token Pair
 */
export async function generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(payload),
        generateRefreshToken(payload.userId),
    ]);

    return {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRY,
    };
}

// ============================================
// TOKEN VERIFICATION
// ============================================

/**
 * Verify Access Token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, payloadB64, signature] = parts;
        const data = `${headerB64}.${payloadB64}`;

        // Verify signature
        const isValid = await verifySignature(data, signature, getJwtSecret());
        if (!isValid) return null;

        // Parse payload
        const payload = JSON.parse(base64UrlDecode(payloadB64));

        // Verify expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;

        // Verify issuer
        if (payload.iss !== 'modon-platform') return null;

        // Verify audience
        if (payload.aud !== 'modon-api') return null;

        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || [],
        };

    } catch {
        return null;
    }
}

/**
 * Verify Refresh Token
 */
export async function verifyRefreshToken(
    token: string
): Promise<{ userId: string } | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [headerB64, payloadB64, signature] = parts;
        const data = `${headerB64}.${payloadB64}`;

        // Verify signature
        const isValid = await verifySignature(data, signature, getJwtRefreshSecret());
        if (!isValid) return null;

        // Parse payload
        const payload = JSON.parse(base64UrlDecode(payloadB64));

        // Verify expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;

        // Verify type
        if (payload.type !== 'refresh') return null;

        return { userId: payload.userId };

    } catch {
        return null;
    }
}

// ============================================
// TOKEN UTILITIES
// ============================================

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader) return null;

    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    return null;
}

/**
 * Parse token without verification (for debugging)
 */
export function parseToken(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        return JSON.parse(base64UrlDecode(parts[1]));
    } catch {
        return null;
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = parseToken(token);
    if (!payload || typeof payload.exp !== 'number') return true;

    return payload.exp < Math.floor(Date.now() / 1000);
}

/**
 * Get token expiration time
 */
export function getTokenExpiry(token: string): Date | null {
    const payload = parseToken(token);
    if (!payload || typeof payload.exp !== 'number') return null;

    return new Date(payload.exp * 1000);
}

// ============================================
// PERMISSION HELPERS
// ============================================

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    buyer: [
        'properties:read',
        'favorites:manage',
        'inquiries:create',
        'profile:manage',
    ],
    agent: [
        'properties:read',
        'properties:create',
        'properties:update',
        'favorites:manage',
        'inquiries:read',
        'inquiries:manage',
        'profile:manage',
        'analytics:own',
    ],
    admin: [
        'properties:read',
        'properties:create',
        'properties:update',
        'properties:delete',
        'users:read',
        'users:manage',
        'agents:manage',
        'inquiries:read',
        'inquiries:manage',
        'analytics:view',
        'admin:access',
    ],
    super_admin: [
        'properties:read',
        'properties:create',
        'properties:update',
        'properties:delete',
        'users:read',
        'users:create',
        'users:manage',
        'users:delete',
        'agents:manage',
        'inquiries:read',
        'inquiries:manage',
        'analytics:view',
        'analytics:export',
        'admin:access',
        'admin:settings',
        'system:manage',
    ],
};

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: UserRole): string[] {
    return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if user has permission
 */
export function hasPermission(
    userPermissions: string[],
    requiredPermission: string
): boolean {
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(requiredPermission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
    userPermissions: string[],
    requiredPermissions: string[]
): boolean {
    if (userPermissions.includes('*')) return true;
    return requiredPermissions.some(p => userPermissions.includes(p));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(
    userPermissions: string[],
    requiredPermissions: string[]
): boolean {
    if (userPermissions.includes('*')) return true;
    return requiredPermissions.every(p => userPermissions.includes(p));
}
