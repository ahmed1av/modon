/**
 * Authentication API Routes
 * ==========================
 * Login endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/dal/repositories/SupabaseUserRepository';
import { LoginSchema } from '@/contracts/schemas';
import {
    generateAccessToken,
    generateRefreshToken,
    getPermissionsForRole,
} from '@/server/auth/jwt';
import { logAuthSuccess, logAuthFailure } from '@/discoverx/monitoring/logging';
import { applySecurityHeaders } from '@/server/security/headers';
import * as crypto from 'crypto';

function getClientIp(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

// ============================================
// POST /api/auth/login
// ============================================

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    try {
        const body = await request.json();

        // Validate input
        const validation = LoginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid credentials format',
                },
                { status: 400 }
            );
        }

        const { email, password, rememberMe } = validation.data;

        // Verify credentials
        let user = null;
        try {
            user = await userRepository.verifyPassword(email, password);
        } catch (dbError) {
            console.warn('Database verification failed, checking for mock admin...', dbError);
        }

        // MOCK FALLBACK - DEVELOPMENT ONLY
        // Accepts admin@modon.com / password123 as valid admin credentials
        // SECURITY: Disabled in production to prevent unauthorized access
        if (process.env.NODE_ENV !== 'production' &&
            !user &&
            email === 'admin@modon.com' &&
            password === 'password123') {

            console.log('⚠️ USING MOCK ADMIN CREDENTIALS (DEV ONLY - DB user not found or DB error)');
            user = {
                id: 'mock-admin-id',
                email: 'admin@modon.com',
                password_hash: 'mock-hash',
                status: 'active',
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                created_at: new Date(),
                updated_at: new Date(),
                permissions: ['*']
            } as any; // Type assertion to bypass strict entity checks for mock
        }

        if (!user) {
            logAuthFailure(email, ip, userAgent, 'Invalid credentials');

            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid email or password',
                },
                { status: 401 }
            );
        }

        // Check user status
        if (user.status !== 'active') {
            if (user.status === 'suspended') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Account suspended. Please contact support.',
                    },
                    { status: 403 }
                );
            }

            if (user.status === 'pending_verification') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Please verify your email before logging in.',
                        code: 'EMAIL_NOT_VERIFIED',
                    },
                    { status: 403 }
                );
            }
        }

        // Generate tokens - use type assertion or get permissions from user
        let permissions = (user as { permissions?: string[] }).permissions || [];

        if (permissions.length === 0 && user.role) {
            permissions = getPermissionsForRole(user.role);
        }

        const accessToken = await generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            permissions,
        });

        const refreshToken = await generateRefreshToken(user.id);

        // Create session & Update last login (SKIP FOR MOCK USERS)
        if (user.id !== 'mock-admin-id') {
            try {
                const refreshTokenHash = crypto
                    .createHash('sha256')
                    .update(refreshToken)
                    .digest('hex');

                await userRepository.createSession(user.id, refreshTokenHash, {
                    ip,
                    userAgent,
                });

                await userRepository.updateLastLogin(user.id, ip);

                // Log successful login
                logAuthSuccess(user.id, ip, userAgent);
            } catch (sessionError) {
                console.error('Session creation failed (non-fatal):', sessionError);
                // Continue login even if session/logging fails
            }
        } else {
            console.log('⚡ [MOCK MODE] Skipping DB session creation for mock admin');
        }

        // User from repository has firstName/lastName at top level
        const userData = user as {
            id: string;
            email: string;
            firstName?: string;
            lastName?: string;
            role: string;
            avatarUrl?: string;
        };

        const response = NextResponse.json({
            success: true,
            data: {
                user: {
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: userData.role,
                    avatarUrl: userData.avatarUrl,
                },
                accessToken,
                refreshToken,
                expiresIn: 900, // 15 minutes
            },
        });

        // Set secure cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
        };

        // CRITICAL: Set access token as cookie for middleware/API auth
        response.cookies.set('modon_auth_token', accessToken, {
            ...cookieOptions,
            maxAge: 900, // 15 minutes (matches JWT expiry)
        });

        // VULN-014 FIX: Cookie name standardized to 'modon_refresh_token' (matches logout endpoint)
        response.cookies.set('modon_refresh_token', refreshToken, {
            ...cookieOptions,
            maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days or 7 days
        });

        return applySecurityHeaders(response);

    } catch (error) {
        console.error('Login error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'An error occurred during login',
            },
            { status: 500 }
        );
    }
}
