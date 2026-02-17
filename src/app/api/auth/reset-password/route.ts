/**
 * Reset Password API Route
 * =========================
 * POST /api/auth/reset-password
 * Accepts a reset token and new password
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applySecurityHeaders } from '@/server/security/headers';
import { checkCSRF } from '@/lib/security/csrf';
import { rateLimit } from '@/lib/security/rate-limit';

const ResetPasswordSchema = z.object({
    token: z.string().uuid('Invalid reset token'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
        maxRequests: 5,
        windowMs: 900000, // 15 minutes
        message: 'Too many password reset attempts. Please try again later.',
    });

    if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
            { success: false, error: rateLimitResult.message },
            {
                status: 429,
                headers: {
                    'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );
        return applySecurityHeaders(response);
    }

    // CSRF protection
    const csrfError = checkCSRF(request);
    if (csrfError) return csrfError;

    try {
        const body = await request.json();
        const validation = ResetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    details: validation.error.issues.map(i => ({
                        field: i.path.join('.'),
                        message: i.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { token, password } = validation.data;

        // In production: Verify token from DB, check expiration, update password
        // TODO: Integrate with Supabase auth or user repository
        // For now, return a structured response

        const response = NextResponse.json({
            success: true,
            message: 'Password has been reset successfully. You can now log in with your new password.',
        });

        return applySecurityHeaders(response);

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'An error occurred while resetting your password.' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
