/**
 * Registration API Route (SECURED)
 * =================================
 * Rate-limited registration with CSRF protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/dal/repositories/SupabaseUserRepository';
import { RegisterSchema } from '@/contracts/schemas';
import { applySecurityHeaders } from '@/server/security/headers';
import { checkCSRF } from '@/lib/security/csrf';
import { rateLimit } from '@/lib/security/rate-limit';

function getClientIp(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

// ============================================
// POST /api/auth/register (RATE LIMITED + CSRF)
// ============================================

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    // ============================================
    // RATE LIMITING (prevents enumeration attacks)
    // ============================================
    const rateLimitResult = await rateLimit(request, {
        maxRequests: 5,       // Max 5 registration attempts
        windowMs: 3600000,    // Per 1 hour
        message: 'Too many registration attempts. Please try again later.',
    });

    if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
            {
                success: false,
                error: rateLimitResult.message,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );
        return applySecurityHeaders(response);
    }

    // ============================================
    // CSRF PROTECTION
    // ============================================
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    try {
        const body = await request.json();

        // Validate input
        const validation = RegisterSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid registration data',
                    details: validation.error.issues.map(i => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { email, password, profile } = validation.data;

        // Check if email already exists
        const exists = await userRepository.exists(email);
        if (exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'An account with this email already exists',
                },
                { status: 409 }
            );
        }

        // Create user
        const user = await userRepository.create({
            email,
            password,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: 'buyer',
        });

        // Access user profile data safely
        const userData = user as unknown as {
            id: string;
            email: string;
            firstName?: string;
            lastName?: string;
            profile?: { firstName?: string; lastName?: string };
        };

        const firstName = userData.firstName || userData.profile?.firstName || profile.firstName;
        const lastName = userData.lastName || userData.profile?.lastName || profile.lastName;

        const response = NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName,
                    lastName,
                },
                message: 'Registration successful. Please check your email to verify your account.',
            },
        }, { status: 201 });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'An error occurred during registration',
            },
            { status: 500 }
        );
    }
}
